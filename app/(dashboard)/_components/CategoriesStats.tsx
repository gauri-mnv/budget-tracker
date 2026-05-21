"use client";

import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormmatterForCurrency } from "@/lib/helper";
import { TransactionType } from "@/lib/type";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";


interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats","categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${from.toISOString()}&to=${to.toISOString()}`,
      ).then((res) => res.json()),
  });
//   console.log("statsQuery",statsQuery.data, "type of data", typeof statsQuery.data ,"/n","isArray", Array.isArray(statsQuery.data));
//   console.log("data lenght" ,statsQuery.data?.length)
  const formatter = useMemo(() => {
    return GetFormmatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
        data={statsQuery.data? statsQuery.data : [] }
         type={"expense"}
          formatter={formatter}
        />
       
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
         <CategoriesCard
        data={statsQuery.data? statsQuery.data : [] }
         type={"income"}
          formatter={formatter}
        />
        </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
   data: GetCategoriesStatsResponseType;
  formatter: Intl.NumberFormat;
   type: TransactionType;
}) {
    // console.log("data",data.length,"type",typeof(data),"/n","isArray", Array.isArray(data));
    // console.log("filteredData   1",data[0].type,type);
    //  console.log("filteredData   1",data);

    // const filteredData = data.filter((d) => d.type === type);
  const filteredData = Array.isArray(data)
    ? data.filter((d) => d.type === type)
    : [];
  const total = filteredData.reduce(
    (acc, item) => acc + (item._sum?.amount || 0),
    0,
  );
  //const percentage = (total / data.reduce((acc, item) => acc + item.amount, 0)) * 100;
// console.log("filteredData",filteredData);
  return (
    <Card className=" h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="
        grid 
        grid-flow-row 
        justify-between 
        gap-2 
        text-muted-foreground 
        md:grid-flow-col">
             {type === "income" ? "Incomes" : "Expenses"} by Category
        </CardTitle>
      </CardHeader>
      <div
        className="
                flex item-center justify-between
                gap-2
               "
      >
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for the selected period
            <p className="text-sm text-muted-foreground">
              try selecting a different period or try adding new{" "}
              {type === "income" ? "Income" : "Expense"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum?.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className=" flex items-center text-gray-400">
                        {item.categoryIcon}
                        {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span
                      className="text-sn text-gray-400"
                      >{formatter.format(amount)}</span>
                    </div>
                    <Progress value={percentage}
                    indicator={type==="income"? "bg-emerald-400":"bg-rose-300"}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
