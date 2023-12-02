import {
  AbstractPaymentProcessor,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/medusa";
import { Logger } from "@medusajs/types";
import { MomoService } from "src/common/services/momo.service";
import { MomoOptions } from "src/types/momo.interface";

class MomoProviderService extends AbstractPaymentProcessor {
  static identifier: string = "Momo";
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

  capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | { status: PaymentSessionStatus; data: Record<string, unknown> }
  > {
    throw new Error("Method not implemented.");
  }
  cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    this.logger_.log(context);
    return;
  }
  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.");
  }
  refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  updatePayment(
    context: PaymentProcessorContext
  ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
    throw new Error("Method not implemented.");
  }
  updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
}

export default MomoService;
