import { deleteBillingDetails } from "@/app/lib/billing-details-actions/billing-details-actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateBillingDetails() {
  return (
    <Link
      href="/dashboard/billing-details/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Billing Details</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBillingDetails({ id }: { id: number | string }) {
  return (
    <Link
      href={`/dashboard/billing-details/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBillingDetails({ id }: { id: string | number }) {
  const deleteBillingDetailsWithId = deleteBillingDetails.bind(null, id);
  return (
    <form action={deleteBillingDetailsWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
