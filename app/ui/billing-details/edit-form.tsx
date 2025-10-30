"use client";

import {
  BillingDetailsFormState,
  updateBillingDetails,
} from "@/app/lib/billing-details-actions/billing-details-actions";
import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useRouter } from "next/navigation";

export type BillingDetailsEditFormProps = {
  billingDetails: {
    id: number;
    name: string;
    lastname: string;
    company: string;
    rfc: string;
    clabe: string;
    checkAccount: string;
    phone: string | null;
    email: string;
    address: {
      id: number;
      street: string;
      outsideNumber: string;
      colony: string;
      city: string;
      cp: string;
    } | null;
  };
};

export default function EditBillingDetailsForm({
  billingDetails,
}: BillingDetailsEditFormProps) {
  const router = useRouter();
  const initialState: BillingDetailsFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const updateBillingDetailsWithId = updateBillingDetails.bind(
    null,
    billingDetails.id
  );
  const [state, formAction] = useActionState(
    updateBillingDetailsWithId,
    initialState
  );

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      const currentName = nameRef.current?.value || billingDetails.name || "";

      router.replace(
        `/dashboard/billing-details?updated=${encodeURIComponent(currentName)}`
      );
    }
  }, [state.success, router, billingDetails.name]);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={billingDetails.name}
              placeholder="Enter name"
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

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastname"
              className="mb-2 block text-sm font-medium"
            >
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              defaultValue={billingDetails.lastname}
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
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-2 block text-sm font-medium">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue={billingDetails.company}
              placeholder="Enter company name"
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
          <div>
            <label htmlFor="rfc" className="mb-2 block text-sm font-medium">
              RFC
            </label>
            <input
              id="rfc"
              name="rfc"
              type="text"
              defaultValue={billingDetails.rfc}
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
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={billingDetails.email}
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={billingDetails.phone || ""}
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

        {/* Banking Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* CardNumber */}
          <div>
            <label
              htmlFor="cardNumber"
              className="mb-2 block text-sm font-medium"
            >
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="Enter Card Number"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="cardNumber-error" aria-live="polite" aria-atomic="true">
              {state.errors?.cardNumber &&
                state.errors.cardNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* CLABE */}
          <div>
            <label htmlFor="clabe" className="mb-2 block text-sm font-medium">
              CLABE
            </label>
            <input
              id="clabe"
              name="clabe"
              type="text"
              defaultValue={billingDetails.clabe}
              placeholder="Enter CLABE"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="clabe-error" aria-live="polite" aria-atomic="true">
              {state.errors?.clabe &&
                state.errors.clabe.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Check Account */}
          <div>
            <label
              htmlFor="checkAccount"
              className="mb-2 block text-sm font-medium"
            >
              Check Account
            </label>
            <input
              id="checkAccount"
              name="checkAccount"
              type="text"
              defaultValue={billingDetails.checkAccount}
              placeholder="Enter check account"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="checkAccount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.checkAccount &&
                state.errors.checkAccount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Address Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Street */}
            <div>
              <label
                htmlFor="street"
                className="mb-2 block text-sm font-medium"
              >
                Street
              </label>
              <input
                id="street"
                name="street"
                type="text"
                defaultValue={billingDetails.address?.street || ""}
                placeholder="Enter street"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <div id="street-error" aria-live="polite" aria-atomic="true">
                {state.errors?.street &&
                  state.errors.street.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Outside Number */}
            <div>
              <label
                htmlFor="outsideNumber"
                className="mb-2 block text-sm font-medium"
              >
                Outside Number
              </label>
              <input
                id="outsideNumber"
                name="outsideNumber"
                type="text"
                defaultValue={billingDetails.address?.outsideNumber || ""}
                placeholder="Enter outside number"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <div
                id="outsideNumber-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.outsideNumber &&
                  state.errors.outsideNumber.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Colony */}
            <div>
              <label
                htmlFor="colony"
                className="mb-2 block text-sm font-medium"
              >
                Colony
              </label>
              <input
                id="colony"
                name="colony"
                type="text"
                defaultValue={billingDetails.address?.colony || ""}
                placeholder="Enter colony"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <div id="colony-error" aria-live="polite" aria-atomic="true">
                {state.errors?.colony &&
                  state.errors.colony.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={billingDetails.address?.city || ""}
                placeholder="Enter city"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <div id="city-error" aria-live="polite" aria-atomic="true">
                {state.errors?.city &&
                  state.errors.city.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="cp" className="mb-2 block text-sm font-medium">
                Postal Code
              </label>
              <input
                id="cp"
                name="cp"
                type="text"
                defaultValue={billingDetails.address?.cp || ""}
                placeholder="Enter postal code"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <div id="cp-error" aria-live="polite" aria-atomic="true">
                {state.errors?.cp &&
                  state.errors.cp.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/billing-details"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Billing Details</Button>
      </div>
    </form>
  );
}
