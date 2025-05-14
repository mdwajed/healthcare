import { PaymentStatus, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import { prisma } from "../../../Shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user);
      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new Error("Invalid user role");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const adminCount = await prisma.admin.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  return {
    appointmentCount,
    patientCount,
    adminCount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
  };
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();

  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
  };
};
const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
      appointment: {
        doctorId: doctorData.id,
      },
    },
  });
  const appointmentStatusCount = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedappointmentStatusCount = appointmentStatusCount.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );
  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount,
    formattedappointmentStatusCount,
  };
};
const getPatientMetaData = async (user: IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });
  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusCount = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });
  const formattedappointmentStatusCount = appointmentStatusCount.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );
  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedappointmentStatusCount,
  };
};
export const MetaService = {
  fetchDashboardMetaData,
  getAdminMetaData,
  getSuperAdminMetaData,
  getDoctorMetaData,
  getPatientMetaData,
};
