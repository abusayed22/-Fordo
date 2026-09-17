import { extractPublicId } from "../../../config/cloudinary";
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


export const getAllProducts = async () => {
  // const {
  //   page = 1,
  //   limit = 10,
  //   search = "",
  //   categoryId,
  //   brandId,
  //   minPrice,
  //   maxPrice,
  //   sortBy = "createdAt",
  //   sortOrder = "desc",
  //   isActive,
  // } = queryParams;

  // const take = Number(limit);
  // const skip = (Number(page) - 1) * take;

  // ডাইনামিক হোয়্যার কন্ডিশন তৈরি
  const where = {
    AND: [
      {isDeleted:false},
      // নাম বা ডেসক্রিপশনে সার্চ
      // search
      //   ? {
      //       OR: [
      //         { name: { contains: search, mode: "insensitive" } },
      //         { description: { contains: search, mode: "insensitive" } },
      //       ],
      //     }
      //   : {},
      
      // // ক্যাটাগরি ও ব্র্যান্ড ফিল্টার
      // categoryId ? { categoryId } : {},
      // brandId ? { brandId } : {},

      // // স্ট্যাটাস ফিল্টার (অ্যাডমিন বা কাস্টমারের জন্য)
      // isActive !== undefined ? { isActive: isActive === "true" } : {},

      // // প্রাইস রেঞ্জ ফিল্টার (salePrice থাকলে সেটা, না থাকলে regularPrice)
      // minPrice || maxPrice
      //   ? {
      //       regularPrice: {
      //         ...(minPrice ? { gte: Number(minPrice) } : {}),
      //         ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      //       },
      //     }
      //   : {},
    ],
  };

  // প্যারালালে ডেটা এবং টোটাল কাউন্ট ফেচ
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      // skip,
      // take,
      // orderBy: {
      //   [sortBy]: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
      // },
      include: {
        category: {
          select: { id: true, name: true,logo: true },
        },
        brand: {
          select: { id: true, name: true, logo: true },
        },
        images: {
        select: {
          id: true,
          url: true,
          publicId: true,
        },
      },
      },
    }),
    prisma.product.count({ where }),
  ]);

  // const totalPages = Math.ceil(total / take);

  return {
    meta: {
      total,
      // page: Number(page),
      // limit: take,
      // totalPages,
      // hasNextPage: Number(page) < totalPages,
      // hasPrevPage: Number(page) > 1,
    },
    data: products,
  };
};

const productCreate = async (payload: ICreateProductPayload) => {
  const { images, ...productData } = payload;

  const isExist = await prisma.product.findFirst({
    where: {
      title: { equals: productData.title, mode: "insensitive" },
      isDeleted: false,
    },
  });

  if (isExist) {
    throw new Error(
      "Product already exists with this title. Please use stock-in instead."
    );
  }

  const baseSlug = slugify(productData.title, { lower: true, strict: true });
  let slug = baseSlug;

  const slugExist = await prisma.product.findUnique({ where: { slug } });
  if (slugExist) {
    slug = `${slug}-${Date.now()}`;
  }

  // রুট লেভেল থেকে অপ্রয়োজনীয় ফিল্ডগুলো আলাদা করে ফেলা
  const {
    categoryId,
    brandId,
    createdById,
    supplierName,
    invoiceNo,
    unitType,
    ...restProductData
  } = productData as Product;

  const productCreatedData = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        title: restProductData.title,
        description: restProductData.description,
        costPrice: Number(restProductData.costPrice),
        originalPrice: Number(restProductData.originalPrice),
        sellingPrice: Number(restProductData.sellingPrice),
        stock: Number(restProductData.stock),
        unitType: unitType,
        unitValue: restProductData.unitValue ? Number(restProductData.unitValue) : 1,
        isDiscounted: Boolean(restProductData.isDiscounted),
        discountType: restProductData.isDiscounted ? restProductData.discountType : undefined,
        discountValue: restProductData.isDiscounted ? Number(restProductData.discountValue) : undefined,
        discountExpires: restProductData.discountExpires ? new Date(restProductData.discountExpires) : undefined,
        slug,

        // ১. শুধুমাত্র রিলেশন connect থাকবে (কোনো categoryId থাকবে না)
        category: {
          connect: { id: categoryId },
        },

        // ২. createdBy রিলেশন connect
        createdBy: {
          connect: { id: createdById },
        },

        // ৩. brandId থাকলে connect
        ...(brandId
          ? {
              brand: {
                connect: { id: brandId },
              },
            }
          : {}),

        // ৪. প্রিজমা স্কিমার ফিল্ডের নাম 'images' (বহুবচন)
        ...(images && images.length > 0
  ? {
      images: {
        create: images.map((url: string) => ({
          url,
          publicId: extractPublicId(url),
        })),
      },
    }
  : {}),
      },
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });

    // পারচেজ এন্ট্রি তৈরি
    await tx.purchase.create({
      data: {
        productId: product.id,
        quantity: Number(productData.stock),
        unitCost: Number(productData.costPrice),
        totalCost: Number(
          (Number(productData.stock) * Number(productData.costPrice)).toFixed(2)
        ),
        supplierName: supplierName || null,
        invoiceNo: invoiceNo || null,
      },
    });

    return product;
  });

  return productCreatedData;
};


const productUpdateStock = async (payload: IUpdateProductPayload) => {
  const { productId, quantity, unitCost, newSellingPrice, supplierName, invoiceNo } = payload;

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId, isDeleted: false },
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






export const ProductService = { productCheckExistence,getAllProducts, productCreate, productUpdateStock, getProductById, updateProductDetails, deleteProduct }


