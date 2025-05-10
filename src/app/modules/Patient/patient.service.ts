import { Patient, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../../Shared/prisma";
import { calculatePagination } from "../../../helper/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination.interface";
import { patientSearchableFields } from "./patient.constant";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";

const getAllPaient = async (
  params: IPatientFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(options);
  const andCondition: Prisma.PatientWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  if (params.searchTerm) {
    andCondition.push({
      OR: patientSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };
  const patients = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  const total = await prisma.patient.count({
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
const getPatientById = async (id: string): Promise<Patient | null> => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return patient;
};
const updatePatient = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await prisma.$transaction(async (transaction) => {
    // update patient data
    await transaction.patient.update({
      where: {
        id,
      },
      data: patientData,
    });
    // update or create patient health data
    if (patientHealthData) {
      await transaction.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }
    // create patient medical report
    if (medicalReport) {
      await transaction.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });
  const responseData = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return responseData;
};
const deletePatient = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (txn) => {
    await txn.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    await txn.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    const deletedPatientData = await txn.patient.delete({
      where: {
        id,
      },
    });
    await txn.user.delete({
      where: {
        email: deletedPatientData.email,
      },
    });
    return deletedPatientData;
  });
  return result;
};
const patientSoftDelete = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const patient = await transactionClient.patient.update({
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
        email: patient.email,
      },
      data: {
        status: UserStatus.deleted,
      },
    });
    return patient;
  });
  return result;
};
export const patientService = {
  getAllPaient,
  getPatientById,
  updatePatient,
  deletePatient,
  patientSoftDelete,
};
