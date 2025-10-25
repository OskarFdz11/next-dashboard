// app/lib/pdf/quotation-template.ts
import { readFileSync } from "fs";
import { join } from "path";

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

// Ajusta el tipo de datos para que coincida con lo que recibes
interface QuotationProduct {
  product: {
    id: number;
    name: string;
    brand: string;
    description: string;
    image_url: string;
  };
  quantity: number;
  price: number;
}

interface QuotationTemplateData {
  quotation: {
    id: number;
    date: string;
    subtotal: number;
    total: number;
    iva: boolean;
    notes?: string;
  };
  customer: {
    name: string;
    lastname: string;
    email: string;
    company: string;
    rfc: string;
    phone: string;
  };
  billingDetails?: {
    clabe?: string;
    checkAccount?: string;
  };
  products: QuotationProduct[];
  company?: {
    name: string;
    fullName: string;
    rfc: string;
    phone: string;
    logo: string;
    email: string;
    address: string;
  };
}

export function generateQuotationHTML(quotationData: QuotationTemplateData) {
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
    /* ... tu CSS existente ... */
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

    /* ... resto de tu CSS ... */
    /* (mantengo todo tu CSS existente) */
    
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

    /* ... resto de tu CSS completo ... */
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
            RFC: ${customer.rfc}
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
            (item: QuotationProduct) => `
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
          <td class="text-right">${formatCurrency(item.price)}</td>
          <td class="text-center">-</td>
          <td class="text-right">${formatCurrency(
            item.price * item.quantity
          )}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <!-- Totals Section -->
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
          <td class="totals-label">IVA:</td>
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
          ${billingDetails?.clabe ? `Clabe: ${billingDetails.clabe}<br>` : ""}
          ${
            billingDetails?.checkAccount
              ? `Cuenta Cheques: ${billingDetails.checkAccount}<br>`
              : ""
          }
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
    (item: QuotationProduct) => `
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
      <div class="product-panel-price">${formatCurrency(item.price)} MXN</div>
      
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
            <span class="spec-value">${formatCurrency(item.price)}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Total:</span>
            <span class="spec-value">${formatCurrency(
              item.price * item.quantity
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
