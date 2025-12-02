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

    const stats = await invoiceController.getStats(user.id);
    return NextResponse.json({ data: stats }, { status: HTTP_STATUS.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
