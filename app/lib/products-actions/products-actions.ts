"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export type ProductFormState = {
  message: string | null;
  errors: {
    name?: string[];
    description?: string[];
    price?: string[];
    image_url?: string[];
    quantity?: string[];
    brand?: string[];
    category?: string[];
  };
};

const CreateProduct = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  price: z.number().min(0, "Price must be a positive number."),
  image_url: z.string().min(1, "Image URL is required."),
  quantity: z.number().min(0, "Quantity must be a positive number."),
  brand: z.string().min(1, "Brand is required."),
  category: z.string().min(1, "Category is required."),
});

const UpdateProduct = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  price: z.number().min(0, "Price must be a positive number."),
  image_url: z.string().min(1, "Image URL is required."),
  quantity: z.number().min(0, "Quantity must be a positive number."),
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
    image_url: formData.get("image_url"),
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

  const { name, description, price, image_url, quantity, brand, category } =
    validatedFields.data;

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        image_url,
        quantity,
        brand,
        categoryId: Number(category),
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to create product.",
      errors: { ...prevState.errors },
    };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
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
    image_url: formData.get("image_url"),
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

  const { name, description, price, image_url, quantity, brand, category } =
    validatedFields.data;

  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        image_url,
        quantity,
        brand,
        categoryId: Number(category),
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to update product.",
      errors: { ...prevState.errors },
    };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const deleteProduct = async (id: number | string) => {
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/dashboard/products");
  } catch (error) {
    console.error("Database Error:", error);
  }
};
