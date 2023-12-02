export const MomoAPIPath = {
  CREATE_PAYMENT: "/v2/gateway/api/create",
  CHECK_PAYMENT_STATUS: "/v2/gateway/api/query",
};

export enum ELanguage {
  VI = "vi",
  EN = "en",
}

export enum EPayType {
  WEB_APP = "webApp",
  APP = "app",
  QR = "qr",
  MINI_APP = "miniapp",
  NAPAS = "napas",
  CREDIT = "credit",
}

export enum ERequestType {
  CAPTURE_WALLET = "captureWallet",
  PAY_WITH_ATM = "payWithATM",
  PAY_WITH_CC = "payWithCC",
}

export enum EOrderType {
  MOMO_WALLET = "momo_wallet",
}

export enum EPaymentMethod {
  MOMO = "momo",
}

export enum EPaymentAction {
  CREATE_PAYMENT = "create_payment",
  CHECK_PAYMENT_STATUS = "check_payment_status",
}
