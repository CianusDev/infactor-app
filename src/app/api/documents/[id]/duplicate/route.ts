import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { DocumentController } from "@/server/modules/document";
import { NextRequest, NextResponse } from "next/server";

const documentController = new DocumentController();

type Params = Promise<{ id: string }>;

/**
 * POST /api/documents/:id/duplicate
 * Duplique un document existant
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;

    // Récupérer le nouveau nom si fourni dans le body
    let newName: string | undefined;
    try {
      const body = await req.json();
      newName = body.name;
    } catch {
      // Body vide, on utilise le nom par défaut
    }

    const document = await documentController.duplicate(id, user.id, newName);
    return NextResponse.json(
      { data: document, message: "Document dupliqué avec succès" },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
