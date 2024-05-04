"use client";

import { FC, useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/types/Product";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import clsx from "clsx";
import { Category } from "@/types/Category";

interface SearchBarProps {
  isMobile?: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ isMobile }) => {
  const [search, setSearch] = useState(false);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const { data: categories, isLoading: loadingData } = useQuery({
    queryKey: ["NavbarCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchNavbar");
      return data.categories as Category[];
    },
  });
  const { data: products } = useQuery({
    queryKey: ["NavbarProducts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/product/fetchNavbar");
      return data.products as Product[];
    },
  });

  const filteredCategories = !searchInput
    ? []
    : categories?.filter((name) =>
        name.name.toLowerCase().includes(searchInput.toLowerCase())
      );
  const filteredProducts = !searchInput
    ? []
    : products?.filter((name) =>
        name.name.toLowerCase().includes(searchInput.toLowerCase())
      );

  return (
    <div className="flex items-center gap-4">
      {search && (
        <Command className="relative z-10 max-w-lg overflow-visible  bg-emboldLight placeholder:text-black/50 ">
          <CommandInput
            onValueChange={(text: any) => {
              setSearchInput(text.toLowerCase());
              router.replace(`?search=${text.toLowerCase()}`, {
                scroll: false,
              });
            }}
            className={clsx(
              "border-none outline-none ring-0 h-full text-[16px] focus:border-none focus:outline-none placeholder:text-black/50",
              {
                "w-[150px] sm:w-[120px] md:w-[150px]  lg:w-[200px]": search,
                "w-0": !search,
              }
            )}
            placeholder="Search "
          ></CommandInput>

          {searchInput ? (
            <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-emboldLight shadow">
              {/* @ts-ignore */}
              {filteredCategories?.length === 0 &&
                // @ts-ignore
                filteredProducts?.length === 0 && (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}

              {/* @ts-ignore */}
              {(filteredCategories?.length ?? 0) > 0 ? (
                <CommandGroup heading="categories" className="text-black/70">
                  {/* @ts-ignore */}
                  {filteredCategories?.map((category) => (
                    <CommandItem
                      className="space-y-4"
                      onSelect={(e: any) => {
                        router.push(`/category/${e}`);
                        router.refresh();
                      }}
                      key={category.id}
                      value={category.name}
                    >
                      <a href={`/category/${category.slug}`}>{category.name}</a>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {/* @ts-ignore */}
              {(filteredProducts?.length ?? 0) > 0 ? (
                <CommandGroup heading="products" className="text-black/70">
                  {/* @ts-ignore */}
                  {filteredProducts?.map((product) => (
                    <CommandItem
                      className="space-y-4"
                      onSelect={(e: any) => {
                        router.push(`/product/${e}`);
                        router.refresh();
                      }}
                      key={product.id}
                      value={product.name}
                    >
                      <a href={`/product/${product.slug}`}>{product.name}</a>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          ) : null}
        </Command>
      )}
      <Search
        className="cursor-pointer"
        onClick={() => setSearch(!search)}
      ></Search>
    </div>
  );
};

export default SearchBar;
