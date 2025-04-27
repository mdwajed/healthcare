import { z } from "zod";

const createSpecialistValidation = z.object({
  title: z.string({
    required_error: "Specialist til=tle is required",
  }),
});
export const specialistValidation = {
  createSpecialistValidation,
};
