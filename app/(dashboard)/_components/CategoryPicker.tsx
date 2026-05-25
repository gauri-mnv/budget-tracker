"use client";

import { TransactionType } from "@/lib/type";
 import { Category } from "@/lib/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import CreateCategoryDialog from "@/app/(dashboard)/_components/CreateCategoryDialog";
import { CommandEmpty, CommandGroup, CommandList } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;

}

function CategoryPicker({ type,onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if(!value) return
    onChange(value);
  }, [onchange,value]);

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await fetch(`/api/categories?type=${type}`);
  

      const data = await res.json();

          console.log("res",data);
      return data;
    },
  });

 const categories = categoriesQuery.data || [];

const selectedCategory = categories.find(
  (category: Category) => category.name === value
);

const successCallback = useCallback((category: Category) => {
  setValue(category.name);
  setOpen((prev)=>!prev);
},[setOpen,setValue]);

  return <Popover open={open} 
          onOpenChange={setOpen } >
            <PopoverTrigger asChild>    
              <Button variant={"outline"} 
              className="w-[200px] 
              justify-between " 
              role="combobox"
              aria-expanded={open}
              >
                {selectedCategory? (
                  <CategoryRow category={selectedCategory} />
                  ) : (
                  <span>Select a category</span>
                 
                )}
                 <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>   
            <PopoverContent className="w-[200px] p-0">
              <Command onSubmit={e => e.preventDefault()}>
                <CommandInput placeholder="Search category..." />
                <CreateCategoryDialog type={type} 
                successCallback={successCallback}/>
                <CommandEmpty>
                  <p>No category found.</p>
                  <p className="text-xs text-muted-foreground">
                    Tip: You can create a category using the button 
                  </p>
                </CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {
                      categoriesQuery.data && categoriesQuery.data.map((category: Category) => (
                        <CommandItem
                          key={category.name}
                          value={category.name}
                          onSelect={() => {
                            setValue(category.name);
                            setOpen((prev)=>!prev);
                          }}
                        >
                          <CategoryRow category={category} />
                          <Check className={cn("mr-2 h-4 w-4 opacity-0", value === category.name && "opacity-100")} />
                        </CommandItem>
                        
                      ))
                    }
                  </CommandList>
                </CommandGroup>
              </Command>
              </PopoverContent>     
            </Popover>;
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center space-x-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
