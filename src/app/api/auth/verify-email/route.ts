import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError } from "@/lib/errors";
import { UserController } from "@/server/modules/user/user.controller";
import { NextRequest, NextResponse } from "next/server";

const userController = new UserController();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await userController.verifyEmail(body);
    return NextResponse.json(user, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
