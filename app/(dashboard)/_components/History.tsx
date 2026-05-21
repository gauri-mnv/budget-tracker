/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormmatterForCurrency } from "@/lib/helper";
import { period, Timeframe } from "@/lib/type";
import { UserSettings } from "@prisma/client";
import React, { useCallback, useMemo, useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { min } from "date-fns/min";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return GetFormmatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyDataQuery = useQuery({
    queryKey: ["history", "overview", period, timeframe],
    queryFn: () => {
      return fetch(
        `/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`,
      ).then((res) => res.json());
    },
  });

  const chartData = useMemo(() => {
  if (!historyDataQuery.data) return [];

  return historyDataQuery.data.map((item: { income:string; expense: string; }) => ({
    ...item,
    income: Number(item.income),
    expense: Number(item.expense),
  }));
}, [historyDataQuery.data]);

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;
  return (
    <div className="container">
      <h2 className="mt-12 text-3xl font-bold"> History</h2>
      <Card className="col-span-12 mt-2 w-full ">
        <CardHeader className="gap-2 ">
          <CardTitle
            className="grid 
                            grid-flow-row 
                            justify-between 
                            gap-2
                            md:grid-flow-col"
          >
            <HistoryPeriodSelector
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              period={period}
              setPeriod={setPeriod}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-rose-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching} fullwidth>
            {dataAvailable && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} height={300} barCategoryGap={5}>
                   <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#14ca93" stopOpacity="1" />
                        <stop offset="1" stopColor="#14ca93" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#f43f5e" stopOpacity="1" />
                        <stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
                    </linearGradient>
                    </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    stopOpacity={"0.2"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleDateString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleDateString("default", {
                        day: "2-digit",
                      });
                    }}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "auto"]}
                  />

                  <Bar
                    dataKey="income"
                    fill="url(#incomeBar)"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    className="cursor-pointer"
                  />

                  <Bar
                    dataKey="expense"
                    fill="url(#expenseBar)"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    className="cursor-pointer"
                  />
                  <Tooltip cursor={{opacity:0.1}} content={props=>(
                    <CustomTooltip  formatter={formatter} {...props} />
                  )}
                   />
                </BarChart>
              </ResponsiveContainer>
            )}

            {!dataAvailable && (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                No data for the selected period
                <p className="text-muted-foreground text-sm">
                  try selecting a different period or try adding new{" "}
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default History;


function CustomTooltip({ active, payload, formatter }:any) {
if (!active || !payload || payload.length === 0) {
    return null;
  }
 
  console.log("payload", payload, "active", active, "formatter", formatter);
   const data = payload[0].payload;
  const { income, expense } = data;

return(
    <div className="min-w-[400px] rounded border bg-background p-2">       
               <TooltipRow 
               formatter={formatter} 
               label="Expense" 
               value={expense} 
               bgcolor="text-rose-400" 
               textColor="text-rose-700" />
                <TooltipRow 
               formatter={formatter} 
               label="Income" 
               value={income} 
               bgcolor="text-emerald-500" 
               textColor="text-emerald-700" />
                <TooltipRow 
               formatter={formatter} 
               label="Balance" 
               value={income-expense} 
               bgcolor="text-violet-500" 
               textColor="text-foreground" />
                  </div>
)
}

function TooltipRow({ label, value, bgcolor, textColor, formatter }: {

label:string;
textColor:string;
bgcolor:string;
value:number;
formatter:Intl.NumberFormat;

}){
  const formattingFn =useCallback(
    (value:number)=>{

      return formatter.format(value);
    },
    [formatter]
  )

    return(
        <div className="
             flex items-center gap-2  ">
                <div className={cn("h-4 w-4 rounded-full", bgcolor)} />
                    <div className="flex w-full justify-left gap-2 rounded bg-muted/50 px-2 py-1">
                        <p className="text-sm text-muted-foreground ">{label}</p>
                        <div className={cn("h-4 w-4 rounded-full", textColor)}>
                          <CountUp 
                            duration={0.5} 
                            preserveValue                          
                            end={value}
                            // separator=","
                            decimals={0}
                            formattingFn={formattingFn}
                            className={"text-sm"}
                          />

                        </div>
                </div>
             </div>
    )

}