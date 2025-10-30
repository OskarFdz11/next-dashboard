"use client";

import {
  CustomerFormState,
  updateCustomer,
} from "@/app/lib/customer-actions/customer-actions";
import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useRouter } from "next/navigation";

export type CustomerEditFormProps = {
  customer: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    company: string;
    rfc: string;
    phone: bigint | number | string;
  };
};

export default function EditCustomerForm({ customer }: CustomerEditFormProps) {
  const router = useRouter();
  const initialState: CustomerFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(
    updateCustomerWithId,
    initialState
  );

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      const currentName = nameRef.current?.value || customer.name || "";
      router.replace(
        `/dashboard/customers?updated=${encodeURIComponent(currentName)}`
      );
    }
  }, [state.success, router, customer]);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            defaultValue={customer.name}
            placeholder="Enter first name"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Lastname */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Lastname
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            defaultValue={customer.lastname}
            placeholder="Enter last name"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="lastname-error" aria-live="polite" aria-atomic="true">
            {state.errors?.lastname &&
              state.errors.lastname.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email}
            placeholder="Enter email"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Company */}
        <div className="mb-4">
          <label htmlFor="company" className="mb-2 block text-sm font-medium">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            defaultValue={customer.company}
            placeholder="Enter company"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="company-error" aria-live="polite" aria-atomic="true">
            {state.errors?.company &&
              state.errors.company.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* RFC */}
        <div className="mb-4">
          <label htmlFor="rfc" className="mb-2 block text-sm font-medium">
            RFC
          </label>
          <input
            id="rfc"
            name="rfc"
            type="text"
            defaultValue={customer.rfc}
            placeholder="Enter RFC"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="rfc-error" aria-live="polite" aria-atomic="true">
            {state.errors?.rfc &&
              state.errors.rfc.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={customer.phone?.toString()}
            placeholder="Enter phone number"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          <div id="phone-error" aria-live="polite" aria-atomic="true">
            {state.errors?.phone &&
              state.errors.phone.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
}
