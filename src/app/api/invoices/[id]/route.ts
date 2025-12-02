import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { InvoiceController } from "@/server/modules/invoice/invoice.controller";
import { NextRequest, NextResponse } from "next/server";

const invoiceController = new InvoiceController();

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    const invoice = await invoiceController.getById(id, user.id);
    return NextResponse.json({ data: invoice }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    const body = await req.json();
    const invoice = await invoiceController.update(id, user.id, body);
    return NextResponse.json(
      { data: invoice, message: "Facture mise à jour avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const { id } = await params;
    await invoiceController.delete(id, user.id);
    return NextResponse.json(
      { message: "Facture supprimée avec succès" },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
