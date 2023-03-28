import { IsNotEmpty, IsString } from 'class-validator';

export class SearchRequestDTO {
    @IsNotEmpty()
    @IsString()
    query: string;
}