import { ApiProperty } from '@nestjs/swagger';

export class NewSoloResponseDTO {
  @ApiProperty({ required: false })
  id?: string;
}
