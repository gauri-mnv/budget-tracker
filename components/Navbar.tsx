"use client";

import React from 'react'
import Logo, { LogoMobile } from './Logo'
import { usePathname } from 'next/navigation'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/dist/client/link'
import { UserButton } from '@clerk/nextjs';
import { ThemeSwitchBtn } from './ThemeSwitchBtn';
import { Sheet ,SheetContent,SheetTrigger} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  return <>
  <DesktopNavbar />
  <MobileNavbar />
  
  </>
}

const items = [
{
    label:"Dashboard" , link:"/"
},
{
    label:"Transactions" , link:"/transactions"
},
{
    label:"Manage" , link:"/manage"
},

]

function MobileNavbar() {
    const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className='block md:hidden border-separate bg-background '>
    <nav className='container mx-auto flex items-center justify-between px-8'>

        <Sheet open={isOpen} onOpenChange={setIsOpen} >
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background w-[400px] sm:w-135" 
             >
                <Logo />
                <div  className="flex flex-col gap-1 pt-4">
                    {items.map((item) => (
                    <NavbarItem 
                    key={item.label} 
                    link={item.link} 
                    label={item.label} 
                    clickCallback={() => setIsOpen(prev => !prev)}
                    />))}
                </div>
                
                </SheetContent>
        </Sheet>
        <div className='flex h-[80px] min-h-[60px] gap-x-4' >
            <LogoMobile/>
            </div>
            <div className='flex items-center gap-2' >
                <ThemeSwitchBtn />
                <UserButton  />
            </div>
    </nav>
    </div>
  )
}

function DesktopNavbar() {
  return (
    <div className='hidden border-b bg-background md:block'>

    <nav className='container mx-auto flex h-16 items-center justify-between px-4'>    
    <div className='flex items-center h-[80px] min-h-[60px] gap-x-4'>
        <Logo />
        <div className="flex items-center gap-1 ">
                {items.map((item) => (
                    <NavbarItem 
                    key={item.label} 
                    link={item.link} 
                    label={item.label}  />))}
        </div>
    </div>
    <div className='flex items-center gap-2' >
        <ThemeSwitchBtn />
        <UserButton  />
        
    </div>
    </nav>
    
    </div>
  )}

  function NavbarItem({label,link,clickCallback}:{label:string,link:string , clickCallback?: () => void}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex flex-col justify-between">
            <Link href={link} className={cn(buttonVariants({variant:"ghost"}), 
            "w-full justify-start text-lg text-muted-foreground hover:text-foreground ",
            isActive && "text-foreground")}
            onClick ={()=>{
                if (clickCallback) 
                    clickCallback();
                }
                    
            }
            >

            {label}
            </Link>
            {
                isActive && (
                    <div className="absolute -bottom-0.5 
                    left-1/2 hidden 
                    h-0.5 w-[80%] 
                    -translate-x-1/2 rounded-xl 
                    bg-foreground md:block">


                    </div>
                ) 
            }
        </div>
        
    );

  }

export default Navbar