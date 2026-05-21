"use client";
import React, { useState } from "react";
import { UserSettings } from "@prisma/client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { differenceInDays } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  });
  return (
    <>
      <div
        className="container 
                    flex 
                    flex-wrap 
                    items-end
                    justify-between 
                    gap-2
                    py-6"
      >
        <h2 className="text-3xl font-bold ">overview</h2>
        <div className="flex items-center gap3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is greater . max allowed ${MAX_DATE_RANGE_DAYS} days`,
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div
        className=" container flex  w-full flex-col gap2
    "
      >
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}

export default Overview;
