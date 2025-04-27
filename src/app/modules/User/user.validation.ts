import { DoctorGender } from "@prisma/client";
import z from "zod";

const createAdmin = z.object({
  password: z.string({
    required_error: "password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contactNumber is required",
    }),
  }),
});
const createPatient = z.object({
  password: z.string({
    required_error: "password is required",
  }),
  patient: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contactNumber is required",
    }),
    address: z.string().optional(),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: "password is required",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z.string({
      required_error: "email is required",
    }),
    contactNumber: z.string({
      required_error: "contactNumber is required",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "registrationNumber is required",
    }),
    experience: z.number().optional(),
    gender: z.enum([DoctorGender.MALE, DoctorGender.FEMALE]),
    appointmentFee: z.number({
      required_error: "appointmentFee is required",
    }),
    qualification: z.string({
      required_error: "qualification is required",
    }),
    currentWorkingPlace: z.string({
      required_error: "currentWorkingPlace is required",
    }),
    designation: z.string({
      required_error: " designation is required",
    }),
    averageRating: z.number({
      required_error: "averageRating is required",
    }),
  }),
});
export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
};
