"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createBillingDetails,
  BillingDetailsFormState,
} from "@/app/lib/billing-details-actions/billing-details-actions";
import { BillingDetailsField } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { applyPersistedToFormData } from "@/app/lib/utils";

export default function CreateBillingDetailsForm({
  billingDetails,
}: {
  billingDetails: BillingDetailsField[];
}) {
  const router = useRouter();
  const initialState: BillingDetailsFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const [state, formAction] = useActionState(
    createBillingDetails,
    initialState
  );

  const {
    data: formData,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    name: string;
    lastname: string;
    email: string;
    company: string;
    rfc: string;
    phone: string;
    cardNumber: string;
    clabe: string;
    checkAccount: string;
    street: string;
    outsideNumber: string;
    colony: string;
    city: string;
    cp: string;
  }>("create-customer-form", {
    name: "",
    lastname: "",
    email: "",
    company: "",
    rfc: "",
    phone: "",
    cardNumber: "",
    clabe: "",
    checkAccount: "",
    street: "",
    outsideNumber: "",
    colony: "",
    city: "",
    cp: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const clearCompleteForm = useCallback(() => {
    clearData();
  }, [clearData]);

  useEffect(() => {
    if (state.success) {
      const currentName =
        nameRef.current?.value || billingDetails[0]?.name || "";
      clearCompleteForm();
      router.replace(
        `/dashboard/billing-details?created=${encodeURIComponent(currentName)}`
      );
    }
  }, [state.success, router, billingDetails[0]?.name]);

  const handleSubmit = async (fd: FormData) => {
    applyPersistedToFormData(fd, formData);
    await formAction(fd);
  };

  if (!isLoaded) return null;

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateData({ name: e.target.value })}
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
              ref={lastNameRef}
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={(e) => updateData({ lastname: e.target.value })}
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
              value={formData.company}
              onChange={(e) => updateData({ company: e.target.value })}
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
              value={formData.rfc}
              onChange={(e) => updateData({ rfc: e.target.value })}
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
              value={formData.email}
              onChange={(e) => updateData({ email: e.target.value })}
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
              value={formData.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
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
              value={formData.cardNumber}
              onChange={(e) => updateData({ cardNumber: e.target.value })}
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
              value={formData.clabe}
              onChange={(e) => updateData({ clabe: e.target.value })}
              type="text"
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
              value={formData.checkAccount}
              onChange={(e) => updateData({ checkAccount: e.target.value })}
              type="text"
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
                value={formData.street}
                onChange={(e) => updateData({ street: e.target.value })}
                name="street"
                type="text"
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
                value={formData.outsideNumber}
                onChange={(e) => updateData({ outsideNumber: e.target.value })}
                name="outsideNumber"
                type="text"
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
                value={formData.colony}
                onChange={(e) => updateData({ colony: e.target.value })}
                type="text"
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
                value={formData.city}
                onChange={(e) => updateData({ city: e.target.value })}
                type="text"
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
                value={formData.cp}
                onChange={(e) => updateData({ cp: e.target.value })}
                type="text"
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
        <Button type="submit">Create Billing Details</Button>
      </div>
    </form>
  );
}
