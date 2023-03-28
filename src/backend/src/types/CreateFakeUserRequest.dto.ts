import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateFakeUserRequestDTO {
  id: number;
  email: string;

 
  login: string;


  first_name: string;

  last_name: string;

  usual_full_name: string;


  url: string;


  displayname: string;


  image_url: string;
}
