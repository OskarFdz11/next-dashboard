// app/lib/pdf/simple-template.ts
export function generateSimpleQuotationHTML(quotationData: any) {
  const { quotation, customer, products } = quotationData;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización ${quotation.id}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .company {
            font-size: 18px;
            font-weight: bold;
        }
        .quotation-number {
            font-size: 16px;
            margin: 10px 0;
        }
        .customer-info {
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .products-table th,
        .products-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .products-table th {
            background-color: #f2f2f2;
        }
        .totals {
            margin-top: 20px;
            text-align: right;
        }
        .total {
            font-size: 16px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company">MrToldo.com</div>
        <div class="quotation-number">Cotización C-${quotation.id}</div>
        <div>Fecha: ${new Date(quotation.date).toLocaleDateString(
          "es-MX"
        )}</div>
    </div>

    <div class="customer-info">
        <h3>Cliente:</h3>
        <p><strong>${customer.name} ${customer.lastname}</strong></p>
        <p>${customer.email}</p>
        <p>${customer.company}</p>
    </div>

    <table class="products-table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${products
              .map(
                (item: any) => `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>$${Number(item.price).toFixed(2)}</td>
                <td>$${(item.quantity * Number(item.price)).toFixed(2)}</td>
            </tr>
            `
              )
              .join("")}
        </tbody>
    </table>

    <div class="totals">
        <p>Subtotal: $${Number(quotation.subtotal).toFixed(2)}</p>
        ${
          quotation.iva
            ? `<p>IVA: $${(
                Number(quotation.total) - Number(quotation.subtotal)
              ).toFixed(2)}</p>`
            : ""
        }
        <p class="total">Total: $${Number(quotation.total).toFixed(2)}</p>
    </div>
</body>
</html>
  `;
}
