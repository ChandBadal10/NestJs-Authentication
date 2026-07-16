import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import * as bcrypt from 'bcryptjs';



@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}


  // find all users
  async findAllUsers() {
    const users = await this.userModel
      .find()
      .select('-password');

    return {
      success: true,
      count: users.length,
      users,
    };
  }


  // get my profile

  async getMyProfile(userId: string) {
    const user = await this.userModel.findById(userId).select("-password");

    if(!user) {
      return {
        success: false,
        message: "User not found"
      };
    }
    return {
      success: true,
      user,
    }
  }


  // update profile
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const {name, email} = updateProfileDto;

    const user = await this.userModel.findById(userId);

    if(!user) {
      return {
        success: false,
        message: "User not found"
      }
    }

    // check if the email is already used by another user

    if(email && email !== user.email) {
      const exisitingUser = await this.userModel.findOne({email});

      if(exisitingUser) {
        return {
          success: false,
          message: "Email Already exists"
        };
      }

      user.email = email;

    }

    if(name) {
      user.name = name;
    }

    await user.save();


    const updateUser = await this.userModel.findById(userId).select("-password");

    return {
      success: true,
      message: "Profile update successfully",
      user: updateUser
    }

  }



  //change password

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const {currentPassword, newPassword, confirmPassword} = changePasswordDto;

      const user = await this.userModel.findById(userId);

      if(!user) {
        return {
          success: false,
          message: "User not found"
        }
      }

      //check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if(!isMatch) {
        return{
          success: false,
          message: "Current password is incorrect"
        }
      }

      // check new password confirmation

      if(newPassword !== confirmPassword) {
        return {
          success: false,
          message: "Passwords do not match"
        }
      }

      // prevent using the same password again

      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      if(isSamePassword) {
        return {
          success: false,
          message: "New password cannot be same as the current password"
        }
      }

      //hash the new password
      user.password = await bcrypt.hash(newPassword, 10);

      await user.save();

      return {
        success: true,
        message: "Password changed successfully"
      }

    } catch (error: any) {
      return{
        success: false,
        message: "Internal Server Error",
        error: error.message
      }
    }
  }

}