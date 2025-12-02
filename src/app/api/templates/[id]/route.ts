import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware, adminAuthMiddleware } from "@/server/middlewares/auth.middleware";
import { TemplateController } from "@/server/modules/template/template.controller";
import { NextRequest, NextResponse } from "next/server";

const templateController = new TemplateController();

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    const template = await templateController.getById(id);
    return NextResponse.json({ data: template }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    // Seuls les admins peuvent modifier des templates
    const user = await adminAuthMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    const body = await req.json();
    const template = await templateController.update(id, body);
    return NextResponse.json(
      { data: template, message: "Template mis à jour avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    // Seuls les admins peuvent supprimer des templates
    const user = await adminAuthMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    await templateController.delete(id);
    return NextResponse.json(
      { message: "Template supprimé avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
