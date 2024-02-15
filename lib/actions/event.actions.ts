'use server'
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types"
import Category from "../database/models/category.model"
import User from "../database/models/user.model"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Event from "../database/models/event.model"
import { handleError } from "../utils"

const getCategoryByName = async(name: string) => {
  return Category.findOne({name: {$regex: name, $options: 'i'}})
}

const populateEvent = (query: any) => {
  return query
    // .populate({ path: 'organizer', model: User, select: '_id firstName lastName'})
    .populate( {path: 'category', model: Category, select: '_id name'} )
}

// create 
export async function createEvent({event, path}: CreateEventParams){
  try{
    console.log("create event to tot to t t8828828")
    await connectToDatabase();
    // const organizer = await User.findById(userId);
    // if(!organizer)throw new Error("Organizer not found!")
    const newEvent = await Event.create({...event, category: event.categoryId}) //, organizer: userId })
    revalidatePath(path)
    return newEvent;
  }catch(err){
    console.log("error while creating event from event action ")
    handleError(err)
  }
}

// get one event by id 
export async function getEventById(eventId: string){
  try{
    await connectToDatabase();
    const event = await populateEvent(Event.findById(eventId))
  }catch(err){
    handleError(err)
  }
}

// UPDATE 
export async function updateEvent({event, path}: UpdateEventParams){
  try{
    await connectToDatabase();
    const eventToUpdate = await Event.findById(event._id);
    if(!eventToUpdate){ //|| eventToUpdate.organizer.toHexString() !== userId){
      throw new Error('Unauthorized or event not found!');
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {...event, category: event.categoryId},
      {new: true} 
    )
    revalidatePath(path)
    return JSON.parse(JSON.stringify(updatedEvent))
  }catch(err){
    handleError(err);
  }
}

// DELETE 
export async function deleteEvent({eventId, path}: DeleteEventParams){
  try{
    await connectToDatabase();
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if(deletedEvent) revalidatePath(path);
  }catch(err){
    handleError(err)
  }
}

// GET ALL EVENTS 
export async function getALlEvents({ query, limit = 6, page, category }: GetAllEventsParams){
  try{
    await connectToDatabase();
    const titleCondition = query ? {title: {$regex: query, $options: 'i'}} : {}
    const categoryCondition = category ? await getCategoryByName(category): null;
    const conditions = {
      $and: [titleCondition, categoryCondition ? {category: categoryCondition._id}: {}]
    }
    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({createdAt: 'desc'})
      .skip(skipAmount)
      .limit(limit)
    
    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);
    return {
      date: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    }

  }catch(err){
    handleError(err)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({userId, limit = 6, page}: GetEventsByUserParams){
  try{
    await connectToDatabase();
    const conditions = {organizer: userId}
    const skipAmount = (page - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({createdAt: "desc"})
      .skip(skipAmount)
      .limit(limit)
    
    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);
    return {data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount/limit)}
  }catch(err){
    handleError(err)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3, 
  page = 1
}: GetRelatedEventsByCategoryParams){
  try{
    await connectToDatabase();
    const skipAmount = (Number(page) - 1) * limit
    const conditions = {$and: [{category: categoryId}, {_id: {$ne: eventId}}]}
    const eventsQuery = Event.find(conditions)
      .sort({createdAt: 'desc'})
      .skip(skipAmount)
      .limit(limit)

    const events  = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions);
    return {data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit)}
  }catch(err){
    handleError(err)
  }
}