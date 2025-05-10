import { BloodGroup, DoctorGender, MaritalStatus } from "@prisma/client";

export type IPatientFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
};
export type IPatientUpdate = {
  name: string;
  contactNumber: string;
  address: string;
  patientHealthData: IPatientHealthData;
  medicalReport: IMedicalReport;
};
type IPatientHealthData = {
  dateOfBirth: string;
  gender: DoctorGender;
  bloodGroup: BloodGroup;
  hasAllergies: boolean;
  hasDiabetes: boolean;
  height: string;
  weight: string;
  smokingStatus: boolean;
  dietaryPreferences: string;
  pregnancyStatus: boolean;
  mentalHealthHistory: string;
  immunizationStatus: string;
  hasPastSurgeries: boolean;
  recentAnxiety: boolean;
  recentDepression: boolean;
  maritalStatus: MaritalStatus;
};
type IMedicalReport = {
  reportName: string;
  reportLink: string;
};
