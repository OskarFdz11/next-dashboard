import { UpdateQuotation, DeleteQuotation } from "@/app/ui/quotations/buttons";
import QuotationStatus from "@/app/ui/quotations/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredQuotations } from "@/app/lib/quotations-actions/quotations-data";
import ConfirmDeleteButton from "../confirm-delete-button";
import { deleteQuotation } from "@/app/lib/quotations-actions/quotations-actions";
import DownloadPDFButton from "@/app/ui/quotations/download-pdf-button";
import QuotationActions from "./quotations-actions-dropdown";

export default async function QuotationsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const quotations = await fetchFilteredQuotations(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Condición para cuando no hay cotizaciones */}
          {!quotations || quotations.length === 0 ? (
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
                  No hay cotizaciones
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {query
                    ? `No se encontraron cotizaciones para "${query}"`
                    : "Comienza creando tu primera cotización"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ========== VISTA MÓVIL ========== */}
              <div className="md:hidden space-y-3">
                {quotations.map((quotation) => (
                  <div
                    key={quotation.id}
                    className="w-full rounded-lg bg-white p-4 shadow-sm border border-gray-200"
                  >
                    {/* Encabezado */}
                    <div className="pb-3 border-b border-gray-200">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-600">
                          #{quotation.id}
                        </span>
                      </p>
                    </div>
                    {/* ID, Cliente y Estado en la misma línea */}
                    <div className="flex items-center justify-between mb-3 mt-2">
                      <p className="font-semibold text-gray-900 text-lg leading-tight">
                        {quotation.customer.name} {quotation.customer.lastname}
                      </p>
                      <QuotationStatus status={quotation.status} />
                    </div>

                    {/* Información principal */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            Email
                          </p>
                          <p className="text-sm text-gray-700 break-all">
                            {quotation.customer.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            Empresa
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {quotation.customer.company}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              Subtotal
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(quotation.subtotal)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              IVA
                            </p>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                quotation.iva
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {quotation.iva ? "16%" : "0%"}
                            </span>
                          </div>
                        </div>

                        {/* Fecha arriba del total */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            Fecha
                          </p>
                          <p className="text-sm text-gray-700">
                            {formatDateToLocal(String(quotation.date))}
                          </p>
                        </div>

                        {/* Total destacado */}
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            Total
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(quotation.total)}
                          </p>
                        </div>
                      </div>

                      {/* Botones en la parte inferior */}
                      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <DownloadPDFButton
                          quotationId={quotation.id}
                          customerName={quotation.customer.name}
                          hideText={true}
                        />
                        <QuotationActions
                          quotationId={quotation.id}
                          customerName={quotation.customer.name}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========== VISTA TABLET/DESKTOP ========== */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-gray-900">
                  <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-5 font-medium sm:pl-6 min-w-[80px]"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[200px]"
                      >
                        Cliente
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[150px] hidden lg:table-cell"
                      >
                        Empresa
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px] hidden xl:table-cell"
                      >
                        Subtotal
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px]"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[80px] hidden xl:table-cell"
                      >
                        IVA
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px] hidden lg:table-cell"
                      >
                        Fecha
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px]"
                      >
                        Estado
                      </th>
                      <th className="px-3 py-5 font-medium text-left min-w-[120px]">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {quotations.map((quotation) => (
                      <tr
                        key={quotation.id}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap px-4 py-3 sm:pl-6">
                          <span className="font-semibold text-blue-600">
                            #{quotation.id}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="max-w-[200px]">
                            <p className="font-medium truncate">
                              {quotation.customer.name}{" "}
                              {quotation.customer.lastname}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {quotation.customer.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <div className="max-w-[150px]">
                            <p className="truncate font-medium">
                              {quotation.customer.company}
                            </p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 hidden xl:table-cell">
                          {formatCurrency(quotation.subtotal)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-medium">
                          {formatCurrency(quotation.total)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 hidden xl:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              quotation.iva
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {quotation.iva ? "16%" : "0%"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 hidden lg:table-cell">
                          {formatDateToLocal(String(quotation.date))}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <QuotationStatus status={quotation.status} />
                        </td>
                        <td className="whitespace-nowrap py-3 ">
                          <div className="flex items-center gap-2">
                            <DownloadPDFButton
                              quotationId={quotation.id}
                              customerName={quotation.customer.name}
                            />
                            <QuotationActions
                              quotationId={quotation.id}
                              customerName={quotation.customer.name}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
