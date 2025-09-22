import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchQuotationById, fetchCustomers } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Quotation",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [quotation, customers] = await Promise.all([
    fetchQuotationById(id),
    fetchCustomers(),
  ]);
  if (!quotation) {
    notFound();
  }

  const quotationForForm = {
    ...quotation,
    subtotal:
      typeof quotation.subtotal === "object" && "toNumber" in quotation.subtotal
        ? quotation.subtotal.toNumber()
        : Number(quotation.subtotal),
    status: quotation.status as "pending" | "paid",
  };
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form quotation={quotationForForm} customers={customers} />
    </main>
  );
}
