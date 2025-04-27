import { UserStatus } from "@prisma/client";
import { jwtHelper } from "../../../helper/jwtHelper";
import { prisma } from "../../../Shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { StringValue } from "ms";
import emailSender from "./emailSender";
import appError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
const loggedInUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Invalid Password");
  }
  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as StringValue
  );
  const refreshToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as StringValue
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
    console.log("decodedData: ", decodedData);
  } catch (error) {
    throw new Error("You are not authorize");
  }

  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.active,
    },
  });
  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as StringValue
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Invalid Password");
  }
  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "password changed successfully",
  };
};
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });
  const resetPassToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_token_secret as Secret,
    config.jwt.reset_pass_token_expires_in as StringValue
  );
  console.log(resetPassToken);
  const resetPassLink =
    config.reset_pass_url + `?email=${userData.email}&token=${resetPassToken}`;
  await emailSender(
    userData.email,
    `
<div>
<p>Dear User,</p>
<p>Your Password reset link 
<a href=${resetPassLink}>
<button>Reset Password</button>
</a>
</p>
</div>

      `
  );
  console.log(resetPassLink);
};
const resetPassword = async (
  token: string,
  payload: { email: string; password: string }
) => {
  console.log({ token, payload });
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });
  const isValidToken = jwtHelper.verifyToken(
    token,
    config.jwt.reset_pass_token_secret as Secret
  );
  if (!isValidToken) {
    throw new appError(StatusCodes.FORBIDDEN, "Forbidden !");
  }
  console.log({ isValidToken });
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return {
    message: "password reset successfully",
  };
};

export const AuthServices = {
  loggedInUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
