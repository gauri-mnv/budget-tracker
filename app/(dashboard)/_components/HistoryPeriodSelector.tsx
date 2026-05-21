"use client";
import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { period, Timeframe } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface props {
  period: period;
  setPeriod: (period: period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: props) {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch("/api/history-periods").then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullwidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            {/* <TabsTrigger value="week">Week</TabsTrigger> */}
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div
        className="
            flex flex-wrap items-center gap-4
            "
      >
        <SkeletonWrapper isLoading={historyPeriods.isFetching}
          fullwidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data ? historyPeriods.data : []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullwidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: period;
  setPeriod: (period: period) => void;
  years: GetHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className={"w-[180px]"}>
        <SelectValue />
        <SelectContent>
          {years.map((year: any) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: period;
  setPeriod: (period: period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className={"w-[180px]"}>
        <SelectValue />
        <SelectContent>
          {[0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
            const monthStr =new Date(period.year, month , 1).toLocaleDateString(
                "default",
                { month: "long" },
            )
            return (
              <SelectItem key={month} value={month.toString()}>
                {monthStr}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
}
