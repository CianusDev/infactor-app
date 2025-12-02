import { HTTP_STATUS } from "@/lib/constant";
import { handleApiError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { authMiddleware } from "@/server/middlewares/auth.middleware";
import { BusinessProfileController } from "@/server/modules/business-profile/business-profile.controller";
import { uploadImage } from "@/server/config/cloudinary";
import { NextRequest, NextResponse } from "next/server";

const businessProfileController = new BusinessProfileController();

export async function POST(req: NextRequest) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      throw new UnauthorizedError("Non authentifié");
    }

    const formData = await req.formData();
    const file = formData.get("logo") as File | null;

    if (!file) {
      throw new ValidationError("Aucun fichier fourni");
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError(
        "Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, SVG"
      );
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ValidationError("Le fichier ne doit pas dépasser 5 Mo");
    }

    // Upload vers Cloudinary
    const uploadResult = await uploadImage(file, false);

    // Mettre à jour le profil avec l'URL du logo
    const profile = await businessProfileController.uploadLogo(user.id, {
      logo: uploadResult.secure_url,
    });

    return NextResponse.json(
      {
        data: profile,
        message: "Logo mis à jour avec succès",
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
