import {
  ELanguage,
  EPayType,
  ERequestType,
} from "../common/constants/momo.constant";

export interface IItem {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  category?: string;
  currency: string;
  quantity: number;
  totalAmount: number;
  purchaseAmount: number;
  manufacturer?: string;
  unit?: string;
  taxAmount?: number;
}

export interface IDeliveryInfo {
  deliveryAddress?: string;
  deliveryFee?: string;
  quantity?: string;
}

export interface IUserInfo {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

export interface IRefundTrans {
  orderId: string;
  amount: number;
  resultCode: number;
  transId: number;
  createdTime: number;
}

// Request
export interface ICreatePaymentRequest {
  partnerCode: string;
  subPartnerCode?: string;
  partnerName?: string;
  storeId?: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  orderGroupId?: string;
  redirectUrl: string;
  ipnUrl: string;
  requestType: ERequestType;
  extraData: string;
  items?: IItem[];
  deliveryInfo?: IDeliveryInfo;
  userInfo?: IUserInfo;
  autoCapture?: boolean;
  lang: ELanguage;
  signature: string;
}

export interface ICheckPaymentStatusRequest {
  partnerCode: string;
  requestId: string;
  orderId: string;
  lang: ELanguage;
  signature: string;
}

// Response
export interface ICreatePaymentResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
  deeplinkMiniApp?: string;
  signature?: string;
}

export interface ICheckPaymentStatusResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  extraData: string;
  amount: number;
  transId: number;
  payType: EPayType;
  resultCode: number;
  refundTrans: IRefundTrans[];
  message: string;
  responseTime: number;
  lastUpdated: number;
}

export interface MomoOptions {
  endpointUrl: string;
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  redirectUrl: string;
  ipnUrl: string;
  extraData: string;
  capture?: boolean;
}
