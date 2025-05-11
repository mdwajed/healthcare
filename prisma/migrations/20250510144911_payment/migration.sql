-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "appointtmentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentGatewayData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointtmentId_key" ON "Payment"("appointtmentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointtmentId_fkey" FOREIGN KEY ("appointtmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
