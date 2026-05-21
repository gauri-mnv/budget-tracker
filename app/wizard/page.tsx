import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import  CurrencyComboBox from "@/components/CurrencyComboBox";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div
      className="container flex
                max-w-2xl
                flex-col
                items-center
                justify-between
                gap-4"
    >
      <div>
        <h1 className="text-center text-3xl font-bold">
          Welcome ,
          <span className="ml-2 font-semibold text-accent">
            {user.firstName}! 
          </span>
           <span className="ml-2 inline-block bg-gradient-to-r from-[#06acb8] to-[#0778bb] bg-clip-text text-transparent">
    🖐️
  </span>
        </h1>
        <h2 className="text-center text-muted-foreground text-base mt-4">
          Let &apos;s get started by setting up your currency
        </h2>

        <h3 className="text-center mt-2 text-sm text-muted-foreground ">
          you can change these settings later
        </h3>
      </div>
      <Separator />

      <Card className="w-full">
        <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency for transactions</CardDescription>

        </CardHeader>
        <CardContent>
            <CurrencyComboBox />
            </CardContent>
        </Card>
            <Separator />
            <Button className="w-full" asChild>
                <Link href="/">I&apos;m done! Take me to my dashboard</Link>
            </Button>

            <div className="mt-8">
                <Logo />
            </div>

    </div>
  );
};

export default page;
