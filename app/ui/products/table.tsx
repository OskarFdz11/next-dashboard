import { UpdateProduct } from "@/app/ui/products/buttons"; // Solo UpdateProduct
import { fetchFilteredProducts } from "@/app/lib/products-actions/products-data";
import Image from "next/image";
import { truncate } from "@/app/lib/utils";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteProduct } from "@/app/lib/products-actions/products-actions";

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = (await fetchFilteredProducts(query, currentPage)).products;

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* ✅ Condición para cuando no hay productos */}
              {!products || products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
                  <div className="text-gray-400 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                      No hay productos
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {query
                        ? `No se encontraron productos para "${query}"`
                        : "Comienza agregando tu primer producto"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile */}
                  <div className="md:hidden">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="mb-2 w-full rounded-md bg-white p-4"
                      >
                        <div className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.image_url}
                              alt={`${product.name}'s picture`}
                              className="rounded object-cover"
                              width={48}
                              height={48}
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.brand}
                              </p>
                              <p className="text-xs text-gray-400">
                                {truncate(product.description, 60)}
                              </p>
                              <div className="flex gap-4 mt-1">
                                <p className="text-sm font-medium text-green-600">
                                  ${Number(product.price)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Stock: {product.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <UpdateProduct id={product.id} />
                            <ConfirmDeleteButton
                              itemId={product.id}
                              deleteAction={deleteProduct}
                              entityName="producto"
                              itemName={`${product.name} - ${product.brand}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                      <tr>
                        <th className="px-4 py-5 font-medium sm:pl-6">Image</th>
                        <th className="px-4 py-5 font-medium">Name</th>
                        <th className="px-3 py-5 font-medium">Brand</th>
                        <th className="px-3 py-5 font-medium">Description</th>
                        <th className="px-4 py-5 font-medium">Price</th>
                        <th className="px-4 py-5 font-medium">Stock</th>
                        <th className="py-3 pl-6 pr-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {products.map((product) => (
                        <tr key={product.id} className="group">
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm sm:pl-6">
                            <Image
                              src={product.image_url}
                              alt={`${product.name}'s picture`}
                              className="rounded object-cover"
                              width={64}
                              height={64}
                            />
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium">
                            {product.name}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {product.brand}
                          </td>
                          <td className="bg-white px-4 py-5 text-sm">
                            <div className="max-w-xs">
                              {truncate(product.description, 100)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm font-medium text-green-600">
                            ${Number(product.price)}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                product.quantity > 10
                                  ? "bg-green-100 text-green-800"
                                  : product.quantity > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.quantity}
                            </span>
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                            <div className="flex justify-end gap-2">
                              <UpdateProduct id={product.id} />
                              <ConfirmDeleteButton
                                itemId={product.id}
                                deleteAction={deleteProduct}
                                entityName="producto"
                                itemName={`${product.name} - ${product.brand}`}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
