// app/api/quotations/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateSimplePDF } from "@/app/lib/pdf-generator";
import { getQuotationDataForPDF } from "@/app/lib/quotations-actions/quotations-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotationId = parseInt(params.id);

    if (isNaN(quotationId)) {
      return NextResponse.json(
        { error: "ID de cotización inválido" },
        { status: 400 }
      );
    }

    console.log("Generando PDF para cotización:", quotationId);

    const quotationData = await getQuotationDataForPDF(quotationId);

    if (!quotationData) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    console.log("Datos obtenidos, generando PDF...");

    // Convert Decimal values to numbers and format the data properly
    const pdfBuffer = generateSimplePDF({
      ...quotationData,
      quotation: {
        ...quotationData.quotation,
        date:
          quotationData.quotation.date instanceof Date
            ? quotationData.quotation.date.toISOString()
            : quotationData.quotation.date,
        subtotal: Number(quotationData.quotation.subtotal), // Convert Decimal to number
        total: Number(quotationData.quotation.total), // Convert Decimal to number
      },
      // Also convert product prices if they're Decimal
      products: quotationData.products.map((product) => ({
        ...product,
        price: Number(product.price),
        name: product.product.name,
        brand: product.product.brand,
        quantity: Number(product.quantity), // Convert Decimal to number
      })),
      // Convert customer phone if it's BigInt
      customer: {
        ...quotationData.customer,
        phone: quotationData.customer.phone.toString(), // Convert BigInt to string
      },
      // (Removed billingDetails property because it's not part of QuotationData type)
    });

    console.log("PDF generado exitosamente");

    // Retornar PDF
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cotizacion-${quotationId}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
