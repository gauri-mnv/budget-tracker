import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import  History  from "./_components/History";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    // <div className="h-full bg-background justify-center">
      <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-card">
        <div
          className="container 
                      mx-auto
                       flex flex-wrap
                       items-center
                        justify-between
                         gap-6 py-8"
        >
          <p className="text-3xl font-bold text-foreground">
            Hi,
            <span className="ml-2 font-semibold text-[#06acb8]">
              {user.firstName}!
            </span>
            <span className="ml-2 inline-block bg-gradient-to-r from-[#06acb8] to-[#0778bb] bg-clip-text text-transparent">
              🖐️
            </span>
          </p>

          <div className="flex items-center gap-4">
            <CreateTransactionDialog trigger={
              <Button
              variant={"outline"}
              className="border-e-emerald-400 bg-emerald-900
                                  text-white hover:bg-emerald-600 hover:text-white"
            >
              New Income 🤑
            </Button>
            }
            type="income" />

            <CreateTransactionDialog  trigger={

              <Button
              variant={"outline"}
              className="border-e-rose-400 bg-rose-900
                                  text-white hover:bg-rose-600 hover:text-white"
            >
              New expance 😤
            </Button>
             }
             type="expense" />
  
            
          </div>
        </div>
      </div>
     <div className="container mx-auto px-4 py-6 space-y-8">
  <Overview userSettings={userSettings} />
  <History userSettings={userSettings} />
</div>
    </div>
  );
};

export default page;
