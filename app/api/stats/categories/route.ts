
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
export async function GET(request: Request) {
    const user = await currentUser();

    if(!user){
        redirect("/sign-in");
    }
 const { searchParams } = new URL(request.url);
const from = searchParams.get("from");
const to = searchParams.get("to");

 const queryParam = OverviewQuerySchema.safeParse({from,to});

 if(!queryParam.success){
    return Response.json(queryParam.error.message,{status:400});
 }


 const stats = await getCategoriesStats(
    user.id,
    queryParam.data.from,
    queryParam.data.to);
 
return Response.json(stats);
};

export type GetCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>

async function getCategoriesStats(userId:string,from:Date,to:Date){
    const stats = await prisma.transaction.groupBy({
        by: ["type","categoryIcon","category"],
        
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
        orderBy: {
            _sum: {
                amount: "desc",
            },
        },
    });
    return stats;
}