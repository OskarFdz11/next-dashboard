import { UpdateCustomer } from "@/app/ui/customers/buttons";
import { fetchFilteredCustomers } from "@/app/lib/customer-actions/customer-data";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteCustomer } from "@/app/lib/customer-actions/customer-actions";

export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const customers = (await fetchFilteredCustomers(query, currentPage))
    .customers;

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* ✅ Condición para cuando no hay customers */}
              {!customers || customers.length === 0 ? (
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                      No hay clientes
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {query
                        ? `No se encontraron clientes para "${query}"`
                        : "Comienza agregando tu primer cliente"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile */}
                  <div className="md:hidden">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="mb-2 w-full rounded-md bg-white p-4"
                      >
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">
                              {customer.name} {customer.lastname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {customer.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {customer.company}
                            </p>
                            <p className="text-xs text-gray-400">
                              RFC: {customer.rfc}
                            </p>
                            <p className="text-xs text-gray-400">
                              Phone: {customer.phone}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <UpdateCustomer id={customer.id} />
                            <ConfirmDeleteButton
                              itemId={customer.id}
                              deleteAction={deleteCustomer}
                              entityName="cliente"
                              itemName={`${customer.name} ${customer.lastname}`}
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
                        <th className="px-4 py-5 font-medium sm:pl-6">Name</th>
                        <th className="px-3 py-5 font-medium">Lastname</th>
                        <th className="px-3 py-5 font-medium">Email</th>
                        <th className="px-3 py-5 font-medium">Company</th>
                        <th className="px-3 py-5 font-medium">RFC</th>
                        <th className="px-3 py-5 font-medium">Phone</th>
                        <th className="py-3 pl-6 pr-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="group">
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm sm:pl-6">
                            {customer.name}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.lastname}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.email}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.company}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.rfc}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.phone}
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                            <div className="flex justify-end gap-2">
                              <UpdateCustomer id={customer.id} />
                              {/* ✅ Usar ConfirmDeleteButton en lugar de DeleteCustomer */}
                              <ConfirmDeleteButton
                                itemId={customer.id}
                                deleteAction={deleteCustomer}
                                entityName="cliente"
                                itemName={`${customer.name} ${customer.lastname}`}
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
