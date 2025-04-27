import { Request } from "express";
import { fileUploader } from "../../../helper/fileUploader";
import { prisma } from "../../../Shared/prisma";

const createSpecialities = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }
  const result = await prisma.specialities.create({
    data: req.body,
  });
  return result;
};
const getAllSpecialist = async () => {
  const specialist = await prisma.specialities.findMany();
  return specialist;
};
const deleteSpecialist = async (id: string) => {
  const specialist = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return specialist;
};
export const specialitiesService = {
  createSpecialities,
  getAllSpecialist,
  deleteSpecialist,
};
