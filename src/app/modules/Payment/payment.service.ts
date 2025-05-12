import { prisma } from "../../../Shared/prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";
const initiatePayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };
  const result = await SSLService.initPayment(initPaymentData);
  console.log(result.GatewayPageURL);
  return {
    paymentUrl: result.GatewayPageURL,
  };
};
// HTTP POST Parameters will be throw to the IPN_HTTP_URL as amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=techs682094c56e4e6&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=a9ac585e08d839c5f5436ba9b3c9a3c7&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id
const validatePayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "invalid payment",
  //   };
  // }
  // const response = await SSLService.validatePayment(payload);
  // if (response.status !== "VALID") {
  //   return {
  //     message: "Payment Failed",
  //   };
  // }
  const response = payload;
  await prisma.$transaction(async (txn) => {
    const updatedPaymentData = await txn.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
    await txn.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });
  return {
    message: "Payment success!",
  };
};
export const PaymentService = {
  initiatePayment,
  validatePayment,
};
