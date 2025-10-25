"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

export type CategoryFormState = {
  message: string | null;
  errors: {
    name?: string[];
    description?: string[];
  };
};

const CreateCategory = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
});

const UpdateCategory = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
});

export const createCategory = async (
  prevState: CategoryFormState,
  formData: FormData
) => {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create category.",
    };
  }

  const { name, description } = validatedFields.data;

  try {
    await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/products/create");
    revalidatePath("/dashboard/products/[id]/edit", "page");
  } catch (error) {
    return {
      message: "Database Error: Failed to create category.",
      errors: { ...prevState.errors },
    };
  }

  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
};

export const updateCategory = async (
  id: number | string,
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> => {
  const validatedFields = UpdateCategory.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update category.",
    };
  }

  const { name, description } = validatedFields.data;

  try {
    await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/products/create");
    revalidatePath("/dashboard/products/[id]/edit", "page");
  } catch (error) {
    return {
      message: "Database Error: Failed to update category.",
      errors: { ...prevState.errors },
    };
  }

  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
};

export const deleteCategory = async (id: number | string) => {
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/dashboard/categories");
  } catch (error) {
    console.error("Database Error:", error);
  }
};
