-- AlterTable
ALTER TABLE "jump1_site_settings" ADD COLUMN     "domain" TEXT,
ADD COLUMN     "ogImageUrl" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoIndexable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT;
