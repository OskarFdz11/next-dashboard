"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

// Schema para productos en la cotización
const QuotationProductSchema = z.object({
  productId: z.coerce.number({
    invalid_type_error: "Product ID must be a number",
  }),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be positive"),
});

const FormSchema = z.object({
  id: z.number(),
  customerId: z.coerce.number({
    invalid_type_error: "Please select a customer.",
  }),
  billingDetailsId: z.coerce.number({
    invalid_type_error: "Please select billing details.",
  }),
  iva: z.boolean().default(false),
  notes: z.string().optional().default(""),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a valid status.",
  }),
  products: z
    .array(QuotationProductSchema)
    .min(1, "At least one product is required"),
});

const CreateQuotation = FormSchema.omit({ id: true });
const UpdateQuotation = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    products?: string[];
    customerId?: string[];
    billingDetailsId?: string[];
    iva?: string[];
    notes?: string[];
    status?: string[];
    general?: string[];
  };
  message: string;
  success: boolean;
};

export const createQuotation = async (prevState: State, formData: FormData) => {
  // Extraer productos del formData
  const productsData = [];
  let productIndex = 0;

  while (formData.get(`products[${productIndex}][productId]`)) {
    productsData.push({
      productId: formData.get(`products[${productIndex}][productId]`),
      quantity: formData.get(`products[${productIndex}][quantity]`),
      price: formData.get(`products[${productIndex}][price]`),
    });
    productIndex++;
  }

  const validatedFields = CreateQuotation.safeParse({
    customerId: formData.get("customerId"),
    billingDetailsId: formData.get("billingDetailsId"),
    iva: formData.get("iva") === "on" || formData.get("iva") === "true",
    notes: formData.get("notes") || "",
    status: formData.get("status"),
    products: productsData,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create quotation.",
      success: false,
    };
  }

  const { customerId, billingDetailsId, iva, notes, status, products } =
    validatedFields.data;

  // Calcular subtotal
  const subtotal = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  // Calcular total (con o sin IVA del 16%)
  const total = iva ? subtotal * 1.16 : subtotal;

  try {
    // Crear la cotización con sus productos en una transacción
    const quotation = await prisma.$transaction(async (tx) => {
      // Crear la cotización
      const newQuotation = await tx.quotation.create({
        data: {
          customerId,
          billingDetailsId,
          iva,
          subtotal,
          total,
          notes,
          status,
          date: new Date(),
        },
      });

      // Crear los productos de la cotización
      await tx.quotationProduct.createMany({
        data: products.map((product) => ({
          quotationId: newQuotation.id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
      });

      return newQuotation;
    });

    revalidatePath("/dashboard/quotations");
    return {
      errors: {},
      message: "Quotation created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { general: ["Database error occurred"] },
      message: "Database Error: Failed to create quotation.",
      success: false,
    };
  }
};
export const updateQuotation = async (
  id: string | number,
  prevState: State,
  formData: FormData
): Promise<State> => {
  // Extraer productos del formData
  const productsData = [];
  let productIndex = 0;

  while (formData.get(`products[${productIndex}][productId]`)) {
    productsData.push({
      productId: formData.get(`products[${productIndex}][productId]`),
      quantity: formData.get(`products[${productIndex}][quantity]`),
      price: formData.get(`products[${productIndex}][price]`),
    });
    productIndex++;
  }

  const validatedFields = UpdateQuotation.safeParse({
    customerId: formData.get("customerId"),
    billingDetailsId: formData.get("billingDetailsId"),
    iva: formData.get("iva") === "on" || formData.get("iva") === "true",
    notes: formData.get("notes") || "",
    status: formData.get("status"),
    products: productsData,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update quotation.",
      success: false,
    };
  }

  const { customerId, billingDetailsId, iva, notes, status, products } =
    validatedFields.data;

  // Calcular subtotal
  const subtotal = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  // Calcular total (con o sin IVA del 16%)
  const total = iva ? subtotal * 1.16 : subtotal;

  try {
    await prisma.$transaction(async (tx) => {
      // Actualizar la cotización
      await tx.quotation.update({
        where: { id: Number(id) },
        data: {
          customerId,
          billingDetailsId,
          iva,
          subtotal,
          total,
          notes,
          status,
        },
      });

      // Eliminar productos existentes
      await tx.quotationProduct.deleteMany({
        where: { quotationId: Number(id) },
      });

      // Crear los nuevos productos
      await tx.quotationProduct.createMany({
        data: products.map((product) => ({
          quotationId: Number(id),
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
      });
    });
    return {
      errors: {},
      message: "Quotation updated successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { general: ["Database error occurred"] },
      message: "Database Error: Failed to update quotation.",
      success: false,
    };
  }
};

export async function duplicateQuotation(id: string | number) {
  "use server";
  try {
    await prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      });

      if (!quotation) throw new Error("Quotation not found");

      // Crear una nueva cotización con los mismos datos
      const newQuotation = await tx.quotation.create({
        data: {
          customerId: quotation.customerId,
          billingDetailsId: quotation.billingDetailsId,
          iva: quotation.iva,
          subtotal: quotation.subtotal,
          total: quotation.total,
          notes: quotation.notes,
          status: quotation.status,
          date: new Date(),
        },
      });

      // Duplicar los productos de la cotización
      await tx.quotationProduct.createMany({
        data: quotation.products.map((product) => ({
          quotationId: newQuotation.id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
      });

      return newQuotation;
    });

    revalidatePath("/dashboard/quotations");
    return {
      errors: {},
      message: "Quotation duplicated successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { general: ["Database error occurred"] },
      message: "Database Error: Failed to duplicate quotation.",
      success: false,
    };
  }
}

export async function deleteQuotation(id: string | number) {
  "use server";
  try {
    await prisma.$transaction(async (tx) => {
      // Eliminar productos de la cotización primero
      await tx.quotationProduct.deleteMany({
        where: { quotationId: Number(id) },
      });

      // Eliminar la cotización
      await tx.quotation.delete({
        where: { id: Number(id) },
      });
    });

    revalidatePath("/dashboard/quotations");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete quotation");
  }
}
