import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const templates = [
  {
    name: "Classique",
    description:
      "Un design sobre et professionnel, idéal pour tous types d'entreprises.",
    preview: null,
    isDefault: true,
    config: {
      primaryColor: "#1f2937",
      secondaryColor: "#6b7280",
      fontFamily: "Inter",
      fontSize: 12,
      layout: "classic",
      showLogo: true,
      showWatermark: false,
      headerPosition: "left",
      footerText: "Merci pour votre confiance.",
    },
  },
  {
    name: "Moderne",
    description:
      "Un style contemporain avec des couleurs vives et une mise en page épurée.",
    preview: null,
    isDefault: false,
    config: {
      primaryColor: "#2563eb",
      secondaryColor: "#3b82f6",
      fontFamily: "Inter",
      fontSize: 12,
      layout: "modern",
      showLogo: true,
      showWatermark: false,
      headerPosition: "center",
      footerText: "Merci pour votre confiance.",
    },
  },
  {
    name: "Minimaliste",
    description:
      "Un design épuré qui met l'accent sur la lisibilité et la simplicité.",
    preview: null,
    isDefault: false,
    config: {
      primaryColor: "#000000",
      secondaryColor: "#737373",
      fontFamily: "Inter",
      fontSize: 11,
      layout: "minimal",
      showLogo: true,
      showWatermark: false,
      headerPosition: "left",
      footerText: "",
    },
  },
  {
    name: "Élégant",
    description:
      "Un template raffiné avec des touches dorées, parfait pour les services premium.",
    preview: null,
    isDefault: false,
    config: {
      primaryColor: "#1e293b",
      secondaryColor: "#b8860b",
      fontFamily: "Inter",
      fontSize: 12,
      layout: "classic",
      showLogo: true,
      showWatermark: false,
      headerPosition: "right",
      footerText: "Une collaboration de qualité.",
    },
  },
  {
    name: "Startup",
    description:
      "Un design dynamique et coloré, idéal pour les jeunes entreprises.",
    preview: null,
    isDefault: false,
    config: {
      primaryColor: "#7c3aed",
      secondaryColor: "#a78bfa",
      fontFamily: "Inter",
      fontSize: 12,
      layout: "modern",
      showLogo: true,
      showWatermark: false,
      headerPosition: "center",
      footerText: "Merci de faire partie de l'aventure !",
    },
  },
];

async function main() {
  console.log("🌱 Début du seeding...");

  // Supprimer les templates existants (optionnel)
  await prisma.template.deleteMany();
  console.log("🗑️  Templates existants supprimés");

  // Créer les templates
  for (const template of templates) {
    const created = await prisma.template.create({
      data: template,
    });
    console.log(`✅ Template créé: ${created.name}`);
  }

  console.log(`\n🎉 Seeding terminé! ${templates.length} templates créés.`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
