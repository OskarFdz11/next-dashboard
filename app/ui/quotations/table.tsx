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
          <div className="md:hidden">
            {quotations?.map((quotation) => (
              <div
                key={quotation.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-medium">#{quotation.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {quotation.customer.name}
                    </p>
                  </div>
                  <QuotationStatus status={quotation.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(quotation.total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(String(quotation.date))}
                    </p>
                  </div>
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
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Empresa
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Subtotal
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  IVA
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estado
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quotations?.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-blue-600">
                        #{quotation.id}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="font-medium">
                      {quotation.customer.name} {quotation.customer.lastname}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quotation.customer.email}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {quotation.customer.company}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(quotation.subtotal)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {formatCurrency(quotation.total)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
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
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(String(quotation.date))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <QuotationStatus status={quotation.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
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
      </div>
    </div>
  );
}
