import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../helper/paginationHelper";
import { prisma } from "../../../Shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import appError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../../interfaces/common";
import { IDoctorScheduleFilterRequest } from "./doctorschedule.interface";

const createDoctorSchedule = async (
  user: IAuthUser,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => {
    return {
      doctorId: doctorData.id,
      scheduleId,
    };
  });
  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
    skipDuplicates: true,
  });
  return result;
};
const getDoctorSchedule = async (filters: any, options: IPaginationOptions) => {
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];
  const { startDate, endDate, ...filterData } = filters;
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      {
        filterData.isBooked = false;
      }
    }
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.ScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const patients = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      patients,
    },
  };
};
const deleteDoctorSchedule = async (user: IAuthUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const isBooked = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
      isBooked: true,
    },
  });

  if (isBooked) {
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Schedule you want to delete is not executed because shedule is already booked"
    );
  }
  await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });
};
const getAllDoctorSchedule = async (
  filters: IDoctorScheduleFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions: any[] = [];

  // Handle search term on doctor name
  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  // Convert isBooked from string to boolean
  if (typeof filterData.isBooked === "string") {
    if (filterData.isBooked === "true") {
      filterData.isBooked = true;
    } else if (filterData.isBooked === "false") {
      filterData.isBooked = false;
    } else {
      delete filterData.isBooked;
    }
  }

  // Prepare additional filters
  const nestedConditions: any[] = [];

  if (filterData.isBooked !== undefined) {
    nestedConditions.push({
      isBooked: {
        equals: filterData.isBooked,
      },
    });
  }

  if (filterData.doctorId) {
    nestedConditions.push({
      doctorId: {
        equals: filterData.doctorId,
      },
    });
  }

  if (filterData.startDateTime) {
    nestedConditions.push({
      schedule: {
        startDateTime: {
          equals: new Date(filterData.startDateTime),
        },
      },
    });
  }

  if (filterData.endDateTime) {
    nestedConditions.push({
      schedule: {
        endDateTime: {
          equals: new Date(filterData.endDateTime),
        },
      },
    });
  }

  if (nestedConditions.length > 0) {
    andConditions.push(...nestedConditions);
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : undefined,
  });

  const total = await prisma.doctorSchedules.count({
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

export const doctorScheduleService = {
  createDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
  getAllDoctorSchedule,
};
