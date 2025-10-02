import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SyncUsersDto } from './dto/sync-users.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sync multiple users',
    description:
      'Creates multiple users from an array of names. If a user already exists, it will be updated.',
  })
  @ApiBody({ type: SyncUsersDto })
  @ApiResponse({
    status: 200,
    description: 'Users successfully synced',
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  async sync(@Body() body: SyncUsersDto): Promise<void> {
    return this.userService.sync(body.names);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieves all users from the database, ordered by creation date (newest first)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a single new user with the provided name',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user with this name already exists',
  })
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body.name);
  }
}
