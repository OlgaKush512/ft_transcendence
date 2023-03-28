import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class MarkReadRequestDTO {
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];
}
