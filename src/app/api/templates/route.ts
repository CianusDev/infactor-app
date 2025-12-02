import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import {
  authMiddleware,
  adminAuthMiddleware,
} from "@/server/middlewares/auth.middleware";
import { TemplateController } from "@/server/modules/template/template.controller";
import { NextRequest, NextResponse } from "next/server";

const templateController = new TemplateController();

export async function GET(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    // Récupérer les query params
    const searchParams = req.nextUrl.searchParams;
    const query = {
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
    };

    const result = await templateController.getAll(query);
    return NextResponse.json({ data: result }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Seuls les admins peuvent créer des templates
    const user = await adminAuthMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const body = await req.json();
    const template = await templateController.create(body);
    return NextResponse.json(
      { data: template, message: "Template créé avec succès" },
      { status: HTTP_STATUS.CREATED },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
