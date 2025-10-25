"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export type CustomerFormState = {
  message: string | null;
  errors: {
    name?: string[];
    lastname?: string[];
    email?: string[];
    company?: string[];
    rfc?: string[];
    phone?: string[];
  };
};

const CreateCustomer = z.object({
  name: z.string().min(1, "Name is required."),
  lastname: z.string().min(1, "Lastname is required."),
  email: z.string().email("Invalid email address."),
  company: z.string().min(1, "Company is required."),
  rfc: z.string().min(1, "RFC is required."),
  phone: z.coerce.bigint({ invalid_type_error: "Phone must be a number." }),
});

const UpdateCustomer = z.object({
  name: z.string().min(1, "Name is required."),
  lastname: z.string().min(1, "Lastname is required."),
  email: z.string().email("Invalid email address."),
  company: z.string().min(1, "Company is required."),
  rfc: z.string().min(1, "RFC is required."),
  phone: z.coerce.bigint({ invalid_type_error: "Phone must be a number." }),
});

export const createCustomer = async (
  prevState: CustomerFormState,
  formData: FormData
) => {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    company: formData.get("company"),
    rfc: formData.get("rfc"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create customer.",
    };
  }

  const { name, lastname, email, company, rfc, phone } = validatedFields.data;

  try {
    await prisma.customer.create({
      data: {
        name,
        lastname,
        email,
        company,
        rfc,
        phone,
      },
    });
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
  } catch (error) {
    return {
      message: "Database Error: Failed to create customer.",
      errors: { ...prevState.errors },
    };
  }
  redirect("/dashboard/customers");
};

export const updateCustomer = async (
  id: number | string,
  prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> => {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    company: formData.get("company"),
    rfc: formData.get("rfc"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update customer.",
    };
  }

  const { name, lastname, email, company, rfc, phone } = validatedFields.data;

  try {
    await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        name,
        lastname,
        email,
        company,
        rfc,
        phone,
      },
    });
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
  } catch (error) {
    return {
      message: "Database Error: Failed to update customer.",
      errors: { ...prevState.errors },
    };
  }

  redirect("/dashboard/customers");
};

export const deleteCustomer = async (id: number | string) => {
  "use server";
  try {
    await prisma.customer.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Database Error:", error);
  }
};
