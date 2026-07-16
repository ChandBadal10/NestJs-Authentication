import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/schemas/user.schema";

import * as bcrypt from 'bcryptjs';
import { Role } from "src/auth/enums/role.enum";



@Injectable()
export class AdminSeed implements OnModuleInit {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {}

    async onModuleInit() {
      await this.createAdmin();
    }

    async createAdmin() {
        const adminEmail = process.env.ADMIN_EMAIL;

        const admin = await this.userModel.findOne({
            email: adminEmail
        });

        if(admin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

        await this.userModel.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.ADMIN,
            isAccountVerified: true,
        });

        console.log("Default Admin Created");
    }
}