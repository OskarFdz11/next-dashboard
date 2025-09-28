import { formatCurrency } from "./utils";
import { prisma } from "@/app/lib/prisma";

export async function fetchRevenue() {
  try {
    const data = await prisma.quotation.findMany();

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
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
    throw new Error("Failed to fetch revenue data.");
  }
}

// export async function fetchLatestInvoices() {
//   try {
//     const data = await sql<LatestInvoiceRaw[]>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch the latest invoices.");
//   }
// }

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

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
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Database Error:", error);
    }
    throw new Error("Failed to fetch card data.");
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
          { total: { equals: Number(query) || undefined } },
          // { date: { equals: query ? new Date(query) : undefined } },
          { status: { equals: query ? String(query) : undefined } },
        ],
      },
      include: {
        customer: true,
      },
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    // const invoices = await sql<InvoicesTable[]>`
    //   SELECT
    //     invoices.id,
    //     invoices.amount,
    //     invoices.date,
    //     invoices.status,
    //     customers.name,
    //     customers.email,
    //     customers.image_url
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    //   ORDER BY invoices.date DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `;

    return filteredQuotations;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
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
    });
    if (!quotation) return null;
    return {
      ...quotation,
      total: Number(quotation.total) / 100,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotation.");
  }
}
