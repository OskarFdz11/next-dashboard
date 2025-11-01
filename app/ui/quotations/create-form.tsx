"use client";

import {
  useActionState,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  CustomerField,
  ProductField,
  BillingDetailsField,
} from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import SuccessModal from "@/app/ui/success-modal";
import {
  createQuotation,
  State,
} from "@/app/lib/quotations-actions/quotations-actions";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { applyPersistedToFormData } from "@/app/lib/utils";

type QuotationProduct = {
  productId: string;
  quantity: number;
  price: number;
};

export default function CreateQuotationForm({
  customers,
  products,
  billingDetails,
}: {
  customers: CustomerField[];
  products: ProductField[];
  billingDetails: BillingDetailsField[];
}) {
  const router = useRouter();
  const initialState: State = { message: "", errors: {}, success: false };
  const [state, formAction] = useActionState<State, FormData>(
    createQuotation,
    initialState
  );

  const [selectedProducts, setSelectedProducts] = useState<QuotationProduct[]>([
    { productId: "", quantity: 1, price: 0 },
  ]);
  const [iva, setIva] = useState(false);

  const {
    data: persisted,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    customerId: string;
    billingDetailsId: string;
    notes: string;
    status: string;
    iva: boolean;
    productsJSON: string; // guardamos arreglo como JSON
  }>("create-quotation-form", {
    customerId: "",
    billingDetailsId: "",
    iva: false,
    notes: "",
    status: "pending",
    productsJSON: "[]",
  });

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const parsed = JSON.parse(persisted.productsJSON || "[]");
      if (Array.isArray(parsed) && parsed.length) setSelectedProducts(parsed);
      setIva(!!persisted.iva);
    } catch {}
  }, [isLoaded, persisted.productsJSON, persisted.iva]);

  const clearCompleteForm = useCallback(() => {
    clearData();
    setSelectedProducts([{ productId: "", quantity: 1, price: 0 }]);
    setIva(false);
  }, [clearData]);

  useEffect(() => {
    updateData({ productsJSON: JSON.stringify(selectedProducts) });
  }, [selectedProducts, updateData]);
  useEffect(() => {
    updateData({ iva });
  }, [iva, updateData]);

  useEffect(() => {
    if (state.success) {
      // Ideal: que la acción devuelva quotationId
      const label = state.quotationId ? `#${state.quotationId}` : "";
      clearCompleteForm();
      router.replace(
        `/dashboard/quotations?created=${encodeURIComponent(label)}`
      );
    }
  }, [state.success, state.quotationId, router, clearCompleteForm]);

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: 1, price: 0 },
    ]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (
    index: number,
    field: keyof QuotationProduct,
    value: string | number
  ) => {
    const updated = [...selectedProducts];
    if (field === "productId") {
      updated[index][field] = value as string;
      // Auto-fill price when product is selected
      const selectedProduct = products.find((p) => p.id.toString() === value);
      if (selectedProduct) {
        updated[index].price = selectedProduct.price;
      }
    } else {
      updated[index][field] = Number(value);
    }
    setSelectedProducts(updated);
  };

  const updateQuantity = (index: number, increment: boolean) => {
    const updated = [...selectedProducts];
    const newQuantity = increment
      ? updated[index].quantity + 1
      : Math.max(1, updated[index].quantity - 1);
    updated[index].quantity = newQuantity;
    setSelectedProducts(updated);
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return iva ? subtotal * 1.16 : subtotal;
  };

  const handleSubmit = async (fd: FormData) => {
    // aseguramos que los datos actuales están en persisted
    updateData({
      productsJSON: JSON.stringify(selectedProducts),
      iva,
      notes: persisted.notes,
      status: persisted.status,
    });
    // volcamos todo lo persistido al FormData
    applyPersistedToFormData(fd, persisted);
    await formAction(fd);
  };

  if (!isLoaded) return null;

  return (
    <>
      <form action={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Customer Selection */}
          <div className="mb-4">
            <label
              htmlFor="customer"
              className="mb-2 block text-sm font-medium"
            >
              Choose customer
            </label>
            <div className="relative">
              <select
                id="customer"
                name="customerId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={persisted.customerId}
                onChange={(e) => updateData({ customerId: e.target.value })}
                aria-describedby="customer-error"
              >
                <option value="" disabled>
                  Select a customer
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.lastname} - {customer.email} -{" "}
                    {customer.company}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.customerId &&
                state.errors.customerId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Billing Details Selection */}
          <div className="mb-4">
            <label
              htmlFor="billingDetails"
              className="mb-2 block text-sm font-medium"
            >
              Choose billing details
            </label>
            <div className="relative">
              <select
                id="billingDetails"
                name="billingDetailsId"
                value={persisted.billingDetailsId}
                onChange={(e) =>
                  updateData({ billingDetailsId: e.target.value })
                }
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              >
                <option value="" disabled>
                  Select billing details
                </option>
                {billingDetails.map((billing) => (
                  <option key={billing.id} value={billing.id}>
                    {billing.company} - {billing.name} {billing.lastname} - RFC:{" "}
                    {billing.rfc}
                  </option>
                ))}
              </select>
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div
              id="billingDetails-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.billingDetailsId &&
                state.errors.billingDetailsId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Products Selection */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Products</label>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
              >
                <PlusIcon className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {selectedProducts.map((selectedProduct, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 mb-2 p-3 border rounded-md bg-white"
              >
                <div className="col-span-5">
                  <select
                    name={`products[${index}][productId]`}
                    value={selectedProduct.productId}
                    onChange={(e) =>
                      updateProduct(index, "productId", e.target.value)
                    }
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.brand} - ${product.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      type="number"
                      name={`products[${index}][quantity]`}
                      value={selectedProduct.quantity}
                      onChange={(e) =>
                        updateProduct(index, "quantity", e.target.value)
                      }
                      min="1"
                      placeholder="Qty"
                      className="block w-full rounded-md border border-gray-200 py-2 px-3 pr-8 text-sm outline-2"
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, true)}
                        className="text-gray-400 hover:text-gray-600 h-3 w-3"
                      >
                        <ChevronUpIcon className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, false)}
                        className="text-gray-400 hover:text-gray-600 h-3 w-3"
                      >
                        <ChevronDownIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    name={`products[${index}][price]`}
                    value={selectedProduct.price}
                    onChange={(e) =>
                      updateProduct(index, "price", e.target.value)
                    }
                    step="0.01"
                    placeholder="Price"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    $
                    {(selectedProduct.price * selectedProduct.quantity).toFixed(
                      2
                    )}
                  </span>
                  {selectedProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div id="products-error" aria-live="polite" aria-atomic="true">
              {state.errors?.products &&
                state.errors.products.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* IVA Toggle */}
          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="iva"
                name="iva"
                type="checkbox"
                checked={iva}
                onChange={(e) => setIva(e.target.checked)}
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
              />
              <label
                htmlFor="iva"
                className="ml-2 cursor-pointer text-sm font-medium"
              >
                Es más IVA? (16%)
              </label>
            </div>
          </div>

          {/* Totals Display */}
          <div className="mb-4 bg-white p-4 rounded-md border">
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">
                ${calculateSubtotal().toFixed(2)}
              </span>
            </div>
            {iva && (
              <div className="flex justify-between text-sm mb-2">
                <span>IVA (16%):</span>
                <span className="font-medium">
                  ${(calculateSubtotal() * 0.16).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              onChange={(e) => updateData({ notes: e.target.value })}
              id="notes"
              name="notes"
              rows={3}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Additional notes..."
            />
          </div>

          {/* Status Selection */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Set the quotation status
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="pending"
                    name="status"
                    type="radio"
                    value="pending"
                    defaultChecked
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="pending"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Pendiente <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="paid"
                    name="status"
                    type="radio"
                    value="paid"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="paid"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Pagado
                    <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/quotations"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Quotation</Button>
        </div>
      </form>
    </>
  );
}
