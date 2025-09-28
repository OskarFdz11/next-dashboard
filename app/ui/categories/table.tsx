import { UpdateCategory, DeleteCategory } from "@/app/ui/categories/buttons";
import { fetchFilteredCategories } from "@/app/lib/categories-actions/categories-data";

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
              {/* Mobile */}
              <div className="md:hidden">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <UpdateCategory id={category.id} />
                        <DeleteCategory id={category.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                    <th className="px-3 py-5 font-medium">Description</th>
                    <th className="py-3 pl-6 pr-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {categories.map((category) => (
                    <tr key={category.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm sm:pl-6">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {category.description}
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <UpdateCategory id={category.id} />
                          <DeleteCategory id={category.id} />
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
