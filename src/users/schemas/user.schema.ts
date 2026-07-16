import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

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

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);