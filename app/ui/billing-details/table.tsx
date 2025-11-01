import { UpdateBillingDetails } from "@/app/ui/billing-details/buttons"; // Solo UpdateBillingDetails
import { fetchFilteredBillingDetails } from "@/app/lib/billing-details-actions/billing-details-data";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteBillingDetails } from "@/app/lib/billing-details-actions/billing-details-actions";

export default async function BillingDetailsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const billingDetails = (await fetchFilteredBillingDetails(query, currentPage))
    .billingDetails;

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* ✅ Condición para cuando no hay billing details */}
              {!billingDetails || billingDetails.length === 0 ? (
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                      No hay detalles de pago
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {query
                        ? `No se encontraron detalles de pago para "${query}"`
                        : "Comienza agregando tu primer detalle de pago"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile */}
                  <div className="md:hidden">
                    {billingDetails.map((billing) => (
                      <div
                        key={billing.id}
                        className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200 shadow-sm"
                      >
                        {/* Encabezado */}
                        <div className="pb-3 border-b border-gray-200">
                          <p className="text-sm">
                            <span className="font-semibold text-blue-600">
                              #{billing.id}
                            </span>
                          </p>
                        </div>

                        {/* Datos */}
                        <div className="mt-3">
                          <p className="font-medium text-gray-900">
                            {billing.name} {billing.lastname}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {billing.company}
                          </p>

                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-500">
                              RFC: {billing.rfc}
                            </p>
                            <p className="text-xs text-gray-500">
                              Email: {billing.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              Teléfono: {billing.phone}
                            </p>
                            {billing.cardNumber && (
                              <p className="text-xs text-gray-500">
                                Número de tarjeta: {billing.cardNumber}
                              </p>
                            )}
                            {billing.clabe && (
                              <p className="text-xs text-gray-500">
                                CLABE: {billing.clabe}
                              </p>
                            )}
                            {billing.checkAccount && (
                              <p className="text-xs text-gray-500">
                                Cuenta de cheques: {billing.checkAccount}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Acciones abajo con separador */}
                        <div className="mt-4 border-t border-gray-200 pt-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-10 w-10 inline-flex items-center justify-center">
                              <UpdateBillingDetails
                                id={billing.id}
                                variant="icon"
                              />
                            </div>
                            <div className="h-10 w-10 inline-flex items-center justify-center">
                              <ConfirmDeleteButton
                                itemId={billing.id}
                                deleteAction={deleteBillingDetails}
                                entityName="detalle de facturación"
                                itemName={`${billing.name} ${billing.lastname} - ${billing.company}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                      <tr>
                        <th className="px-4 py-5 font-medium sm:pl-6">ID</th>
                        <th className="px-4 py-5 font-medium sm:pl-6">
                          Nombre
                        </th>
                        <th className="px-3 py-5 font-medium">Apellido</th>
                        <th className="px-3 py-5 font-medium">Empresa</th>
                        <th className="px-3 py-5 font-medium">RFC</th>
                        <th className="px-3 py-5 font-medium">Email</th>
                        <th className="px-3 py-5 font-medium">Teléfono</th>
                        <th className="px-3 py-5 font-medium">
                          Número de tarjeta
                        </th>
                        <th className="px-3 py-5 font-medium">CLABE</th>

                        <th className="px-3 py-5 font-medium">
                          Cuenta de cheques
                        </th>
                        <th className="py-3 pl-6 pr-3 text-right font-medium">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {billingDetails.map((billing) => (
                        <tr key={billing.id} className="group hover:bg-gray-50">
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium sm:pl-6">
                            <span className="font-semibold text-blue-600">
                              #{billing.id}
                            </span>
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium sm:pl-6">
                            {billing.name}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {billing.lastname}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {billing.company}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm font-mono text-xs">
                            {billing.rfc}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm text-blue-600">
                            {billing.email}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {billing.phone}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {billing.cardNumber || (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm font-mono text-xs">
                            {billing.clabe || (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm font-mono text-xs">
                            {billing.checkAccount || (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                            <div className="flex justify-end gap-2">
                              <UpdateBillingDetails id={billing.id} />
                              <ConfirmDeleteButton
                                itemId={billing.id}
                                deleteAction={deleteBillingDetails}
                                entityName="detalle de facturación"
                                itemName={`${billing.name} ${billing.lastname} - ${billing.company}`}
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
