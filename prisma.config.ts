import "dotenv/config";

// Custom configuration type
interface PrismaConfig {
  schema: string;
  migrations: {
    path: string;
  };
  datasource: {
    url: string | undefined;
  };
}

// Helper function to get environment variables
const env = (key: string): string | undefined => {
  return process.env[key];
};

// Define configuration
const defineConfig = (config: PrismaConfig): PrismaConfig => {
  return config;
};

// Export the configuration
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
