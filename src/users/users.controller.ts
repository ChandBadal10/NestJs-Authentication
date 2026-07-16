import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';




@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMyProfile(
    @Req() req: any,
  ) {
    return this.usersService.getMyProfile(req.user._id);
  }

  @Patch("me")
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,

  ) {
    return this.usersService.updateProfile(
      req.user._id,
      updateProfileDto
    )
  }



}