import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({
  timestamps: true,
})
export class Brand {
  @Prop({
    required: true,
    trim: true,
    unique: true,
    minlength: 2,
    maxlength: 100,
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
    maxlength: 500,
  })
  description!: string;

  @Prop({
    default: '',
  })
  logo!: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);