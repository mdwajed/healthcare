import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../Shared/prisma";
import { fileUploader } from "../../../helper/fileUploader";
import {
  CreateAdminRequest,
  CreateDoctorRequest,
  CreatePatientRequest,
  IUser,
  UpdateRequest,
} from "../../interfaces/file.type";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import { calculatePagination } from "../../../helper/paginationHelper";
import { userSearchableFields } from "./user.constant";

const createAdmin = async (req: CreateAdminRequest) => {
  const file = req.file;
  if (file) {
    const fileToUpload = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePicture = fileToUpload?.secure_url;
    console.log("PROPICTURE", req.body);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createAdminData;
  });
  return result;
};
const createDoctor = async (req: CreateDoctorRequest) => {
  const file = req.file;
  if (file) {
    const fileToUpload = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePicture = fileToUpload?.secure_url;
    console.log("PROPICTURE", req.body);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    return createDoctorData;
  });
  return result;
};
const createPatient = async (req: CreatePatientRequest) => {
  const file = req.file;
  if (file) {
    const fileToUpload = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePicture = fileToUpload?.secure_url;
    console.log("PROPICTURE", req.body);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });
    return createPatientData;
  });
  return result;
};

const getAllAdmin = async (params: any, options: IPaginationOptions) => {
  console.log("params", params);
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.UserWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const admin = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // admin: true,
      // patient: true,
      // doctor: true,
    },
  });
  const total = await prisma.user.count({
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

const changeProfileStatus = async (id: string, status: UserStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const userUpdateData = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return userUpdateData;
};
const getMyProfile = async (user: IUser) => {
  console.log("USER:", user);
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });
  let profileInfo;
  if (userInfo.role === UserRole.SUPER_ADMIN)
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  else if (userInfo.role === UserRole.ADMIN)
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  else if (userInfo.role === UserRole.DOCTOR)
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  else if (userInfo.role === UserRole.PATIENT)
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  return {
    ...userInfo,
    ...profileInfo,
  };
};
const updateMyProfile = async (user: IUser, req: UpdateRequest) => {
  console.log(req);
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePicture = uploadToCloudinary?.secure_url;
  }
  let profileInfo;
  if (userInfo.role === UserRole.SUPER_ADMIN)
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  else if (userInfo.role === UserRole.ADMIN)
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  else if (userInfo.role === UserRole.DOCTOR)
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  else if (userInfo.role === UserRole.PATIENT)
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  return {
    ...profileInfo,
  };
};
export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllAdmin,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
