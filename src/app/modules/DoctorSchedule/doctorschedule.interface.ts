export type IDoctorScheduleFilterRequest = {
  searchTerm?: string | undefined;
  isBooked?: boolean | undefined;
  doctorId?: string | undefined;
  startDateTime?: string | undefined;
  endDateTime?: string | undefined;
};
