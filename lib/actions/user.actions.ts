'use server'

import { CreateUserParams, UpdateUserParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Event from "../database/models/event.model"
import { revalidatePath } from "next/cache"

export async function justToCheckTheConnection(){
  try{
    await connectToDatabase();
  }catch(err){
    handleError(err)
  }
}

export const createUser = async(user: CreateUserParams) => {
  try{
    await connectToDatabase();
    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser));
  }catch(err){
    handleError(err)
  }
}

export const updateUser = async(clerkId: string, user: UpdateUserParams) => {
  try{
    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate({clerkId}, user, {new: true})
    if(!updatedUser) throw new Error('user update failed');
    return JSON.parse(JSON.stringify(updatedUser))
  }catch(err){
    handleError(err)
  }
}

export async function deleteUser(clerkId: string){
  try{
    await connectToDatabase()
    // find user to delete 
    const userToDelete = await User.findOneAndDelete({clerkId})
    if(!userToDelete){
      throw new Error('user not found!');
    }

    // unlink relationships
    await Promise.all([
      // update the 'events' collection to remove references to the user 
      Event.updateMany(
        {_id: {$in: userToDelete.events}},
        {$pull: {organizer: userToDelete._id}}
      ),
      // update the 'orders' collectoin to remove references to the user 
      // Order.updateM
    ])
    // delete the user 
    const deletedUser = await User.findByIdAndUpdate(userToDelete._id)
    revalidatePath('/')
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  }catch(err){
    handleError(err)
  }
}