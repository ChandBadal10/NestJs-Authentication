import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    default: '',
  })
  verifyOtp!: string;

  @Prop({
    default: 0,
  })
  verifyOtpExpiredAt!: number;

  @Prop({
    default: false,
  })
  isAccountVerified!: boolean;

  @Prop({
    default: '',
  })
  resetOtp!: string;

  @Prop({
    default: 0,
  })
  resetOtpExpiredAt!: number;
}

export const UserSchema = SchemaFactory.createForClass(User);