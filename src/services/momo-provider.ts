import { EOL } from "os";
import {
  AbstractPaymentProcessor,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  isPaymentProcessorError,
  PaymentSessionStatus,
} from "@medusajs/medusa";
import { Logger } from "@medusajs/types";
import { ELanguage, ERequestType } from "../common/constants/momo.constant";
import { MomoService } from "../common/services/momo.service";
import { MomoOptions } from "../types/momo.interface";
import { MedusaError } from "medusa-core-utils";

class MomoProviderService extends AbstractPaymentProcessor {
  static identifier: string = "momo";
  protected momoService: MomoService;
  protected logger_: Logger | undefined;
  protected options_: MomoOptions;
  constructor({ logger }: { logger?: Logger }, options) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);
    this.logger_ = logger;
    this.options_ = options;
    this.init();
  }

  protected init(): void {
    this.momoService = new MomoService({
      ...this.options_,
      logger: this.logger_,
    });
  }
  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    this.logger_.log("init", context);

    const { currency_code, amount, resource_id, billing_address, customer } =
      context;
    let session_data;
    try {
      session_data = await this.momoService.createOrder({
        amount,
        lang: ELanguage.VI,
        orderId: resource_id,
        orderInfo: `Payment for order ${resource_id}`,
        requestType: ERequestType.CAPTURE_WALLET,
        extraData: "",
      });
      this.logger_.info(session_data);
    } catch (e) {
      return this.buildError("An error occurred in initiatePayment", e);
    }

    return {
      session_data,
    };
  }
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    try {
      const order = (await this.retrievePayment(
        paymentSessionData
      )) as PaymentProcessorSessionResponse["session_data"];
      this.logger_.info(
        `resultCode: ${order?.resultCode}, type: ${typeof order?.resultCode}`
      );
      switch (order?.resultCode) {
        case 0:
        case 9000:
          return PaymentSessionStatus.AUTHORIZED;
        case 7000:
        case 7002:
          return PaymentSessionStatus.PENDING;
        default:
          return PaymentSessionStatus.ERROR;
      }
    } catch (err) {
      return PaymentSessionStatus.ERROR;
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    try {
      const id = paymentSessionData?.orderId as string;
      const payment = await this.momoService.getOrder({
        orderId: id,
        lang: ELanguage.VI,
      });
      this.logger_.info(`resultCode: ${payment.resultCode}`);
      return payment as unknown as PaymentProcessorSessionResponse["session_data"];
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e);
    }
  }
  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
    const { paymentSessionData } = context;

    return { session_data: paymentSessionData };
  }

  async updatePaymentData(sessionId: string, data: Record<string, unknown>) {
    this.logger_.log("updatedata", data);
    this.logger_.log("sessionId", sessionId);
    try {
      // Prevent from updating the amount from here as it should go through
      // the updatePayment method to perform the correct logic
      if (data.amount) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot update amount, use updatePayment instead"
        );
      }

      return data;
    } catch (e) {
      return this.buildError("An error occurred in updatePaymentData", e);
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return {
      session_data: {
        ...paymentSessionData,
        status: "captured",
      },
    };
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    this.logger_.log("refund", paymentSessionData);

    return paymentSessionData;
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus;
        data: PaymentProcessorSessionResponse["session_data"];
      }
  > {
    try {
      console.log("authorize:", paymentSessionData);
      const stat = await this.getPaymentStatus(paymentSessionData);
      return { data: paymentSessionData, status: stat };
    } catch (error) {
      return this.buildError("An error occurred in authorizePayment", error);
    }
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return paymentSessionData;
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    this.logger_.log("cancel", paymentSessionData);
    return {
      session_data: {
        ...paymentSessionData,
        status: "canceled",
      },
    };
  }

  protected buildError(
    message: string,
    e: PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : e.message ?? "",
    };
  }
}

export default MomoProviderService;
