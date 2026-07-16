import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/users/schemas/user.schema';


const cookieExtractor = (req: any): string | null => {
  if(req && req.cookies) {
    return req.cookies.token;
  }

  return null;
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
      ) {

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.id).select("-password");

    if(!user) {
      throw new UnauthorizedException("User not found");
    }
    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
    }
  }
  }
