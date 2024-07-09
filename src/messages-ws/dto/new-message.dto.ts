import { IsString, MinLength } from 'class-validator';

export class NewMessageDto {
  @IsString({ message: 'El mensaje debe ser un texto' })
  @MinLength(1, { message: 'El mensaje no puede estar vacio' })
  message: string;
}
