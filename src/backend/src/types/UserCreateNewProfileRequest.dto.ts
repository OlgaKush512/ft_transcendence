import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileImageFilePipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 100000000 }),
        new FileTypeValidator({ fileType: /jpeg|png/ }),
      ],
      fileIsRequired: false,
    });
  }
}

export class CreateNewProfileRequestDTO {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9_]*$/)
  username: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
