import { StringExpression } from "mongoose"

// === user params 
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string 
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}


// event params 
export type CreateEventParams = {
    // userId: string 
    event: {
    title: string 
    description: string 
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string 
    isFree: boolean
    url: string
  }
  path: string 
}

export type UpdateEventParams = {
  // userId: string
  event: {
    _id: string 
    title: string 
    imageUrl: string 
    location: string 
    startDateTime: string
    endDateTime: string
    categoryId: string 
    price: string 
    isFree: string 
    url: string  
  }
  path: string 
}

export type DeleteEventParams = {
  eventId: string 
  path: string 
}

export type GetAllEventsParams = {
  query: string
  category: string 
  limit: number
  page: number
}

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string 
  eventId: string 
  limit?: number
  page: number | string
}

export type Event = {
  _id: string 
  title: string 
  description: string 
  price: string 
  isFree: string 
  imageUrl: string 
  location: string 
  startDateTime: Date
  endDateTime: Date
  url: string 
  organizer: {
    _id: string 
    firstName: string
    lastName: string 
  }
  category: {
    _id: string 
    name: string 
  }
}

// ====== category params 
export type CreateCategoryParams = {
  categoryName: string 
}

// =========== Order params 
export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number
  page: string | number | null
}

// ======= URL Query params
export type UrlQueryParams = {
  params: string 
  key: string 
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string 
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: {id: string}
  searchParams: {[key: string]: string | string[] | undefined}
}