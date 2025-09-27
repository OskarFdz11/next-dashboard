import { UpdateProduct, DeleteProduct } from "@/app/ui/products/buttons";
import { fetchFilteredProducts } from "@/app/lib/products-actions/products-data";
import Image from "next/image";
import { truncate } from "@/app/lib/utils";

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
              {/* Mobile */}
              <div className="md:hidden">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <UpdateProduct id={product.id} />
                        <DeleteProduct id={product.id} />
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
                    <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
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
                          className="mr-4 rounded object-cover"
                          width={64}
                          height={64}
                        />
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm sm:pl-6">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {truncate(product.description, 100)}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        ${Number(product.price)}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {product.quantity}
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <UpdateProduct id={product.id} />
                          <DeleteProduct id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
