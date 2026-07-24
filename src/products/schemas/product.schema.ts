import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class ProductImage {
  @Prop({ required: true })
  public_id!: string;

  @Prop({ required: true })
  url!: string;
}

export const ProductImageSchema =
  SchemaFactory.createForClass(ProductImage);

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200,
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
    required: true,
  })
  description!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    default: 0,
    min: 0,
  })
  discountPrice!: number;

  @Prop({
    required: true,
    min: 0,
  })
  stock!: number;

  @Prop({
    required: true,
    unique: true,
  })
  sku!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand!: Types.ObjectId;

  @Prop({
    type: [ProductImageSchema],
    default: [],
  })
  images!: ProductImage[];

  @Prop({
    default: 0,
  })
  averageRating!: number;

  @Prop({
    default: 0,
  })
  totalReviews!: number;

  @Prop({
    default: false,
  })
  isFeatured!: boolean;

  @Prop({
    default: true,
  })
  isPublished: boolean;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  updatedBy?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);