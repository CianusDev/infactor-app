import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { DocumentController } from "@/server/modules/document";
import { NextRequest, NextResponse } from "next/server";

const documentController = new DocumentController();

type Params = Promise<{ id: string }>;

/**
 * GET /api/documents/:id
 * Récupère un document par son ID
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    const document = await documentController.getById(id, user.id);
    return NextResponse.json({ data: document }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/documents/:id
 * Met à jour un document existant
 */
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    const body = await req.json();
    const document = await documentController.update(id, user.id, body);
    return NextResponse.json(
      { data: document, message: "Document mis à jour avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/documents/:id
 * Supprime un document
 */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    await documentController.delete(id, user.id);
    return NextResponse.json(
      { message: "Document supprimé avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
