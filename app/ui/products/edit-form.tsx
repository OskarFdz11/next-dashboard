"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";

import {
  ProductFormState,
  updateProduct,
} from "@/app/lib/products-actions/products-actions";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ProductField } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

export default function EditProductForm({
  product,
  categories,
}: {
  product: ProductField;
  categories: { id: number; name: string }[];
}) {
  const initialState: ProductFormState = { message: null, errors: {} };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateProductWithId, initialState);
  const [imageUrl, setImageUrl] = useState<string | null>(
    product.image_url || ""
  );
  const [publicId, setPublicId] = useState<string | null>("");
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      const currentName = nameRef.current?.value || product.name || "";
      // Redirige a la lista con el flag de "updated"
      router.replace(
        `/dashboard/products?updated=${encodeURIComponent(currentName)}`
      );
    }
  }, [state.success, router, product.name]);

  return (
    <form action={formAction}>
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
            defaultValue={product.name}
            placeholder="Enter product name"
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
          <textarea
            id="description"
            name="description"
            defaultValue={product.description}
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
        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Product Category
          </label>
          <select
            id="category"
            defaultValue={product.category.id}
            name="category"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category &&
              state.errors.category.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Image URL */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Image</label>
          <div className="flex items-end gap-4">
            {imageUrl && (
              <Image
                src={imageUrl}
                width={96}
                height={96}
                alt="Preview"
                className="h-24 w-24 rounded object-cover"
              />
            )}

            <CldUploadWidget
              uploadPreset="products-images"
              options={{ multiple: false, folder: "products" }}
              onSuccess={(result) => {
                const info =
                  (result?.info as {
                    secure_url?: string;
                    public_id?: string;
                  }) || {};
                const url = info.secure_url as string | undefined;
                const pid = info.public_id as string | undefined;
                if (url) setImageUrl(url);
                if (pid) setPublicId(pid);
              }}
            >
              {({ open }) => {
                return (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="rounded bg-blue-600 px-3 py-2 text-white"
                  >
                    Upload Image
                  </button>
                );
              }}
            </CldUploadWidget>
          </div>

          {/* Hidden inputs to send to server */}
          <input type="hidden" name="imageUrl" value={imageUrl || ""} />

          <div id="image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.imageUrl?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
          </div>
        </div>
        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Product Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            defaultValue={product.price}
            placeholder="Enter Product Price"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Brand */}
        <div className="mb-4">
          <label htmlFor="brand" className="mb-2 block text-sm font-medium">
            Product Brand
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            defaultValue={product.brand}
            placeholder="Enter Product Brand"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="brand-error" aria-live="polite" aria-atomic="true">
            {state.errors?.brand &&
              state.errors.brand.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Stock */}
        <div className="mb-4">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Product Stock
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={product.quantity}
            placeholder="Enter Product Stock"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="quantity-error" aria-live="polite" aria-atomic="true">
            {state.errors?.quantity &&
              state.errors.quantity.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Product</Button>
      </div>
    </form>
  );
}
