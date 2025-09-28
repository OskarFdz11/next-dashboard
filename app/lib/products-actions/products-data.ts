"use server";

import { prisma } from "@/app/lib/prisma";

export async function fetchProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image_url: true,
        quantity: true,
        brand: true,
        category: { select: { name: true, id: true } },
      },
      orderBy: { name: "asc" },
    });
    return products.map((product) => ({
      ...product,
      price:
        typeof product.price === "object" && "toNumber" in product.price
          ? product.price.toNumber()
          : Number(product.price),
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all products.");
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image_url: true,
        quantity: true,
        brand: true,
        category: { select: { name: true, id: true } },
      },
    });
    if (!product) return null;
    return {
      ...product,
      price:
        typeof product.price === "object" && "toNumber" in product.price
          ? product.price.toNumber()
          : Number(product.price),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product.");
  }
}

export async function fetchFilteredProducts(
  query: string,
  currentPage: number
) {
  const ITEMS_PER_PAGE = 6;
  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
            {
              price: {
                equals: isNaN(Number(query)) ? undefined : Number(query),
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: { name: "asc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.product.count({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
            {
              price: {
                equals: isNaN(Number(query)) ? undefined : Number(query),
              },
            },
          ],
        },
      }),
    ]);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return { products, totalCount, totalPages };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch product table.");
  }
}
