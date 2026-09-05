import { Product } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProductPayload, IUpdateProductPayload } from "./product.interface";
import slugify from "slugify"




const productCheckExistence = async (query: string) => { // TODO: eta finally thakbe na
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { title: { equals: query, mode: "insensitive" } },
        { slug: query },
      ],
      isDeleted: false,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      stock: true,
      costPrice: true,
      sellingPrice: true,
      images: { take: 1, select: { url: true } },
    },
  });

  return {
    exists: !!product,
    product: product || null,
  };
};



const productCreate = async (payload: ICreateProductPayload) => {
  const { images, ...productData } = payload;

  const isExist = await prisma.product.findFirst({
    where: { title: { equals: productData.title, mode: "insensitive" },isDeleted:false },
  });

  if (isExist) {
    throw new Error("Product already exists with this title. Please use stock-in instead.");
  }

  const baseSlug = slugify(productData.title, { lower: true, strict: true });
  let slug = baseSlug;

  const slugExist = await prisma.product.findUnique({ where: { slug } });
  if (slugExist) {
    slug = `${slug}-${Date.now()}`;
  }

  const productCreatedData = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        ...productData,
        slug,
        image: images && images.length > 0  // TODO: n2n issue ase
          ? { create: images.map((url) => ({ url })) }
          : undefined,
      },
      include: { images: true, category: true },
    });

    

    await tx.purchase.create({
      data: {
        productId: product.id,
        quantity: productData.stock,
        unitCost: productData.costPrice,
        totalCost: Number((productData.stock * productData.costPrice).toFixed(2)),
        supplierName: productData.supplierName || null,
        invoiceNo: productData.invoiceNo || null,
      },
    });

    return product;
  });

  console.log(productCreatedData);
  return productCreatedData;

};



const productUpdateStock = async (payload: IUpdateProductPayload) => {
  const { productId, quantity, unitCost, newSellingPrice, supplierName, invoiceNo } = payload;

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId,isDeleted:false },
  });

  if (!existingProduct) {
    throw new Error("Product not found. Cannot stock-in non-existing product.");
  }

  const currentStock = existingProduct.stock;
  const currentCost = existingProduct.costPrice;
  const totalStock = currentStock + quantity;

  // Weighted Average Cost (WAC) হিসাব
  const calculatedCostPrice =
    totalStock > 0
      ? (currentStock * currentCost + quantity * unitCost) / totalStock
      : unitCost;

  const totalCost = Number((quantity * unitCost).toFixed(2));

  return await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        stock: totalStock,
        costPrice: Number(calculatedCostPrice.toFixed(2)),
        sellingPrice: newSellingPrice ?? existingProduct.sellingPrice,
        isAvailable: totalStock > 0,
      },
      include: {
        images: true,
        category: true,
      },
    });

    
    await tx.purchase.create({
      data: {
        productId: existingProduct.id,
        quantity,
        unitCost,
        totalCost,
        supplierName: supplierName || null,
        invoiceNo: invoiceNo || null,
      },
    });

    return updatedProduct;
  });
};



 const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { images: true, category: true, brand: true, review: true },
  });
  if (!product) throw new Error("Product not found");
  return product;
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const updateProductDetails = async (id: string, payload: Partial<Product>) => {
  const isExist = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!isExist) throw new Error("Product not found to update");

  return await prisma.product.update({
    where: { id },
    data: payload,
    include: { images: true, category: true, brand: true },
  });
};


 const deleteProduct = async (id: string) => {
  const isExist = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!isExist) throw new Error("Product not found");

  await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Product deleted successfully" };
};






export const ProductService = {productCheckExistence,productCreate,productUpdateStock,getProductById,updateProductDetails,deleteProduct}


