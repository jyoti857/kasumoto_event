import { Schema, model, models, Document } from "mongoose";

export interface ICategory extends Document{
  _id: string;
  name: string;
}

const CategorySchema =  new Schema({
  name: {
    type: String, 
    require: true
  }
})

const Category = models?.Category || model("Category", CategorySchema);

export default Category;
