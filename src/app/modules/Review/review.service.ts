import { Prisma, Review } from "@prisma/client";
import { prisma } from "../../../Shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { StatusCodes } from "http-status-codes";
import appError from "../../errors/appError";
import { calculatePagination } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination.interface";

const createReview = async (user: IAuthUser, payload: Partial<Review>) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });
  if (patientData.id !== appointmentData.patientId) {
    throw new appError(StatusCodes.NOT_FOUND, "This is not your appointment");
  }
  return await prisma.$transaction(async (txn) => {
    const result = await txn.review.create({
      data: {
        appointmentId: appointmentData.id,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        rating: payload.rating as number,
        comment: payload.comment as string,
      },
    });
    const averageRating = await txn.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    await txn.doctor.update({
      where: {
        id: result.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return result;
  });
};
const getAllReview = async (filters: any, options: IPaginationOptions) => {
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

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
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
  const total = await prisma.review.count({
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
export const ReviewService = {
  createReview,
  getAllReview,
};
