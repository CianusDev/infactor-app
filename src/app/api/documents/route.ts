import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { DocumentController } from "@/server/modules/document";
import { NextRequest, NextResponse } from "next/server";

const documentController = new DocumentController();

/**
 * GET /api/documents
 * Récupère la liste des documents de l'utilisateur
 */
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
      sortBy: searchParams.get("sortBy") as
        | "createdAt"
        | "updatedAt"
        | "name"
        | undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };

    const result = await documentController.getAll(user.id, query);
    return NextResponse.json({ data: result }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/documents
 * Crée un nouveau document
 */
export async function POST(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const body = await req.json();
    const document = await documentController.create(user.id, body);
    return NextResponse.json(
      { data: document, message: "Document créé avec succès" },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
