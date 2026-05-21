
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { Prisma } from "@/lib/generated/prisma/wasm";
import { GetFormmatterForCurrency } from "@/lib/helper";
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
    return Response.json(queryParam.error.message,{status:400}); //"Invalid query parameters", { status: 400 });
 }

    // 2. Use the parsed Zod outputs (which are now properly structured objects)
    const transactions = await getTransactionsHistory(
        user.id,
        new Date(queryParam.data.from),
        new Date(queryParam.data.to)
    );

 return Response.json(transactions);
}

export type GetTransactionsHistoryResponseType = Awaited<ReturnType<typeof getTransactionsHistory>>

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  // Let Prisma infer the structure of the grouping results natively
  const userSettings = await prisma.userSettings.findUnique({
    where: {userId: userId}}); 

    if(!userSettings){
        throw new Error("User settings not found");
    }
    
    const formatter = GetFormmatterForCurrency(userSettings.currency);


  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });


  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formatter.format(transaction.amount)
  }));
}

