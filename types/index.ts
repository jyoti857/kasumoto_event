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
  userId: string 
  event: {
    title: string 
    description: string 
  }
}