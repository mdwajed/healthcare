import { UserStatus } from "@prisma/client";
import { prisma } from "../../../Shared/prisma";

const getAllDoctor = async () => {
  const doctors = await prisma.doctor.findMany();
  return doctors;
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
const doctorUpdate = async (id: string, payload: any) => {
  const { specialities, ...doctorData } = payload;
  // console.log("Spec:", specialities, "ddoctordata:", doctorData);
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
