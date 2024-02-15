"use server"

import { CreateCategoryParams } from "@/types";
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model";
import { handleError } from "../utils"

export const createCategory = async({categoryName}: CreateCategoryParams) => {
  try{
    await connectToDatabase();
    const newCategory = await Category.create({name: categoryName});
    console.log("connect to db create category ", {newCategory})
    return JSON.parse(JSON.stringify(newCategory));
  }catch(err){
    handleError(err)
  }
}

export const getAllCategories = async() => {
  try{
    await connectToDatabase();
    console.log("connect to db fetch categories ")
    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  }catch(err){
    handleError(err)
  }
}