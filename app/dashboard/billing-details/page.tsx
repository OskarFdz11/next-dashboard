import Table from "@/app/ui/billing-details/table";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchFilteredBillingDetails } from "@/app/lib/billing-details-actions/billing-details-data";
import { CreateBillingDetails } from "@/app/ui/billing-details/buttons";

export const metadata: Metadata = {
  title: "Billing Details",
};
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { totalPages } = await fetchFilteredBillingDetails(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Billing Details</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search billing details..." />
        <CreateBillingDetails />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
