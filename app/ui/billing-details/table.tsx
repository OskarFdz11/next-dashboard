import {
  UpdateBillingDetails,
  DeleteBillingDetails,
} from "@/app/ui/billing-details/buttons";
import { fetchFilteredBillingDetails } from "@/app/lib/billing-details-actions/billing-details-data";

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
              {/* Mobile */}
              <div className="md:hidden">
                {billingDetails?.map((detail) => (
                  <div
                    key={detail.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p className="font-medium">
                            {detail.name} {detail.lastname}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          {detail.company}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          {detail.email}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          RFC: {detail.rfc}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          Phone: {detail.phone}
                        </p>
                        {detail.address && (
                          <p className="text-sm text-gray-500">
                            {detail.address.street}{" "}
                            {detail.address.outsideNumber},{" "}
                            {detail.address.colony}, {detail.address.city}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <UpdateBillingDetails id={detail.id} />
                        <DeleteBillingDetails id={detail.id} />
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
                    <th className="px-3 py-5 font-medium">Company</th>
                    <th className="px-3 py-5 font-medium">Email</th>
                    <th className="px-3 py-5 font-medium">Phone</th>
                    <th className="px-3 py-5 font-medium">RFC</th>
                    <th className="px-3 py-5 font-medium">Address</th>
                    <th className="py-3 pl-6 pr-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {billingDetails.map((detail) => (
                    <tr key={detail.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {detail.name} {detail.lastname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {detail.company}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {detail.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {detail.phone}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {detail.rfc}
                      </td>
                      <td className="bg-white px-4 py-5 text-sm">
                        {detail.address ? (
                          <div className="text-xs text-gray-500">
                            <p>
                              {detail.address.street}{" "}
                              {detail.address.outsideNumber}
                            </p>
                            <p>{detail.address.colony}</p>
                            <p>
                              {detail.address.city}, CP: {detail.address.cp}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">No address</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <UpdateBillingDetails id={detail.id} />
                          <DeleteBillingDetails id={detail.id} />
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
