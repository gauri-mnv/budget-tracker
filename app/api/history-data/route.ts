
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import z from "zod";
import { period, Timeframe } from "@/lib/type";
import { getDaysInMonth } from "date-fns/getDaysInMonth";

const getHistoryDataSchema = z.object({
    
    timeframe: z.enum([ "month", "year"]),
    month:z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000),

})
export async function GET(request: Request) {
    const user = await currentUser();

    if(!user){
        redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
     const timeframe = searchParams.get("timeframe");
    const year = searchParams.get("year");
        const month = searchParams.get("month");

     const queryParam = getHistoryDataSchema.safeParse({
        timeframe,
        month,
        year,
     });
     if(!queryParam.success){
        return Response.json(queryParam.error.message,{status:400});
     }
    //  const { timeframe, month, year } = queryParam.data;
    

const data =await getHistoryData(user.id,queryParam.data.timeframe,{
    month: queryParam.data.month,
    year: queryParam.data.year
});
 
return Response.json(data);
};


export type GetHistoryDataResponseType  = Awaited<
ReturnType<typeof getHistoryData> >;          

async function getHistoryData(
                      userId: string, 
                      timeframe: Timeframe, 
                      period: period) {

           switch (timeframe) {
            case "year":
                return await getYearlyHistoryData(userId, period.year);
                case "month":
                    return await getMonthlyHistoryData(userId, period.year, period.month);

           } 
                        
                      }

type HistoryData = {
    expense: number;
    income: number;
    year: number;
    month: number;
    day?:number;

}

async function getYearlyHistoryData(userId: string, year: number) {

    const result = await prisma.yearHistory.groupBy({
        by:["month"],
        where:{
            userId,
            year,
        
        },
        _sum:{
            expense: true,
            income: true,
        } ,
        orderBy: {
            month: "asc",
        },
    });

    if(!result
|| result.length === 0){
        return [];
    }
const history :HistoryData[] =[];

for(let i=0; i<12; i++){
    let expense =0;
    let income =0;
    const monthData = result.find((item) => item.month === i);
    if(monthData){
        expense = monthData._sum.expense || 0;
        income = monthData._sum.income || 0;
    }
    history.push({ expense, income, year, month: i });
}


    return history;
}

async function getMonthlyHistoryData(
            userId: string, 
            year: number, 
            month: number) {
                  const result = await prisma.monthHistory.groupBy({
        by:["day"],
        where:{
            userId,
            year,
            month,
        
        },
        _sum:{
            expense: true,
            income: true,
        } ,
        orderBy: {
            day: "asc",
        },
    });

    if(!result
|| result.length === 0){
        return [];
    }
const history :HistoryData[] =[];
const daysInMonth = getDaysInMonth(new Date(year, month));

for(let i=0; i<=daysInMonth; i++){
    let expense =0;
    let income =0;

    const day = result.find((item) => item.day === i);
    if(day){
        expense = day._sum.expense || 0;
        income = day._sum.income || 0;
    }
    history.push({ expense, income, year, month, day: i });
}


    return history;
            }


export type GetHistoryPeriodsResponseType = Awaited<
                                            ReturnType<
                                            typeof 
                                            getHistoryPeriods
                                            >>;


async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: { userId },
    select: {
        year: true,
    },
    distinct: ["year"],
    orderBy: [
        {
            year: "asc",
        }
    ],
  });

  const years = result.map((item) => item.year);
  if(years.length === 0){
   //return current year if there is no history 
        return[
            new Date().getFullYear()
        ]

  }
  return years;

}