-- CreateIndex
CREATE INDEX "Product_category_idx" ON "public"."Product"("category");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "public"."Product"("brand");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "public"."Product"("price");

-- CreateIndex
CREATE INDEX "Product_rating_idx" ON "public"."Product"("rating");
