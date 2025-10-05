import { UpdateQuotation, DeleteQuotation } from "@/app/ui/quotations/buttons";
import QuotationStatus from "@/app/ui/quotations/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredQuotations } from "@/app/lib/quotations-actions/quotations-data";

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
          {/* Mobile View */}
          <div className="md:hidden">
            {quotations?.map((quotation) => (
              <div
                key={quotation.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="font-medium">
                        {quotation.customer.name} {quotation.customer.lastname}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {quotation.customer.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quotation.customer.company}
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
                      Subtotal: {formatCurrency(quotation.subtotal)}
                    </p>
                    {quotation.iva && (
                      <p className="text-xs text-gray-400">IVA incluido</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(quotation.date.toString())}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateQuotation id={quotation.id} />
                    <DeleteQuotation id={quotation.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Company
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
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quotations?.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">
                          {quotation.customer.name}{" "}
                          {quotation.customer.lastname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {quotation.customer.email}
                        </p>
                      </div>
                    </div>
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
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {quotation.iva ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        16%
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(quotation.date.toString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <QuotationStatus status={quotation.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateQuotation id={quotation.id} />
                      <DeleteQuotation id={quotation.id} />
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
