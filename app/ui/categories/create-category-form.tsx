"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createCategory,
  CategoryFormState,
} from "@/app/lib/categories-actions/categories-actions";
import { CategoryField } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { applyPersistedToFormData } from "@/app/lib/utils";

export default function CreateCategoryForm({
  categories,
}: {
  categories: CategoryField[];
}) {
  const router = useRouter();
  const initialState: CategoryFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const [state, formAction] = useActionState(createCategory, initialState);
  const nameRef = useRef<HTMLInputElement>(null);

  const {
    data: formData,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    name: string;
    description: string;
  }>("create-customer-form", {
    name: "",
    description: "",
  });

  const clearCompleteForm = useCallback(() => {
    clearData();
  }, [clearData]);

  useEffect(() => {
    if (state.success) {
      const currentName = nameRef.current?.value || categories[0]?.name || "";
      // Redirige a la lista con el flag de "created"
      clearCompleteForm();
      router.replace(
        `/dashboard/categories?created=${encodeURIComponent(currentName)}`
      );
    }
  }, [state.success, router, categories]);

  const handleSubmit = async (fd: FormData) => {
    applyPersistedToFormData(fd, formData);
    await formAction(fd);
  };

  if (!isLoaded) return null;

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter first name"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Enter description"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/categories"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Category</Button>
      </div>
    </form>
  );
}
