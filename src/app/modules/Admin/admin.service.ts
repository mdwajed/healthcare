import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableField } from "./admin.constant";
import { calculatePagination } from "../../../helper/paginationHelper";
import { prisma } from "../../../Shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination.interface";

const getAllAdmin = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  console.log("params", params);
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.AdminWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchableField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
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
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const admin = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: {
      admin,
    },
  };
};
const getAdminById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};
const updateAdmin = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });
  return result;
};

const adminDelete = async (id: string): Promise<Admin | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const admin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: admin.email,
      },
    });
    return admin;
  });
  return result;
};
const adminSoftDelete = async (id: string): Promise<Admin | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const admin = await transactionClient.admin.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: admin.email,
      },
      data: {
        status: UserStatus.deleted,
      },
    });
    return admin;
  });
  return result;
};

export const adminService = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  adminDelete,
  adminSoftDelete,
};
