
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { Prisma } from "@/lib/generated/prisma/wasm";
export async function GET(request: Request) {
    const user = await currentUser();

    if(!user){
        redirect("/sign-in");
    }

 const { searchParams } = new URL(request.url);
 const from = searchParams.get("from");
 const to = searchParams.get("to");
 if (!from || !to) {
    return new NextResponse("Missing date parameters", { status: 400 });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return new NextResponse("Invalid date format provided", { status: 400 });
  }

const queryParam = OverviewQuerySchema.safeParse({from,to});
 
 if(!queryParam.success){
    return new NextResponse("Invalid query parameters", { status: 400 });
 }


    // 2. Use the parsed Zod outputs (which are now properly structured objects)
    const stats = await getBalanceStats(
        user.id,
        new Date(queryParam.data.from),
        new Date(queryParam.data.to)
    );

//  const stats = await getBalanceStats(user.id,queryParam.data.from,queryParam.data.to);
 return Response.json(stats);
}

export type GetBalanceStatsResponse = Awaited<ReturnType<typeof getBalanceStats>>

async function getBalanceStats(userId: string, from: Date, to: Date) {
  // Let Prisma infer the structure of the grouping results natively
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

const incomeObj = totals.find(
    (t: { type: string; _sum: { amount: number | null } }) => t.type === "income"
  );
  
  const expenseObj = totals.find(
    (t: { type: string; _sum: { amount: number | null } }) => t.type === "expense"
  );

  return {
    income: incomeObj?._sum?.amount ?? 0,
    expense: expenseObj?._sum?.amount ?? 0,
  };
}
