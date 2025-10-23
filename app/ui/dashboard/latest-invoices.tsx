import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { fetchLatestQuotations } from "@/app/lib/quotations-actions/quotations-data";
import { formatCurrency } from "@/app/lib/utils";

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestQuotations();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Últimas Cotizaciones
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white px-6">
          {latestInvoices.map((quotation, i) => {
            const total = quotation.total;
            console.log(
              "Total original:",
              quotation.total,
              "Convertido:",
              total
            );
            return (
              <div
                key={quotation.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  {/* <Image
                    src={quotation.image_url}
                    alt={`${quotation.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  /> */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      <span className="text-gray-500">({quotation.id})</span>
                      {quotation.customer.name} {quotation.customer.lastname}
                    </p>
                    <p className="truncate text-sm font-semibold md:text-base">
                      {quotation.customer.company}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {quotation.customer.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {formatCurrency(total)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
