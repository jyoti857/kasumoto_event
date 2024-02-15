'use client'

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { Input } from "../ui/input";

const Search = ({placeholder = 'Search Title...'}: {placeholder?: string}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = '';
      if(query){
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query
        })
      }else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query']
        })
      }
      router.push(newUrl, {scroll: false})
    }, 3000)
    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router])

  return(
    <div>
      <Image src='/assets/icons/search.svg' alt='search' width={24} height={24}/>
      <Input 
        type='text'
        placeholder={placeholder}
        onChange={e => setQuery(e.target.value)}
        className='p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible-offset-0'
      />
    </div>
  )
}

export default Search;