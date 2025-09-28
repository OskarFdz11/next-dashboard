import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  // 1. Crear categorías
  const electronics = await prisma.category.create({
    data: { name: "Electronics", description: "Electronic devices" },
  });
  const furniture = await prisma.category.create({
    data: { name: "Furniture", description: "Home and office furniture" },
  });

  // 2. Crear productos
  const laptop = await prisma.product.create({
    data: {
      name: "Laptop",
      categoryId: electronics.id,
      image_url: "/products/laptop.png",
      description: "A powerful laptop.",
      quantity: 10,
      price: 1200.5,
      brand: "TechBrand",
    },
  });
  const chair = await prisma.product.create({
    data: {
      name: "Office Chair",
      categoryId: furniture.id,
      image_url: "/products/chair.png",
      description: "Ergonomic office chair.",
      quantity: 25,
      price: 150.0,
      brand: "ChairCo",
    },
  });

  // 3. Crear clientes
  const customer = await prisma.customer.create({
    data: {
      name: "John",
      lastname: "Doe",
      email: "john.doe@email.com",
      company: "Doe Inc.",
      rfc: "DOE123456789",
      phone: 5551234567,
    },
  });

  // 4. Crear dirección
  const address = await prisma.address.create({
    data: {
      street: "Main St",
      outsideNumber: "123",
      colony: "Downtown",
      city: "Metropolis",
      cp: "12345",
    },
  });

  // 5. Crear datos de facturación
  const billing = await prisma.billingDetails.create({
    data: {
      company: "Doe Inc.",
      name: "John",
      lastname: "Doe",
      rfc: "DOE123456789",
      clabe: "123456789012345678",
      checkAccount: "9876543210",
      addressId: address.id,
      phone: 5551234567,
      email: "billing@doeinc.com",
    },
  });

  // 6. Crear cotización
  const quotation = await prisma.quotation.create({
    data: {
      date: new Date(),
      customerId: customer.id,
      billingDetailsId: billing.id,
      iva: true,
      subtotal: 1350.5,
      total: 1567.58,
      notes: "Urgent delivery",
      status: "pending",
    },
  });

  // 7. Relacionar productos con la cotización
  await prisma.quotationProduct.createMany({
    data: [
      {
        quotationId: quotation.id,
        productId: laptop.id,
        quantity: 1,
        price: 1200.5,
      },
      {
        quotationId: quotation.id,
        productId: chair.id,
        quantity: 1,
        price: 150.0,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed completed.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
