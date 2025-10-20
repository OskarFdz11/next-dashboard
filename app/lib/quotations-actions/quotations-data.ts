"use server";

import { formatCurrency } from "../utils";
import { prisma } from "@/app/lib/prisma";

// export async function fetchRevenue() {
//   try {
//     const data = await prisma.quotation.findMany();

//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch revenue data.");
//   }
// }

// export async function fetchLatestQuotations() {
//   try {
//     const data = await prisma.quotation.findMany({
//       include: {
//         customer: true,
//       },
//       orderBy: { date: "desc" },
//     });

//     const latestQuotations = data.map((quotation) => ({
//       ...quotation,
//       total: formatCurrency(quotation.total as unknown as number),
//     }));

//     return latestQuotations;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch revenue data.");
//   }
// }

// // export async function fetchLatestInvoices() {
// //   try {
// //     const data = await sql<LatestInvoiceRaw[]>`
// //       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
// //       FROM invoices
// //       JOIN customers ON invoices.customer_id = customers.id
// //       ORDER BY invoices.date DESC
// //       LIMIT 5`;

// //     const latestInvoices = data.map((invoice) => ({
// //       ...invoice,
// //       amount: formatCurrency(invoice.amount),
// //     }));
// //     return latestInvoices;
// //   } catch (error) {
// //     console.error("Database Error:", error);
// //     throw new Error("Failed to fetch the latest invoices.");
// //   }
// // }

// export async function fetchCardData() {
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     // const invoiceStatusPromise = sql`SELECT
//     //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//     //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//     //      FROM invoices`;

//     const [quotationsCount, customer, paid, pending] = await Promise.all([
//       prisma.quotation.count(),
//       prisma.customer.count(),
//       prisma.quotation.aggregate({
//         _sum: { total: true },
//         where: { status: "paid" },
//       }),
//       prisma.quotation.aggregate({
//         _sum: { total: true },
//         where: { status: "pending" },
//       }),
//     ]);

//     const numberOfQuotations = Number(quotationsCount ?? "0");
//     const numberOfCustomers = Number(customer ?? "0");
//     const totalPaidQuotations = Number(paid._sum.total ?? "0");
//     const totalPendingQuotations = Number(pending._sum.total ?? "0");

//     return {
//       numberOfCustomers,
//       numberOfQuotations,
//       totalPaidQuotations,
//       totalPendingQuotations,
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Database Error:", error.message);
//     } else {
//       console.error("Database Error:", error);
//     }
//     throw new Error("Failed to fetch card data.");
//   }
// }

export async function fetchRevenue() {
  try {
    const data = await prisma.quotation.findMany();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    // Retornar datos vacíos en lugar de lanzar error
    return [];
  }
}

export async function fetchLatestQuotations() {
  try {
    const data = await prisma.quotation.findMany({
      include: {
        customer: true,
      },
      orderBy: { date: "desc" },
    });

    const latestQuotations = data.map((quotation) => ({
      ...quotation,
      total: formatCurrency(quotation.total as unknown as number),
    }));

    return latestQuotations;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function fetchCardData() {
  try {
    const [quotationsCount, customer, paid, pending] = await Promise.all([
      prisma.quotation.count(),
      prisma.customer.count(),
      prisma.quotation.aggregate({
        _sum: { total: true },
        where: { status: "paid" },
      }),
      prisma.quotation.aggregate({
        _sum: { total: true },
        where: { status: "pending" },
      }),
    ]);

    const numberOfQuotations = Number(quotationsCount ?? "0");
    const numberOfCustomers = Number(customer ?? "0");
    const totalPaidQuotations = Number(paid._sum.total ?? "0");
    const totalPendingQuotations = Number(pending._sum.total ?? "0");

    return {
      numberOfCustomers,
      numberOfQuotations,
      totalPaidQuotations,
      totalPendingQuotations,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      numberOfCustomers: 0,
      numberOfQuotations: 0,
      totalPaidQuotations: 0,
      totalPendingQuotations: 0,
    };
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredQuotations(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const filteredQuotations = await prisma.quotation.findMany({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: "insensitive" } } },
          { customer: { email: { contains: query, mode: "insensitive" } } },
          { customer: { company: { contains: query, mode: "insensitive" } } },
          { total: { equals: Number(query) || undefined } },
          { status: { equals: query ? String(query) : undefined } },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: { date: "desc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return filteredQuotations.map((quotation) => ({
      ...quotation,
      total: Number(quotation.total),
      subtotal: Number(quotation.subtotal),
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotations.");
  }
}
export async function fetchQuotationsPages(query: string) {
  const ITEMS_PER_PAGE = 6;

  const date = new Date(query);
  const isValidDate = !isNaN(date.getTime());

  const orConditions: any[] = [
    { customer: { name: { contains: query, mode: "insensitive" } } },
    { customer: { email: { contains: query, mode: "insensitive" } } },
    { total: { equals: Number(query) || undefined } },
  ];

  if (query && isValidDate) {
    orConditions.push({ date: { equals: date } });
  }
  try {
    const count = await prisma.quotation.count({
      where: {
        OR: orConditions,
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchQuotationById(id: string) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: Number(id) },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            company: true,
          },
        },
        billingDetails: {
          select: {
            id: true,
            name: true,
            lastname: true,
            company: true,
            email: true,
            phone: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    if (!quotation) return null;

    return {
      ...quotation,
      subtotal: Number(quotation.subtotal),
      total: Number(quotation.total),
      products: quotation.products.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
      billingDetails: {
        ...quotation.billingDetails,
        phone: quotation.billingDetails.phone?.toString() || null,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotation.");
  }
}

export async function getQuotationDataForPDF(quotationId: number) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        customer: true,
        billingDetails: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    return {
      quotation,
      customer: quotation.customer,
      billingDetails: quotation.billingDetails,
      products: quotation.products,
    };
  } catch (error) {
    console.error("Error fetching quotation data:", error);
    throw new Error("Failed to fetch quotation data");
  }
}
