"use server";

import { prisma } from "@/app/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchBillingDetails() {
  noStore();
  try {
    const billingDetails = await prisma.billingDetails.findMany({
      where: { deleted_at: null },
      include: {
        address: true, // Incluir todos los campos de la dirección
        quotations: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
        _count: {
          select: { quotations: true },
        },
      },
      orderBy: { id: "asc" },
    });

    // Convertir phone BigInt a string para serialización
    return billingDetails.map((detail) => ({
      ...detail,
      phone: detail.phone?.toString() || null,
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all billing details.");
  }
}

export async function fetchBillingDetailById(id: string) {
  noStore();
  try {
    const billingDetail = await prisma.billingDetails.findUnique({
      where: { id: Number(id), deleted_at: null },
      include: {
        address: true, // Incluir la dirección completa
        quotations: {
          select: {
            id: true,
            total: true,
            status: true,
            date: true,
          },
        },
      },
    });

    if (!billingDetail) return null;

    // Convertir phone BigInt a string
    return {
      ...billingDetail,
      phone: billingDetail.phone?.toString() || null,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch billing detail.");
  }
}

export async function fetchFilteredBillingDetails(
  query: string,
  currentPage: number
) {
  noStore();
  const ITEMS_PER_PAGE = 6;

  try {
    const whereCondition = {
      OR: [
        { deleted_at: null },
        { name: { contains: query, mode: "insensitive" as const } },
        { lastname: { contains: query, mode: "insensitive" as const } },
        { company: { contains: query, mode: "insensitive" as const } },
        { email: { contains: query, mode: "insensitive" as const } },
        { rfc: { contains: query, mode: "insensitive" as const } },
        { clabe: { contains: query, mode: "insensitive" as const } },
        { checkAccount: { contains: query, mode: "insensitive" as const } },
        // Buscar en campos de dirección también
        {
          address: {
            street: { contains: query, mode: "insensitive" as const },
          },
        },
        {
          address: {
            city: { contains: query, mode: "insensitive" as const },
          },
        },
        {
          address: {
            colony: { contains: query, mode: "insensitive" as const },
          },
        },
        // Solo buscar por teléfono si el query es numérico
        ...(query && !isNaN(Number(query)) && query.length >= 3
          ? [{ phone: { equals: BigInt(query) } }]
          : []),
      ],
    };

    const [billingDetails, totalCount] = await Promise.all([
      prisma.billingDetails.findMany({
        where: whereCondition,
        include: {
          address: true,
          quotations: {
            select: {
              id: true,
              total: true,
              status: true,
            },
          },
          _count: {
            select: { quotations: true },
          },
        },
        orderBy: { name: "asc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.billingDetails.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Convertir phone BigInt a string para serialización
    const serializedBillingDetails = billingDetails.map((detail) => ({
      ...detail,
      phone: detail.phone?.toString() || null,
    }));

    return {
      billingDetails: serializedBillingDetails,
      totalCount,
      totalPages,
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch billing details table.");
  }
}

// Función adicional para obtener billing details básicos (para selects/dropdowns)
export async function fetchBillingDetailsField() {
  noStore();
  try {
    const billingDetails = await prisma.billingDetails.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
        lastname: true,
        company: true,
        email: true,
        rfc: true,
        clabe: true,
        checkAccount: true,
        phone: true,
      },
      orderBy: { name: "asc" },
    });

    return billingDetails.map((billing) => ({
      ...billing,
      phone: billing.phone?.toString() || "",
      rfc: billing.rfc || "",
      clabe: billing.clabe || "",
      checkAccount: billing.checkAccount || "",
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch billing details field.");
  }
}
