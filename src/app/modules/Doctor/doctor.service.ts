import { Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../../Shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import { calculatePagination } from "../../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";

const getAllDoctor = async (
  params: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.DoctorWhereInput[] = [];
  const { searchTerm, specialities, ...filterData } = params;
  console.log(specialities);
  if (params.searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (specialities && specialities.length > 0) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
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
  andCondition.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };
  const doctors = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            averageRating: "desc",
          },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      doctors,
    },
  };
};

const getDoctorById = async (id: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return doctorData;
};
const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await prisma.doctor.delete({
    where: {
      id,
    },
  });
  await prisma.user.delete({
    where: {
      email: doctor.email,
    },
  });
  return { message: "Doctor and associated user deleted successfully" };
};
const doctorSoftDelete = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const doctor = await transactionClient.doctor.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
    await prisma.user.update({
      where: {
        email: doctor.email,
      },
      data: {
        status: UserStatus.deleted,
      },
    });
    return doctor;
  });
  return result;
};
const doctorUpdate = async (id: string, payload: IDoctorUpdate) => {
  const { specialities, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await prisma.$transaction(async (transaction) => {
    await transaction.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });
    if (specialities && specialities.length > 0) {
      // delete specialities
      const deleteSpecialitiesIds = specialities.filter(
        (speciality) => speciality.isDeleted
      );

      for (const speciality of deleteSpecialitiesIds) {
        await transaction.doctorSpecialties.deleteMany({
          where: {
            specialitiesId: speciality.specialitiesId,
            doctorId: doctorInfo.id,
          },
        });
      }
      // create specialities
      const createSpecialitiesIds = specialities.filter(
        (speciality) => !speciality.isDeleted
      );
      for (const speciality of createSpecialitiesIds) {
        await transaction.doctorSpecialties.create({
          data: {
            specialitiesId: speciality.specialitiesId,
            doctorId: doctorInfo.id,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};
export const doctorService = {
  getAllDoctor,
  getDoctorById,
  deleteDoctor,
  doctorSoftDelete,
  doctorUpdate,
};
