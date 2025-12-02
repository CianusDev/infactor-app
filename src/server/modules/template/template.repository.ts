import { Template, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/config/database";
import { GetAllDataResponse } from "@/types/data";
import { CreateTemplateInput, TemplateQueryInput, UpdateTemplateInput } from "./template.schema";

export class TemplateRepository {
  async findById(templateId: string): Promise<Template | null> {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });
    return template;
  }

  async findAll(query: TemplateQueryInput): Promise<GetAllDataResponse<Template[]>> {
    const { search, limit, offset } = query;

    const where: Prisma.TemplateWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip: offset ?? 0,
        take: limit ?? undefined,
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      }),
      prisma.template.count({ where }),
    ]);

    return {
      data: templates,
      total,
      limit: limit ?? total,
      offset: offset ?? 0,
    };
  }

  async findDefault(): Promise<Template | null> {
    const template = await prisma.template.findFirst({
      where: { isDefault: true },
    });
    return template;
  }

  async create(data: CreateTemplateInput): Promise<Template> {
    // Si ce template est défini comme défaut, retirer le défaut des autres
    if (data.isDefault) {
      await this.clearDefaultTemplate();
    }

    const template = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        preview: data.preview,
        isDefault: data.isDefault ?? false,
        config: data.config,
      },
    });

    return template;
  }

  async update(templateId: string, data: UpdateTemplateInput): Promise<Template | null> {
    // Si ce template est défini comme défaut, retirer le défaut des autres
    if (data.isDefault) {
      await this.clearDefaultTemplate();
    }

    const template = await prisma.template.update({
      where: { id: templateId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.preview !== undefined && { preview: data.preview }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
        ...(data.config !== undefined && { config: data.config }),
      },
    });

    return template;
  }

  async delete(templateId: string): Promise<void> {
    await prisma.template.delete({
      where: { id: templateId },
    });
  }

  async clearDefaultTemplate(): Promise<void> {
    await prisma.template.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });
  }

  async count(): Promise<number> {
    const count = await prisma.template.count();
    return count;
  }
}
