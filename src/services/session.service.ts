"use server";
import { User } from "@/generated/prisma/client";
import {
  deleteSession,
  updateSession,
  verifySession,
} from "../server/config/session";
import { SessionPayload } from "../types/definition";

export async function getSession() {
  const session = await verifySession();
  return {
    isAuthenticated: !!session?.token,
    data: session?.data as User,
  };
}

export async function getToken() {
  const session = await verifySession();
  return {
    token: session?.token,
  };
}

export async function refreshSession(payload: Partial<SessionPayload>) {
  try {
    const result = await updateSession(payload);
    return result;
  } catch {
    return false;
  }
}

export async function removeSession() {
  try {
    await deleteSession();
    return true;
  } catch {
    return false;
  }
}
