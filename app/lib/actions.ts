"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

const FormSchema = z.object({
  id: z.number(),
  customerId: z.number({
    invalid_type_error: "Please select a customer.",
  }),
  total: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.boolean({
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateQuotation = FormSchema.omit({ id: true, date: true });

const UpdateQuotation = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    total?: string[];
    status?: string[];
  };
  message?: string | null;
};

export const createQuotation = async (prevState: State, formData: FormData) => {
  const validatedFields = CreateQuotation.safeParse({
    customerId: formData.get("customerId"),
    total: formData.get("total"),
    status: formData.get("status"),
    iva: formData.get("iva"),
    billingDetailsId: formData.get("billingDetailsId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Quotation.",
    };
  }

  const { customerId, total, status } = validatedFields.data;

  const totalInCents = total * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await prisma.quotation.create({
      data: {
        customerId: Number(customerId),
        total: totalInCents,
        status: status ? "paid" : "pending",
        date,
        billingDetailsId: 1, // Replace with actual billingDetailsId as needed
        iva: false ? false : true, // Replace with actual IVA value as needed
        subtotal: totalInCents, // Replace with actual subtotal if different
        notes: "", // Replace with actual notes if needed
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Quotation.",
    };
  }

  revalidatePath("dashboard/quotations");
  redirect("/dashboard/quotations");
};

export const updateQuotation = async (
  id: string | number,
  prevState: State,
  formData: FormData
) => {
  const validatedFields = UpdateQuotation.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  const { customerId, total, status } = validatedFields.data;

  const totalInCents = total * 100;

  try {
    await prisma.quotation.update({
      where: { id: Number(id) },
      data: {
        customerId: Number(customerId),
        total: totalInCents,
        status: status ? "paid" : "pending",
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
};

export async function deleteQuotation(id: string | number) {
  try {
    await prisma.quotation.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.log(error);
  }
}
