import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../Shared/prisma";
import appError from "../../errors/appError";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import { calculatePagination } from "../../../helper/paginationHelper";
import { Prisma, UserRole } from "@prisma/client";
const createAppointment = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  console.log(patientData);
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const doctorscheduleData = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
      },
    },
  });
  if (doctorscheduleData.isBooked) {
    throw new appError(
      StatusCodes.CONFLICT,
      "The schedule you want to book is already booked"
    );
  }
  const videoCallingId = uuidv4();
  console.log("VIDEO:", videoCallingId);
  const result = await prisma.$transaction(async (txn) => {
    const appointmentData = await txn.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        schedule: true,
        doctor: true,
      },
    });
    await txn.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    const today = new Date();
    const transactionId =
      "Healthcare-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDate() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();
    await txn.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });
    return appointmentData;
  });
  return result;
};
const getMyAppointment = async (
  user: IAuthUser,
  filters: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.AppointmentWhereInput[] = [];
  const { ...filterData } = filters;
  if (user?.role === UserRole.PATIENT) {
    andCondition.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andCondition.push({
      doctor: {
        email: user?.email,
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };
  const appointment = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });
  const total = await prisma.appointment.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      appointment,
    },
  };
};
const getAllAppointment = async (filters: any, options: IPaginationOptions) => {
  const { patientEmail, doctorEmail, ...filterData } = filters;
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.AppointmentWhereInput[] = [];
  if (patientEmail) {
    andCondition.push({
      patient: {
        email: patientEmail,
      },
    });
  } else if (doctorEmail) {
    andCondition.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };
  const appointment = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: { doctor: true, patient: true },
  });
  const total = await prisma.appointment.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      appointment,
    },
  };
};
export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
};
