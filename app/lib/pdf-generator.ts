// app/lib/pdf/simple-pdf-generator.ts
import jsPDF from "jspdf";

interface QuotationData {
  quotation: {
    id: number;
    date: string;
    subtotal: number;
    total: number;
    iva: boolean;
  };
  customer: {
    name: string;
    lastname: string;
    email: string;
    company: string;
    rfc: string;
    phone: string;
  };
  products: Array<{
    name: string;
    brand: string;
    price: number;
    quantity: number;
  }>;
}

export function generateSimplePDF(data: QuotationData): Uint8Array {
  const doc = new jsPDF();

  // Configuración inicial
  let yPos = 30;
  const lineHeight = 8;
  const pageWidth = doc.internal.pageSize.width;

  // Función helper para agregar texto
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize = 12,
    style: "normal" | "bold" = "normal"
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", style);
    doc.text(text, x, y);
  };

  // Función helper para agregar línea
  const addLine = () => {
    yPos += lineHeight;
    if (yPos > 270) {
      // Nueva página si es necesario
      doc.addPage();
      yPos = 30;
    }
  };

  // ENCABEZADO
  addText("MrToldo", 20, yPos, 24, "bold");
  yPos += 15;

  addText(`COTIZACIÓN #${data.quotation.id}`, 20, yPos, 18, "bold");
  addLine();
  addLine();

  // INFORMACIÓN DEL CLIENTE
  addText("INFORMACIÓN DEL CLIENTE", 20, yPos, 14, "bold");
  addLine();

  addText(`Nombre: ${data.customer.name} ${data.customer.lastname}`, 20, yPos);
  addLine();

  addText(`Empresa: ${data.customer.company}`, 20, yPos);
  addLine();

  addText(`Email: ${data.customer.email}`, 20, yPos);
  addLine();

  addText(`RFC: ${data.customer.rfc}`, 20, yPos);
  addLine();

  addText(`Teléfono: ${data.customer.phone}`, 20, yPos);
  addLine();
  addLine();

  // FECHA
  const formattedDate = new Date(data.quotation.date).toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  addText(`Fecha: ${formattedDate}`, 20, yPos);
  addLine();
  addLine();

  // PRODUCTOS
  addText("PRODUCTOS Y SERVICIOS", 20, yPos, 14, "bold");
  addLine();

  // Encabezados de tabla
  addText("Descripción", 20, yPos, 10, "bold");
  addText("Cant.", 120, yPos, 10, "bold");
  addText("Precio Unit.", 140, yPos, 10, "bold");
  addText("Total", 170, yPos, 10, "bold");
  addLine();

  // Línea separadora
  doc.line(20, yPos - 2, 190, yPos - 2);
  addLine();

  // Productos
  data.products.forEach((product, index) => {
    const productTotal = product.price * product.quantity;

    addText(`${index + 1}. ${product.name}`, 20, yPos, 9);
    addText(`${product.quantity}`, 120, yPos, 9);
    addText(
      `$${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      140,
      yPos,
      9
    );
    addText(
      `$${productTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      170,
      yPos,
      9
    );
    addLine();

    if (product.brand) {
      addText(`   Marca: ${product.brand}`, 20, yPos, 8);
      addLine();
    }
    addLine();
  });

  // Línea separadora
  doc.line(120, yPos - 2, 190, yPos - 2);
  addLine();

  // TOTALES
  addText("Subtotal:", 140, yPos, 12, "bold");
  addText(
    `$${data.quotation.subtotal.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    170,
    yPos,
    12
  );
  addLine();

  if (data.quotation.iva) {
    const ivaAmount = data.quotation.total - data.quotation.subtotal;
    addText("IVA (16%):", 140, yPos, 12, "bold");
    addText(
      `$${ivaAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      170,
      yPos,
      12
    );
    addLine();
  }

  addText("TOTAL:", 140, yPos, 14, "bold");
  addText(
    `$${data.quotation.total.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    170,
    yPos,
    14,
    "bold"
  );

  // PIE DE PÁGINA
  yPos = 280;
  addText("¡Gracias por su preferencia!", 20, yPos, 10);
  addText("MrToldo - Soluciones en Toldos", 20, yPos + 5, 8);

  return new Uint8Array(doc.output("arraybuffer"));
}
