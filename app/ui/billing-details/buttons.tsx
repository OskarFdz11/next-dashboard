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

export function UpdateBillingDetails({
  id,
  variant = "default",
}: {
  id: number;
  variant?: "default" | "icon";
}) {
  const base =
    "inline-flex items-center justify-center rounded-md transition-colors";
  const iconClasses =
    "h-10 w-10 border border-gray-200 text-gray-600 hover:bg-gray-100";
  const defaultClasses =
    "px-3 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100";

  return (
    <Link
      href={`/dashboard/billing-details/${id}/edit`}
      className={`${base} ${variant === "icon" ? iconClasses : defaultClasses}`}
      title="Editar detalle de pago"
      aria-label="Editar detalle de pago"
    >
      <PencilIcon className={variant === "icon" ? "h-5 w-5" : "h-4 w-4 mr-2"} />
      {variant === "default" && <span>Editar</span>}
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
