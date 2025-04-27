import { Request } from "express";

interface CreateAdminBody {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePicture?: string;
    contactNumber: string;
  };
}
interface CreatePatientBody {
  password: string;
  patient: {
    name: string;
    email: string;
    profilePicture?: string;
    contactNumber: string;
    address?: string;
  };
}
interface CreateDoctorBody {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePicture?: string;
    contactNumber: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender: "MALE" | "FEMALE";
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    averageRating: number;
  };
}
interface UpdateBody {
  profilePicture: string | undefined;
}

export interface IUser {
  email: string;
  role: string;
}
export interface CreateAdminRequest extends Request {
  file?: Express.Multer.File;
  body: CreateAdminBody;
}
export interface CreatePatientRequest extends Request {
  file?: Express.Multer.File;
  body: CreatePatientBody;
}
export interface CreateDoctorRequest extends Request {
  file?: Express.Multer.File;
  body: CreateDoctorBody;
}
export interface UpdateRequest extends Request {
  file?: Express.Multer.File;
  body: UpdateBody;
}
