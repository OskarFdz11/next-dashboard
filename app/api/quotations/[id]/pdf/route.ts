// app/api/quotations/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateQuotationPDF } from "@/app/lib/pdf/generate-quotation";
import {
  fetchQuotationById,
  getQuotationDataForPDF,
} from "@/app/lib/quotations-actions/quotations-data";

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

    const quotation = await fetchQuotationById(quotationId);

    if (!quotation) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    const quotationData = await getQuotationDataForPDF(quotationId);

    if (!quotationData) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    // Generar PDF
    const pdfBuffer = await generateQuotationPDF(quotationData);

    // Retornar PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
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
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
