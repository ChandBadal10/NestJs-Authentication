import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class StockDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;
}