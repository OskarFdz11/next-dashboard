import { UpdateCategory } from "@/app/ui/categories/buttons"; // Solo UpdateCategory
import { fetchFilteredCategories } from "@/app/lib/categories-actions/categories-data";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteCategory } from "@/app/lib/categories-actions/categories-actions";

export default async function CategoriesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const categories = (await fetchFilteredCategories(query, currentPage))
    .categories;

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* ✅ Condición para cuando no hay categorías */}
              {!categories || categories.length === 0 ? (
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                      No hay categorías
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {query
                        ? `No se encontraron categorías para "${query}"`
                        : "Comienza creando tu primera categoría"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile */}
                  <div className="md:hidden">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="mb-2 w-full rounded-md bg-white p-4"
                      >
                        <div className="flex items-center justify-between border-b pb-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {category.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 break-words">
                              {category.description}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                            <UpdateCategory id={category.id} />
                            <ConfirmDeleteButton
                              itemId={category.id}
                              deleteAction={deleteCategory}
                              entityName="categoría"
                              itemName={category.name}
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
                        <th className="px-4 py-5 font-medium sm:pl-6">
                          Nombre
                        </th>
                        <th className="px-3 py-5 font-medium">Descripción</th>
                        <th className="py-3 pl-6 pr-3 text-right font-medium">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {categories.map((category) => (
                        <tr
                          key={category.id}
                          className="group hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium sm:pl-6">
                            {category.name}
                          </td>
                          <td className="bg-white px-4 py-5 text-sm text-gray-600">
                            <div className="max-w-xs">
                              {category.description}
                            </div>
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                            <div className="flex justify-end gap-2">
                              <UpdateCategory id={category.id} />
                              <ConfirmDeleteButton
                                itemId={category.id}
                                deleteAction={deleteCategory}
                                entityName="categoría"
                                itemName={category.name}
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
