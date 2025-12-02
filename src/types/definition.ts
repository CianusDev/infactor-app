export type SessionPayload = {
  data: unknown;
  token: string;
  expiresAt?: Date;
};

export type APIResponse = {
  data?: unknown;
  message?: string;
  success: boolean;
};
