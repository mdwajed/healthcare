import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { prisma } from "../../../Shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import appError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { calculatePagination } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination.interface";

const createPrescription = async (user: IAuthUser, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (
    user?.role !== UserRole.DOCTOR &&
    user?.email !== appointmentData.doctor.email
  ) {
    throw new appError(StatusCodes.UNAUTHORIZED, "You are not authorize");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate,
    },
    include: {
      patient: true,
      appointment: true,
    },
  });
  return result;
};
const patientPrescription = async (
  user: IAuthUser,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = calculatePagination(options);
  const patientPrescription = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });

  if (patientPrescription.length === 0) {
    throw new appError(StatusCodes.NOT_FOUND, "This is not your prescription");
  }
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: patientPrescription,
  };
};
const getAllFromDB = async (filters: any, options: IPaginationOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const PrescriptionService = {
  createPrescription,
  patientPrescription,
  getAllFromDB,
};
