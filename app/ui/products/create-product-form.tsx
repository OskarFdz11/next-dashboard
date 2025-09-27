"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createProduct,
  ProductFormState,
} from "@/app/lib/products-actions/products-actions";
import { CategoryField, ProductField } from "@/app/lib/definitions";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function CreateProductForm({
  products,
  categories,
}: {
  products: ProductField[];
  categories: CategoryField[];
}) {
  const initialState: ProductFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const [publicId, setPublicId] = useState<string | null>("");

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Product Name"
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
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter Product Description"
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
          <CldUploadWidget
            uploadPreset="products-images"
            options={{ multiple: false, folder: "products" }}
            onSuccess={(result) => {
              const info =
                (result?.info as { secure_url?: string; public_id?: string }) ||
                {};
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

          {(publicId || imageUrl) && (
            <div className="mt-3 flex items-center gap-3">
              {publicId ? (
                <CldImage
                  src={publicId}
                  width="96"
                  height="96"
                  alt="Preview"
                  className="h-24 w-24 rounded object-cover"
                  crop="fill"
                  gravity="auto"
                />
              ) : (
                <Image
                  src={imageUrl!}
                  alt="Preview"
                  className="h-24 w-24 rounded object-cover"
                />
              )}
              {/* <span className="text-xs text-gray-500 break-all">
                {publicId || imageUrl}
              </span> */}
            </div>
          )}

          {/* Hidden inputs to send to server */}
          <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
          <input type="hidden" name="imagePublicId" value={publicId ?? ""} />

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
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
