import { InvoiceStatus } from "@/generated/prisma/client";
import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { InvoiceController } from "@/server/modules/invoice/invoice.controller";
import { NextRequest, NextResponse } from "next/server";

const invoiceController = new InvoiceController();

export async function GET(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    // Récupérer les query params
    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const query = {
      status:
        statusParam &&
        Object.values(InvoiceStatus).includes(statusParam as InvoiceStatus)
          ? (statusParam as InvoiceStatus)
          : undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
      sortBy: searchParams.get("sortBy") as
        | "createdAt"
        | "issueDate"
        | "dueDate"
        | "total"
        | "invoiceNumber"
        | undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
    };

    const result = await invoiceController.getAll(user.id, query);
    return NextResponse.json({ data: result }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const body = await req.json();
    const invoice = await invoiceController.create(user.id, body);
    return NextResponse.json(
      { data: invoice, message: "Facture créée avec succès" },
      { status: HTTP_STATUS.CREATED },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
