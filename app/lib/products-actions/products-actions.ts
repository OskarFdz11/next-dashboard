"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export type ProductFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    imageUrl?: string[];
    quantity?: string[];
    brand?: string[];
    category?: string[];
  };
  message?: string | null;
  success?: boolean;
};

const CreateProduct = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative("Price must be >= 0"),
  imageUrl: z.string().min(1, "Image URL is required."),
  quantity: z.coerce
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(0, "Quantity must be >= 0"),
  brand: z.string().min(1, "Brand is required."),
  category: z.string().min(1, "Category is required."),
});

const UpdateProduct = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  imageUrl: z.string().min(1, "Image URL is required."),
  quantity: z.coerce.number().min(0, "Quantity must be a positive number."),
  brand: z.string().min(1, "Brand is required."),
  category: z.string().min(1, "Please select a category."),
});

export const createProduct = async (
  prevState: ProductFormState,
  formData: FormData
) => {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    quantity: formData.get("quantity"),
    brand: formData.get("brand"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create product.",
    };
  }

  const { name, description, price, imageUrl, quantity, brand, category } =
    validatedFields.data;

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
        quantity: Number(quantity),
        brand,
        categoryId: Number(category),
      },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    return {
      message: "Product created successfully",
      errors: {},
      success: true,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create product.",
      errors: { ...prevState.errors },
      success: false,
    };
  }
};

export const updateProduct = async (
  id: number | string,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> => {
  const validatedFields = UpdateProduct.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    quantity: formData.get("quantity"),
    brand: formData.get("brand"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update product.",
    };
  }

  const { name, description, price, imageUrl, quantity, brand, category } =
    validatedFields.data;

  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
        quantity: Number(quantity),
        brand,
        categoryId: Number(category),
      },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
    return {
      message: "Product updated successfully",
      errors: {},
      success: true,
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to update product.",
      errors: { ...prevState.errors },
      success: false,
    };
  }
};

export const deleteProduct = async (id: number | string) => {
  try {
    // Soft delete: marcar como eliminado en lugar de eliminar físicamente
    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        deleted_at: new Date(), // Marcar como eliminado
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product");
  }
};
