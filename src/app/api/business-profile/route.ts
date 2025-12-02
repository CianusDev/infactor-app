import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { BusinessProfileController } from "@/server/modules/business-profile/business-profile.controller";
import { NextRequest, NextResponse } from "next/server";

const businessProfileController = new BusinessProfileController();

export async function GET(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const profile = await businessProfileController.getProfile(user.id);
    return NextResponse.json({ data: profile }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const body = await req.json();
    const profile = await businessProfileController.updateProfile(user.id, body);
    return NextResponse.json(
      { data: profile, message: "Profil mis à jour avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
