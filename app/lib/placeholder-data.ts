// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];

// const customers = [
//   {
//     id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
//     name: 'Evil Rabbit',
//     email: 'evil@rabbit.com',
//     image_url: '/customers/evil-rabbit.png',
//   },
//   {
//     id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
//     name: 'Delba de Oliveira',
//     email: 'delba@oliveira.com',
//     image_url: '/customers/delba-de-oliveira.png',
//   },
//   {
//     id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
//     name: 'Lee Robinson',
//     email: 'lee@robinson.com',
//     image_url: '/customers/lee-robinson.png',
//   },
//   {
//     id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
//     name: 'Michael Novotny',
//     email: 'michael@novotny.com',
//     image_url: '/customers/michael-novotny.png',
//   },
//   {
//     id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
//     name: 'Amy Burns',
//     email: 'amy@burns.com',
//     image_url: '/customers/amy-burns.png',
//   },
//   {
//     id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
//     name: 'Balazs Orban',
//     email: 'balazs@orban.com',
//     image_url: '/customers/balazs-orban.png',
//   },
// ];

// const invoices = [
//   {
//     customer_id: c
//     customers[0].id,
//     amount: 15795,
//     status: 'pending',
//     date: '2022-12-06',
//   },
//   {
//     customer_id: customers[1].id,
//     amount: 20348,
//     status: 'pending',
//     date: '2022-11-14',
//   },
//   {
//     customer_id: customers[4].id,
//     amount: 3040,
//     status: 'paid',
//     date: '2022-10-29',
//   },
//   {
//     customer_id: customers[3].id,
//     amount: 44800,
//     status: 'paid',
//     date: '2023-09-10',
//   },
//   {
//     customer_id: customers[5].id,
//     amount: 34577,
//     status: 'pending',
//     date: '2023-08-05',
//   },
//   {
//     customer_id: customers[2].id,
//     amount: 54246,
//     status: 'pending',
//     date: '2023-07-16',
//   },
//   {
//     customer_id: customers[0].id,
//     amount: 666,
//     status: 'pending',
//     date: '2023-06-27',
//   },
//   {
//     customer_id: customers[3].id,
//     amount: 32545,
//     status: 'paid',
//     date: '2023-06-09',
//   },
//   {
//     customer_id: customers[4].id,
//     amount: 1250,
//     status: 'paid',
//     date: '2023-06-17',
//   },
//   {
//     customer_id: customers[5].id,
//     amount: 8546,
//     status: 'paid',
//     date: '2023-06-07',
//   },
//   {
//     customer_id: customers[1].id,
//     amount: 500,
//     status: 'paid',
//     date: '2023-08-19',
//   },
//   {
//     customer_id: customers[5].id,
//     amount: 8945,
//     status: 'paid',
//     date: '2023-06-03',
//   },
//   {
//     customer_id: customers[2].id,
//     amount: 1000,
//     status: 'paid',
//     date: '2022-06-05',
//   },
// ];

const categories = [
  { id: 1, name: "Electronics", description: "Electronic devices" },
  { id: 2, name: "Books", description: "Books and literature" },
  { id: 3, name: "Clothing", description: "Apparel and accessories" },
];

const products = [
  {
    id: 1,
    name: "Smartphone",
    category_id: 1,
    image_url: "/products/smartphone.png",
    description: "Latest model smartphone",
    quantity: 50,
    price: 699.99,
    brand: "Acme",
  },
  {
    id: 2,
    name: "Laptop",
    category_id: 1,
    image_url: "/products/laptop.png",
    description: "High performance laptop",
    quantity: 30,
    price: 1299.99,
    brand: "TechBrand",
  },
  {
    id: 3,
    name: "Novel",
    category_id: 2,
    image_url: "/products/novel.png",
    description: "Bestselling novel",
    quantity: 100,
    price: 19.99,
    brand: "BookHouse",
  },
];

const addresses = [
  {
    id: 1,
    street: "Main St",
    outside_number: "123",
    colony: "Downtown",
    city: "Metropolis",
    cp: "12345",
  },
  {
    id: 2,
    street: "Second Ave",
    outside_number: "456",
    colony: "Uptown",
    city: "Gotham",
    cp: "67890",
  },
];

const customers = [
  {
    id: 1,
    name: "John",
    lastname: "Doe",
    email: "john.doe@email.com",
    company: "Doe Inc.",
    rfc: "DOEJ800101XXX",
    phone: 5551234567,
  },
  {
    id: 2,
    name: "Jane",
    lastname: "Smith",
    email: "jane.smith@email.com",
    company: "Smith LLC",
    rfc: "SMIJ900202YYY",
    phone: 5559876543,
  },
];

const billing_details = [
  {
    id: 1,
    company: "Doe Inc.",
    name: "John",
    lastname: "Doe",
    rfc: "DOEJ800101XXX",
    clabe: "123456789012345678",
    check_account: "0011223344",
    address_id: 1,
    phone: 5551234567,
    email: "billing@doeinc.com",
  },
  {
    id: 2,
    company: "Smith LLC",
    name: "Jane",
    lastname: "Smith",
    rfc: "SMIJ900202YYY",
    clabe: "987654321098765432",
    check_account: "9988776655",
    address_id: 2,
    phone: 5559876543,
    email: "billing@smithllc.com",
  },
];

const quotations = [
  {
    id: 1,
    date: "2024-09-01",
    customer_id: 1,
    billing_details_id: 1,
    iva: true,
    subtotal: 1000.0,
    total: 1160.0,
    notes: "First quotation for John Doe",
    status: true,
  },
  {
    id: 2,
    date: "2024-09-02",
    customer_id: 2,
    billing_details_id: 2,
    iva: false,
    subtotal: 500.0,
    total: 500.0,
    notes: "Quotation for Jane Smith",
    status: false,
  },
];

const quotation_product = [
  {
    quotation_id: 1,
    product_id: 1,
    quantity: 1,
    price: 699.99,
  },
  {
    quotation_id: 1,
    product_id: 3,
    quantity: 2,
    price: 19.99,
  },
  {
    quotation_id: 2,
    product_id: 2,
    quantity: 1,
    price: 1299.99,
  },
];

// const revenue = [
//   { month: 'Jan', revenue: 2000 },
//   { month: 'Feb', revenue: 1800 },
//   { month: 'Mar', revenue: 2200 },
//   { month: 'Apr', revenue: 2500 },
//   { month: 'May', revenue: 2300 },
//   { month: 'Jun', revenue: 3200 },
//   { month: 'Jul', revenue: 3500 },
//   { month: 'Aug', revenue: 3700 },
//   { month: 'Sep', revenue: 2500 },
//   { month: 'Oct', revenue: 2800 },
//   { month: 'Nov', revenue: 3000 },
//   { month: 'Dec', revenue: 4800 },
// ];

export {
  users,
  products,
  categories,
  addresses,
  customers,
  billing_details,
  quotations,
  quotation_product,
};
