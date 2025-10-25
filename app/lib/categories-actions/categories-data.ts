"use server";

import { prisma } from "@/app/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchCategories() {
  noStore();
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all categories.");
  }
}

export async function fetchCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) return null;
    return {
      ...category,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch category.");
  }
}

export async function fetchFilteredCategories(
  query: string,
  currentPage: number
) {
  const ITEMS_PER_PAGE = 6;
  try {
    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          products: true,
        },
        orderBy: { name: "asc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.category.count({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    ]);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return { categories, totalCount, totalPages };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch category table.");
  }
}
