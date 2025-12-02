"use server";
import { prepareDataApi } from "@/lib/utils";
import { api } from "@/server/config/axios";
import { createSession } from "@/server/config/session";
import {
  CreateUserInput,
  ForgotPasswordInput,
  LoginUserInput,
  ResendVerificationCodeInput,
  ResetPasswordInput,
  VerifyUserEmailInput,
} from "@/server/modules/user/user.schema";
import { removeSession } from "./session.service";

export async function signin(payload: LoginUserInput) {
  const endpoint = "/auth/login";
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const data = result.data;
  const user = data.user;
  const token = data.token;
  const error = data.error;
  console.log("signin result:", result);
  const res = prepareDataApi(status, user, error);
  if (res.success) {
    await createSession({
      data: user,
      token,
    });
    return res;
  }
  return res;
}

export async function signup(payload: CreateUserInput) {
  const endpoint = "/auth/register";
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const data = result.data;
  const user = data.user;
  const error = data.error;
  const res = prepareDataApi(status, user, error);
  return res;
}

export async function signout() {
  await removeSession();
}

export async function verifyEmail(payload: VerifyUserEmailInput) {
  const endpoint = `/auth/verify-email`;
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const resData = result.data;
  const user = resData.user;
  const token = resData.token;
  const error = resData.error;
  const res = prepareDataApi(status, user, error);
  if (res.success) {
    await createSession({
      data: user,
      token,
    });
    return res;
  }
  return res;
}

export async function resendVerificationCode(
  payload: ResendVerificationCodeInput,
) {
  const endpoint = `/auth/resend-verification-code`;
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const data = result.data;
  const error = data.error;
  const res = prepareDataApi(status, data, error);
  return res;
}

export async function forgotPassword(payload: ForgotPasswordInput) {
  const endpoint = `/auth/forgot-password`;
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const data = result.data;
  const error = data.error;
  const res = prepareDataApi(status, data, error);
  return res;
}

export async function resetPassword(payload: ResetPasswordInput) {
  const endpoint = `/auth/reset-password`;
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const data = result.data;
  const error = data.error;
  const res = prepareDataApi(status, data, error);
  return res;
}

export async function resendResetCode(payload: ForgotPasswordInput) {
  const endpoint = `/auth/resend-reset-code`;
  const result = await api.post(endpoint, payload);
  const status = result.status;
  const data = result.data;
  const error = data.error;
  const res = prepareDataApi(status, data, error);
  return res;
}
