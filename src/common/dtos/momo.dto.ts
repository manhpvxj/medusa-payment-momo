import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import {
  ELanguage,
  EOrderType,
  EPayType,
  EPaymentMethod,
  ERequestType,
} from "../constants/momo.constant";

export class ItemDto {
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  id!: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  category?: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  currency!: string;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  quantity!: number;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  totalAmount!: number;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  purchaseAmount!: number;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  unit?: string;

  @Transform(({ value }) => value && +value)
  @IsOptional()
  @IsPositive()
  taxAmount?: number;
}

export class DeliveryInfoDto {
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  deliveryFee?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  quantity?: string;
}

export class UserInfoDto {
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  email?: string;
}

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod!: EPaymentMethod;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  @Min(1000)
  @Max(50000000)
  amount!: number;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderInfo!: string;

  // @Transform(({ value }) => value && value.trim())
  // @IsOptional()
  // @IsString()
  // orderGroupId?: string;

  @IsNotEmpty()
  @IsEnum(ERequestType)
  requestType!: ERequestType;

  @IsString()
  extraData!: string;

  @Type(() => ItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  items?: ItemDto[];

  // @Type(() => DeliveryInfoDto)
  // @ValidateNested({ each: true })
  // @IsOptional()
  // deliveryInfo?: DeliveryInfoDto;

  @Type(() => UserInfoDto)
  @ValidateNested({ each: true })
  @IsOptional()
  userInfo?: UserInfoDto;

  @IsOptional()
  @IsBoolean()
  autoCapture?: boolean;

  @IsNotEmpty()
  @IsEnum(ELanguage)
  lang!: ELanguage;
}

export class CheckPaymentStatusDto {
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsNotEmpty()
  @IsEnum(ELanguage)
  lang!: ELanguage;
}

export class IPNDto {
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  partnerCode!: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  requestId!: string;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  amount!: number;

  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  partnerUserId?: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderInfo!: string;

  @IsNotEmpty()
  @IsEnum(EOrderType)
  orderType!: EOrderType;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  transId!: number;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsNumber()
  resultCode!: number;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsEnum(EPayType)
  payType!: EPayType;

  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  responseTime!: number;

  @IsString()
  extraData!: string;

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  signature!: string;
}
