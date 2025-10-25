// app/lib/pdf-generator.ts
import { jsPDF } from "jspdf";

export async function generateQuotationPDF(quotation: any): Promise<Buffer> {
  try {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text(`Cotización #${quotation.id}`, 20, 30);

    // Información del cliente
    doc.setFontSize(14);
    doc.text("Cliente:", 20, 50);
    doc.setFontSize(12);
    doc.text(
      `${quotation.customer.name} ${quotation.customer.lastname}`,
      20,
      60
    );
    doc.text(`${quotation.customer.email}`, 20, 70);
    doc.text(`${quotation.customer.company}`, 20, 80);

    // Fecha
    doc.text(
      `Fecha: ${new Date(quotation.date).toLocaleDateString()}`,
      20,
      100
    );

    // Productos
    doc.setFontSize(14);
    doc.text("Productos:", 20, 120);

    let yPosition = 130;
    quotation.quotationProducts.forEach((item: any, index: number) => {
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${item.product.name}`, 25, yPosition);
      doc.text(`Cantidad: ${item.quantity}`, 25, yPosition + 10);
      doc.text(`Precio: $${item.price}`, 25, yPosition + 20);
      doc.text(`Subtotal: $${item.quantity * item.price}`, 25, yPosition + 30);
      yPosition += 50;
    });

    // Total
    doc.setFontSize(14);
    doc.text(`Subtotal: $${quotation.subtotal}`, 20, yPosition + 20);
    if (quotation.iva) {
      doc.text(
        `IVA (16%): $${(quotation.total - quotation.subtotal).toFixed(2)}`,
        20,
        yPosition + 35
      );
    }
    doc.text(`Total: $${quotation.total}`, 20, yPosition + 50);

    // Convertir a buffer
    const pdfArrayBuffer = doc.output("arraybuffer");
    return Buffer.from(pdfArrayBuffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
