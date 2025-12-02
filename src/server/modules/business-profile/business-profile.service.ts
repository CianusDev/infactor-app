import { NotFoundError } from "@/lib/errors";
import { BusinessProfileRepository } from "./business-profile.repository";
import { CreateBusinessProfileInput, UpdateBusinessProfileInput } from "./business-profile.schema";

export class BusinessProfileService {
  private readonly repository: BusinessProfileRepository;

  constructor() {
    this.repository = new BusinessProfileRepository();
  }

  async getByUserId(userId: string) {
    const profile = await this.repository.findByUserId(userId);
    return profile;
  }

  async createOrUpdate(userId: string, data: CreateBusinessProfileInput) {
    const profile = await this.repository.upsert(userId, data);
    return profile;
  }

  async update(userId: string, data: UpdateBusinessProfileInput) {
    const existingProfile = await this.repository.findByUserId(userId);

    if (!existingProfile) {
      // Si le profil n'existe pas, on le crée
      return await this.repository.create(userId, data);
    }

    const updatedProfile = await this.repository.update(userId, data);
    return updatedProfile;
  }

  async updateLogo(userId: string, logoUrl: string) {
    const existingProfile = await this.repository.findByUserId(userId);

    if (!existingProfile) {
      // Si le profil n'existe pas, on le crée avec le logo
      return await this.repository.create(userId, { logo: logoUrl });
    }

    const updatedProfile = await this.repository.updateLogo(userId, logoUrl);
    return updatedProfile;
  }

  async delete(userId: string) {
    const existingProfile = await this.repository.findByUserId(userId);

    if (!existingProfile) {
      throw new NotFoundError("Profil entreprise non trouvé");
    }

    await this.repository.delete(userId);
  }
}
