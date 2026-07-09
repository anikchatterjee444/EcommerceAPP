-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "dummyJsonId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "sku" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "discountPercentage" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "warrantyInformation" TEXT,
    "shippingInformation" TEXT,
    "availabilityStatus" TEXT,
    "returnPolicy" TEXT,
    "minimumOrderQuantity" INTEGER,
    "thumbnail" TEXT,
    "images" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_dummyJsonId_key" ON "public"."Product"("dummyJsonId");
