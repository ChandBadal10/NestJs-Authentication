import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";



export type CategoryDocument = HydratedDocument<Category>;


@Schema({
    timestamps: true
})


export class Category {
    @Prop({
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    })
    name!: string;


    @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug!: string;

  @Prop({
    default: '',
    trim: true,
  })
  description!: string;

  @Prop({
    default: '',
  })
  image!: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  createdBy!: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

