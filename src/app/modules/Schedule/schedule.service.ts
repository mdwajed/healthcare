import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../Shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { IFilterRequest, ISchedule } from "./schedule.interface";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import { calculatePagination } from "../../../helper/paginationHelper";
import { IAuthUser } from "../../interfaces/common";
import appError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";

const createSchedule = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const schedules = [];
  const firstDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (firstDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(firstDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(firstDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, 30),
      };
      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
    }
    firstDate.setDate(firstDate.getDate() + 1);
  }
  return schedules;
};
const getAllSchedule = async (
  filters: IFilterRequest,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.ScheduleWhereInput[] = [];
  const { startDate, endDate, ...filterData } = filters;
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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

  const whereCondition: Prisma.ScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const doctorschedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });
  const doctorscheduleIds = doctorschedules.map(
    (schedule) => schedule.scheduleId
  );
  console.log(doctorscheduleIds);

  const patients = await prisma.schedule.findMany({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorscheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorscheduleIds,
      },
    },
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
const getScheduleById = async (id: string) => {
  const schedule = await prisma.schedule.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return schedule;
};
const deleteSchedule = async (id: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  if (!schedule) {
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Schedule data you want to delete does not exist"
    );
  }
  await prisma.schedule.delete({
    where: {
      id,
    },
  });
};
export const schedulService = {
  createSchedule,
  getAllSchedule,
  getScheduleById,
  deleteSchedule,
};
