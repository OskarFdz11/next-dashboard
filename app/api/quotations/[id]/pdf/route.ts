// app/api/quotations/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateQuotationPDF } from "@/app/lib/pdf/generate-quotation";
import { getQuotationDataForPDF } from "@/app/lib/quotations-actions/quotations-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotationId = parseInt(params.id);

    if (isNaN(quotationId)) {
      return NextResponse.json(
        { error: "Invalid quotation ID" },
        { status: 400 }
      );
    }

    // Obtener datos de la cotización
    const quotationData = await getQuotationDataForPDF(quotationId);

    // Generar PDF
    const pdfBuffer = await generateQuotationPDF(quotationData);

    // Convert Buffer to Uint8Array for NextResponse
    const pdfBytes = new Uint8Array(pdfBuffer);

    // Retornar PDF
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cotizacion-${quotationId}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
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
