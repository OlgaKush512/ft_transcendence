import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor() {}

  async disconnect(req: Request) {
    req.session.destroy((err) => {
      if (err) throw new InternalServerErrorException(err.message);
    });
  }
}
