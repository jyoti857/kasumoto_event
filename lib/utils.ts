import { RemoveUrlQueryParams, UrlQueryParams } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleError = (error: unknown) => {
  console.error(error)
  // throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  throw new Error("this is a handle error!")
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: "USD",
  }).format(amount);
  return formattedPrice;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams){
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringify({
    url: window.location.pathname,
    query: currentUrl,
  }, {
    skipNull: true
  })
}

export function removeKeysFromQuery({params, keysToRemove}: RemoveUrlQueryParams){
  const currentUrl = qs.parse(params);

  keysToRemove.forEach(key => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl({
    url: window.location.pathname, 
    query: currentUrl
  },{
    skipNull: true
  })
}