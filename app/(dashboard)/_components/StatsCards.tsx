"use client";

import { GetBalanceStatsResponse } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormmatterForCurrency } from "@/lib/helper";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponse>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${from.toISOString()}&to=${to.toISOString()}`,
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormmatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            // <TrendingUp className="h-6 w-6 rounded-lg p-2 text-emerald-400 bg-emerald-400/10" />
            <div className="rounded-lg bg-emerald-400/10 p-0.5">
              <TrendingUp className="h-10 w-10 text-emerald-400" />
            </div>
          }
        />
      </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            // <TrendingUp className="h-6 w-6 rounded-lg p-2 text-emerald-400 bg-emerald-400/10" />
            <div className="rounded-lg bg-rose-400/10 p-0.5">
              < TrendingDown className="h-10 w-10 text-rose-500" />
            </div>
          }
        />
      </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            // <TrendingUp className="h-6 w-6 rounded-lg p-2 text-emerald-400 bg-emerald-400/10" />
            <div className="rounded-lg bg-cyan-400/10 p-0.5">
              <Wallet className="h-10 w-10 text-cyan-600" />
            </div>
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter],
  );

  return (
    <Card className="flex flex-row h-25 w-full items-center gap-4 p-5 mb-4">
      <div>{icon}</div>
      <div className="flex flex-col items-start gap-1">
        <p className="text-muted-foreground ">{title}</p>
        <CountUp
          preserveValue
          end={value}
          redraw={false}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
