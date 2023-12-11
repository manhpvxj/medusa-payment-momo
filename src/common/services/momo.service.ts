import { Logger } from "@medusajs/medusa";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import crypto from "crypto";
import { MedusaError } from "medusa-core-utils";
import { v4 as uuid } from "uuid";
import {
  ICheckPaymentStatusRequest,
  ICheckPaymentStatusResponse,
  ICreatePaymentRequest,
  ICreatePaymentResponse,
  MomoOptions,
} from "../../types/momo.interface";
import {
  CheckPaymentStatusDto,
  CreatePaymentDto,
  IPNDto,
} from "../dtos/momo.dto";

export const MomoPath = {
  CREATE_PAYMENT: "/v2/gateway/api/create",
  CHECK_PAYMENT_STATUS: "/v2/gateway/api/query",
};

type MomoServiceOptions = MomoOptions & {
  logger: Logger;
};
export class MomoService {
  constructor(options: MomoServiceOptions) {
    this.logger_ = options.logger;
    this.options_ = options;
    const axiosInstance = axios.create({
      baseURL: options.endpointUrl,
    });

    this.httpClient = axiosInstance;
  }
  private readonly logger_?: Logger;
  private readonly httpClient: AxiosInstance;
  protected readonly options_: MomoOptions;

  public async createOrder(
    data: CreatePaymentDto
  ): Promise<ICreatePaymentResponse> {
    const body: ICreatePaymentRequest = {
      ...data,
      partnerCode: this.options_.partnerCode,
      requestId: uuid(),
      redirectUrl: this.options_.redirectUrl,
      ipnUrl: this.options_.ipnUrl,
      signature: "",
    };
    const rawSignature = `accessKey=${this.options_.accessKey}&amount=${body.amount}&extraData=${body.extraData}&ipnUrl=${body.ipnUrl}&orderId=${body.orderId}&orderInfo=${body.orderInfo}&partnerCode=${body.partnerCode}&redirectUrl=${body.redirectUrl}&requestId=${body.requestId}&requestType=${body.requestType}`;
    body.signature = crypto
      .createHmac("sha256", this.options_.secretKey)
      .update(rawSignature)
      .digest("hex");
    const config: AxiosRequestConfig<ICreatePaymentRequest> = {
      method: "POST",
      url: MomoPath.CREATE_PAYMENT,
      data: body,
    };
    return await this.fetcher<ICreatePaymentResponse>(config);
  }

  public async getOrder(
    data: CheckPaymentStatusDto
  ): Promise<ICheckPaymentStatusResponse> {
    const body: ICheckPaymentStatusRequest = {
      ...data,
      partnerCode: this.options_.partnerCode,
      requestId: uuid(),
      signature: "",
    };
    const rawSignature = `accessKey=${this.options_.accessKey}&orderId=${body.orderId}&partnerCode=${this.options_.partnerCode}&requestId=${body.requestId}`;
    body.signature = crypto
      .createHmac("sha256", this.options_.secretKey)
      .update(rawSignature)
      .digest("hex");
    const config: AxiosRequestConfig<ICheckPaymentStatusRequest> = {
      method: "POST",
      url: MomoPath.CHECK_PAYMENT_STATUS,
      data: body,
    };
    return await this.fetcher<ICheckPaymentStatusResponse>(config);
  }

  private async fetcher<T>(config: AxiosRequestConfig): Promise<T> {
    config = {
      ...config,
    };
    try {
      const res = await this.httpClient.request<T>(config);
      const result = res.data;
      return result;
    } catch (error) {
      // throw new MedusaExc.BusinessException({
      //   message: error.message,
      // });
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error?.message);
    }
  }
}
