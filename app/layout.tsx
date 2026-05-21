import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
 import { TooltipProvider } from "@/components/ui/tooltip";
import RootProvider from "@/components/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "BudgetTracker",
  description: "BudgetTracker",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
      <ClerkProvider afterSignOutUrl="/sign-in">
            <html
      lang="en"
      suppressHydrationWarning
      className={cn('dark', "font-sans", geist.variable)} style={{ scrollBehavior: "smooth",  colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col justify-content" cz-shortcut-listen="true">
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
        {/* <TooltipProvider> */}
        <Toaster richColors position ="bottom-right" />
        <RootProvider>{children}</RootProvider>
        </ThemeProvider>
        {/* </TooltipProvider> */}
        {/* <TooltipProvider>{children}</TooltipProvider> */}
        </body>
    </html>
      </ClerkProvider>

  );
}
