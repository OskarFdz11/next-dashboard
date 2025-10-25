"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export type BillingDetailsFormState = {
  message: string | null;
  errors: {
    name?: string[];
    lastname?: string[];
    company?: string[];
    rfc?: string[];
    clabe?: string[];
    checkAccount?: string[];
    phone?: string[];
    email?: string[];
    street?: string[];
    outsideNumber?: string[];
    colony?: string[];
    city?: string[];
    cp?: string[];
  };
};
const CreateBillingDetails = z.object({
  name: z.string().min(1, "Name is required."),
  lastname: z.string().min(1, "Lastname is required."),
  company: z.string().min(1, "Company is required."),
  rfc: z.string().min(1, "RFC is required."),
  clabe: z.string().min(1, "CLABE is required."),
  checkAccount: z.string().min(1, "Check Account is required."),
  phone: z.coerce.bigint({ invalid_type_error: "Phone must be a number." }),
  email: z.string().email("Invalid email address."),
  // Address fields
  street: z.string().min(1, "Street is required."),
  outsideNumber: z.string().min(1, "Outside number is required."),
  colony: z.string().min(1, "Colony is required."),
  city: z.string().min(1, "City is required."),
  cp: z.string().min(1, "Postal code is required."),
});

const UpdateBillingDetails = z.object({
  name: z.string().min(1, "Name is required."),
  lastname: z.string().min(1, "Lastname is required."),
  company: z.string().min(1, "Company is required."),
  rfc: z.string().min(1, "RFC is required."),
  clabe: z.string().min(1, "CLABE is required."),
  checkAccount: z.string().min(1, "Check Account is required."),
  phone: z.coerce.bigint({ invalid_type_error: "Phone must be a number." }),
  email: z.string().email("Invalid email address."),
  // Address fields
  street: z.string().min(1, "Street is required."),
  outsideNumber: z.string().min(1, "Outside number is required."),
  colony: z.string().min(1, "Colony is required."),
  city: z.string().min(1, "City is required."),
  cp: z.string().min(1, "Postal code is required."),
});

export const createBillingDetails = async (
  prevState: BillingDetailsFormState,
  formData: FormData
): Promise<BillingDetailsFormState> => {
  const validatedFields = CreateBillingDetails.safeParse({
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    company: formData.get("company"),
    rfc: formData.get("rfc"),
    clabe: formData.get("clabe"),
    checkAccount: formData.get("checkAccount"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    street: formData.get("street"),
    outsideNumber: formData.get("outsideNumber"),
    colony: formData.get("colony"),
    city: formData.get("city"),
    cp: formData.get("cp"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create billing details.",
    };
  }

  const {
    name,
    lastname,
    company,
    rfc,
    clabe,
    checkAccount,
    phone,
    email,
    street,
    outsideNumber,
    colony,
    city,
    cp,
  } = validatedFields.data;

  try {
    await prisma.billingDetails.create({
      data: {
        name,
        lastname,
        company,
        rfc,
        clabe,
        checkAccount,
        phone,
        email,
        address: {
          create: {
            street,
            outsideNumber,
            colony,
            city,
            cp,
          },
        },
      },
    });
    revalidatePath("/dashboard/billing-details");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create billing details.",
      errors: { ...prevState.errors },
    };
  }

  redirect("/dashboard/billing-details");
};

export const updateBillingDetails = async (
  id: number | string,
  prevState: BillingDetailsFormState,
  formData: FormData
): Promise<BillingDetailsFormState> => {
  const validatedFields = UpdateBillingDetails.safeParse({
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    company: formData.get("company"),
    rfc: formData.get("rfc"),
    clabe: formData.get("clabe"),
    checkAccount: formData.get("checkAccount"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    street: formData.get("street"),
    outsideNumber: formData.get("outsideNumber"),
    colony: formData.get("colony"),
    city: formData.get("city"),
    cp: formData.get("cp"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update billing details.",
    };
  }

  const {
    name,
    lastname,
    company,
    rfc,
    clabe,
    checkAccount,
    phone,
    email,
    street,
    outsideNumber,
    colony,
    city,
    cp,
  } = validatedFields.data;

  try {
    // Primero obtenemos los billing details actuales para obtener el addressId
    const currentBillingDetails = await prisma.billingDetails.findUnique({
      where: { id: Number(id) },
      include: { address: true },
    });

    if (!currentBillingDetails) {
      return {
        message: "Billing details not found.",
        errors: { ...prevState.errors },
      };
    }

    // Actualizar billing details y su dirección
    await prisma.billingDetails.update({
      where: { id: Number(id) },
      data: {
        name,
        lastname,
        company,
        rfc,
        clabe,
        checkAccount,
        phone,
        email,
        address: {
          update: {
            street,
            outsideNumber,
            colony,
            city,
            cp,
          },
        },
      },
    });
    revalidatePath("/dashboard/billing-details");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to update billing details.",
      errors: { ...prevState.errors },
    };
  }
  redirect("/dashboard/billing-details");
};

export const deleteBillingDetails = async (id: number | string) => {
  try {
    // Primero obtenemos los billing details para obtener el addressId
    const billingDetails = await prisma.billingDetails.findUnique({
      where: { id: Number(id) },
    });

    if (!billingDetails) {
      throw new Error("Billing details not found");
    }

    // Eliminar billing details (esto también eliminará la dirección si no tiene otras referencias)
    await prisma.billingDetails.delete({
      where: { id: Number(id) },
    });

    // Eliminar la dirección asociada si no está siendo usada por otros billing details
    const addressUsageCount = await prisma.billingDetails.count({
      where: { addressId: billingDetails.addressId },
    });

    if (addressUsageCount === 0) {
      await prisma.address.delete({
        where: { id: billingDetails.addressId },
      });
    }

    revalidatePath("/dashboard/billing-details");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete billing details.");
  }
};
