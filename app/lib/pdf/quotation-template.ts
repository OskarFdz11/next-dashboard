import { readFileSync } from "fs";
import { join } from "path";
import { QuotationProductField } from "../definitions";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function getLogoBase64(): string {
  try {
    const logoPath = join(process.cwd(), "public", "mrtoldo-logo.jpg");
    const logoBuffer = readFileSync(logoPath);
    return `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error loading logo:", error);
    return ""; // Fallback to empty string
  }
}
export function generateQuotationHTML(quotationData: any) {
  const {
    quotation,
    customer,
    billingDetails,
    products,
    company = {
      name: "mrtoldo.com",
      fullName: "MRTOLDO S.A. DE C.V.",
      rfc: "MRT180518HK0",
      phone: "81 8335-1041 y 81 1221-7917",
      logo: getLogoBase64(),
      email: "carlos@mrtoldo.com",
      address: "Calle Sembradores 248, Col. Leones, Monterrey, NL, CP 64600",
    },
  } = quotationData;

  const formattedDate = new Date(quotation.date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cotización ${quotation.id}</title>
  <style>
    @page {
      size: A4;
      margin: 8mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #333;
      background: white;
    }

    .page {
      width: 100%;
      min-height: 100vh;
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
      text-align: right;
    }

    /* ========== HEADER SECTION ========== */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
    }

    .company-header {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .company-logo {
      width: 90px;
      height: 90px;
      background: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      
    }
    .company-logo img {
     width: 100%;
  height: 100%;
  object-fit: contain;
  background: none;
  box-shadow: none;
  border: none;
}


    .company-details h1 {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 3px;
    }

    .company-details .subtitle {
      font-size: 11px;
      color: #333;
      margin-bottom: 2px;
    }

    .company-details .contact-info {
      font-size: 9px;
      color: #666;
      line-height: 1.3;
    }

    .company-contact {
      text-align: right;
      font-size: 10px;
      line-height: 1.4;
      color: #333;
    }

    .company-contact .company-name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 3px;
      color: #333;
    }

    .company-contact .address {
      margin-bottom: 2px;
      font-size: 9px;
    }

    .company-contact .website {
      font-weight: bold;
      color: #4a90e2;
      margin-top: 3px;
    }

    /* ========== CLIENT SECTION ========== */
    .client-section {
      margin-bottom: 20px;
      border: 2px solid #333;
    }

    .client-header {
      background: #333;
      color: white;
      padding: 8px 12px;
      font-weight: bold;
      font-size: 12px;
    }

    .client-content {
      padding: 12px 15px;
    }

    .client-info {
      display: flex;
      gap: 25px;
    }

    .client-main {
      font-size: 11px;
      line-height: 1.5;
    }

    .client-name {
      font-weight: bold;
      font-size: 13px;
      margin-bottom: 4px;
      color: #333;
    }

    .client-details {
      font-size: 10px;
      color: #333;
      line-height: 1.4;
    }

    /* ========== PRODUCTS TABLE ========== */
    .products-section {
      margin-bottom: 20px;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #333;
      font-size: 10px;
    }

    .products-table thead {
      background: #e8e8e8;
      border-bottom: 2px solid #333;
    }

    .products-table th {
      padding: 8px 6px;
      text-align: center;
      font-weight: bold;
      border-right: 1px solid #333;
      font-size: 10px;
    }

    .products-table th:last-child {
      border-right: none;
    }

    .products-table td {
      padding: 6px;
      border-right: 1px solid #333;
      border-bottom: 1px solid #333;
      vertical-align: top;
      text-align: center;
    }

    .products-table td:last-child {
      border-right: none;
    }

    .products-table tbody tr:last-child td {
      border-bottom: none;
    }

    .product-name {
      font-weight: bold;
      text-align: left;
      margin-bottom: 2px;
      font-size: 10px;
    }

    .product-description {
      text-align: left;
      color: #444;
      font-size: 9px;
      line-height: 1.3;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }

    /* ========== FOOTER SECTION ========== */
    .footer-section {
      display: block; 
  margin-top: 25px;
    }

    .footer-left {
      width: 100%; 
  max-width: none;
    }

    .footer-notes {
      font-size: 10px;
      line-height: 1.4;
      margin-bottom: 15px;
      font-weight: bold;
    }

    .payment-info {
      background: #f5f5f5;
      padding: 12px;
      border: 1px solid #ccc;
      margin-bottom: 12px;
    }

    .payment-info h4 {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 6px;
    }

    .payment-details {
      font-size: 10px;
      line-height: 1.4;
    }

    .notes-box {
      font-size: 10px;
      margin-top: 12px;
      padding: 10px;
      background: #f9f9f9;
      border-left: 3px solid #ccc;
    }

    /* ========== TOTALS SECTION ========== */
    .totals-section {
      width: 220px;
      border: 2px solid #333;
      align-self: flex-start;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }

    .totals-table tr {
      border-bottom: 1px solid #333;
    }

    .totals-table tr:last-child {
      border-bottom: none;
    }

    .totals-table td {
      padding: 6px 10px;
      text-align: right;
    }

    .totals-label {
      font-weight: bold;
      text-align: left;
      background: #f0f0f0;
    }

    .totals-value {
      font-weight: bold;
    }

    .total-final .totals-label,
    .total-final .totals-value {
      background: #333;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    /* ========== PRODUCT DETAIL PAGES ========== */
    .product-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 15mm;
      page-break-after: always;
      page-break-inside: avoid;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
      page-break-after: avoid;
      page-break-inside: avoid;
    }

    .product-header-left h2 {
      font-size: 20px;
      color: #333;
      margin-bottom: 5px;
      page-break-after: avoid;
    }

    .product-quote-ref {
      font-size: 11px;
      color: #666;
    }

    .product-header-right {
      text-align: right;
      font-size: 10px;
      color: #333;
    }

    .product-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      justify-content: center;
      page-break-inside: avoid;
    }

    .product-image-container {
      width: 100%;
      max-width: 500px;
      height: 350px;
      background: #f8f9fa;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      margin-bottom: 30px;
      position: relative;
    }

    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }

    .no-image {
      color: #999;
      font-size: 16px;
      text-align: center;
    }

    .product-info-panel {
      background: white;
      border: 2px solid #333;
      border-radius: 0;
      padding: 25px;
      max-width: 500px;
      width: 100%;
    }

    .product-panel-title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 8px;
    }

    .product-panel-brand {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-panel-description {
      font-size: 12px;
      color: #333;
      line-height: 1.5;
      margin-bottom: 18px;
      text-align: justify;
      padding: 10px;
      background: #f9f9f9;
      border-left: 3px solid #ccc;
    }

    .product-panel-price {
      background: #333;
      color: white;
      font-size: 20px;
      font-weight: bold;
      padding: 10px 20px;
      text-align: center;
      margin-bottom: 18px;
    }

    .product-specifications {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 15px;
    }

    .specs-title {
      font-size: 12px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
      text-transform: uppercase;
      border-bottom: 1px solid #ccc;
      padding-bottom: 3px;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 10px;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dotted #ccc;
    }

    .spec-label {
      font-weight: bold;
      color: #333;
    }

    .spec-value {
      color: #333;
    }

    /* ========== PRINT OPTIMIZATIONS ========== */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .page {
        page-break-after: always;
        margin: 0;
      }
      
      .product-page {
        page-break-after: always;
        page-break-inside: avoid;
      }

      .product-header {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      .product-content {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

<!-- ========== PÁGINA PRINCIPAL ========== -->
<div class="page">
  <!-- Header -->
  <div class="header-section">
    <div class="company-header">
      <div class="company-logo">
        <img src="${company.logo}" alt="MrToldo Logo" class="company-logo" />
      </div>
    </div>
    
    <div class="company-contact">
      <div class="company-name">${company.fullName}</div>
        <div class="address">${company.rfc}</div>
        <div class="address">${company.phone}</div>
      <div class="address">${company.email}</div>
      <div class="website">${company.name}</div>
    </div>
  </div>

  <!-- Quotation Details -->
  <div class="client-section">
    <div class="client-header">Cotización</div>
    <div class="client-content">
      <div class="client-info">
        <div class="client-main">
          <div class="client-name">Número de Cotización: ${quotation.id}</div>
        </div>
        <div class="client-main" style="margin-left: auto; text-align: right;">
          <div class="client-name">Fecha: ${formattedDate}</div>    
        </div>
      </div>
    </div>
  </div>

  <!-- Client Section -->
  <div class="client-section">
    <div class="client-header">Cliente</div>
    <div class="client-content">
      <div class="client-info">
        <div class="client-main">
          <div class="client-name">${customer.name} ${customer.lastname} (${
    customer.company
  })</div>
          <div class="client-details">
            Mail: ${customer.email}<br>
            Teléfono: ${customer.phone}<br>
          </div>
        </div>
      </div>
    </div>
  </div>

 <!-- Products Table -->
  <div class="products-section">
    <div class="client-header">Productos</div>
    <table class="products-table">
      <thead>
        <tr>
          <th style="width: 8%;">Código</th>
          <th style="width: 40%;">Producto</th>
          <th style="width: 8%;">Cantidad</th>
          <th style="width: 15%;">Precio</th>
          <th style="width: 12%;">Oferta</th>
          <th style="width: 17%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (item: QuotationProductField) => `
        <tr>
          <td>${item.product.id}</td>
          <td>
            <div class="product-name">${item.product.name}</div>
            <div class="product-description">${item.product.description.substring(
              0,
              80
            )}${item.product.description.length > 80 ? "..." : ""}</div>
          </td>
          <td>${item.quantity}</td>
          <td class="text-right">${formatCurrency(Number(item.price))}</td>
          <td class="text-center">-</td>
          <td class="text-right">${formatCurrency(
            Number(item.price) * item.quantity
          )}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <!-- Totals Section - Movido aquí y alineado a la derecha -->
  <div style="display: flex; justify-content: flex-end; margin-top: 15px; margin-bottom: 20px;">
    <div class="totals-section">
      <table class="totals-table">
        <tr>
          <td class="totals-label">Subtotal:</td>
          <td class="totals-value">${formatCurrency(quotation.subtotal)}</td>
        </tr>
        ${
          quotation.iva
            ? `
        <tr>
          <td class="totals-label">Iva:</td>
          <td class="totals-value">${formatCurrency(
            quotation.total - quotation.subtotal
          )}</td>
        </tr>
        `
            : ""
        }
        <tr class="total-final">
          <td class="totals-label">Total:</td>
          <td class="totals-value">${formatCurrency(quotation.total)}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Footer Section -->
  <div class="footer-section">
    <div class="footer-left">

      <!-- Payment Information -->
      <div class="payment-info">
        <h4>Detalles de Pago:</h4>
        <div class="payment-details">
            ${company.fullName}<br>
          RFC: ${company.rfc}<br>
          Clabe: ${billingDetails?.clabe || ""}<br>
          Tarjeta: ${billingDetails?.checkAccount || ""}<br>
          Cuenta Cheques: ${billingDetails?.checkAccount || ""}<br>
          ${company.address}<br>
           Teléfono: ${company.phone}<br>
          ${company.email}
        </div>
      </div>

      ${
        quotation.notes
          ? `
      <div class="notes-box">
        <strong>Notas:</strong><br>
        ${quotation.notes.replace(/\n/g, "<br>")}
      </div>
      `
          : ""
      }
    </div>
  </div>
</div>

<!-- ========== PÁGINAS DE PRODUCTOS ========== -->
${products
  .map(
    (item: QuotationProductField) => `
<div class="product-page">
  <div class="product-header">
    <div class="product-header-left">
      <h2>Especificaciones del Producto</h2>
      <div class="product-quote-ref">Cotización: ${quotation.id}</div>
    </div>
    <div class="product-header-right">
      <div><strong>${company.name}</strong></div>
      <div>${formattedDate}</div>
    </div>
  </div>

  <div class="product-content">
    <div class="product-image-container">
      ${
        item.product.image_url
          ? `<img src="${item.product.image_url}" alt="${item.product.name}" class="product-image" onerror="this.parentNode.innerHTML='<div class=\\'no-image\\'>Imagen no disponible</div>'" />`
          : `<div class="no-image">Imagen no disponible</div>`
      }
    </div>

    <div class="product-info-panel">
      <div class="product-panel-title">${item.product.name}</div>
      <div class="product-panel-brand">${item.product.brand}</div>
      <div class="product-panel-description">${item.product.description}</div>
      <div class="product-panel-price">${formatCurrency(
        Number(item.price)
      )} MXN</div>
      
      <div class="product-specifications">
        <div class="specs-title">Información del Producto</div>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">Código:</span>
            <span class="spec-value">${item.product.id}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Marca:</span>
            <span class="spec-value">${item.product.brand}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Cantidad:</span>
            <span class="spec-value">${item.quantity} unidades</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Precio Unit.:</span>
            <span class="spec-value">${formatCurrency(
              Number(item.price)
            )}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Total:</span>
            <span class="spec-value">${formatCurrency(
              Number(item.price) * item.quantity
            )}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Cotización:</span>
            <span class="spec-value">#${quotation.id}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
  )
  .join("")}

</body>
</html>`;
}
