export const INITIAL_PRODUCTS = [
  {
    id: "PROD-101",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 249.99,
    cost: 120.00,
    stock: 45,
    minStockLevel: 15,
    sku: "ELEC-WNC-01",
    status: "In Stock",
    rating: 4.8,
    salesCount: 342,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-102",
    name: "Ergonomic Mechanical Keyboard",
    category: "Computers",
    price: 139.50,
    cost: 65.00,
    stock: 8, // Low stock trigger
    minStockLevel: 10,
    sku: "COMP-EMK-02",
    status: "Low Stock",
    rating: 4.7,
    salesCount: 289,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-103",
    name: "Ultra-wide 34-inch Curved Monitor",
    category: "Computers",
    price: 599.00,
    cost: 320.00,
    stock: 14,
    minStockLevel: 5,
    sku: "COMP-UCM-03",
    status: "In Stock",
    rating: 4.9,
    salesCount: 156,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-104",
    name: "Minimalist Leather Backpack",
    category: "Fashion",
    price: 89.99,
    cost: 35.00,
    stock: 0, // Out of stock trigger
    minStockLevel: 10,
    sku: "FASH-MLB-04",
    status: "Out of Stock",
    rating: 4.5,
    salesCount: 512,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-105",
    name: "Smart Fitness Watch V2",
    category: "Electronics",
    price: 199.00,
    cost: 85.00,
    stock: 62,
    minStockLevel: 20,
    sku: "ELEC-SFW-05",
    status: "In Stock",
    rating: 4.6,
    salesCount: 420,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-106",
    name: "Stainless Steel Insulated Bottle",
    category: "Home & Living",
    price: 29.99,
    cost: 8.50,
    stock: 5, // Low stock trigger
    minStockLevel: 15,
    sku: "HOME-SIB-06",
    status: "Low Stock",
    rating: 4.9,
    salesCount: 890,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-107",
    name: "Adjustable Desk Dual Arm Mount",
    category: "Computers",
    price: 74.50,
    cost: 30.00,
    stock: 22,
    minStockLevel: 8,
    sku: "COMP-ADM-07",
    status: "In Stock",
    rating: 4.4,
    salesCount: 195,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "PROD-108",
    name: "Ceramic Pour-Over Coffee Set",
    category: "Home & Living",
    price: 49.90,
    cost: 16.00,
    stock: 3, // Low stock trigger
    minStockLevel: 10,
    sku: "HOME-CPC-08",
    status: "Low Stock",
    rating: 4.8,
    salesCount: 310,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9081",
    customer: "Alex Morgan",
    email: "alex.m@example.com",
    date: "2026-08-12T14:32:00Z",
    total: 389.49,
    itemsCount: 2,
    items: [
      { name: "Wireless Noise-Canceling Headphones", quantity: 1, price: 249.99 },
      { name: "Ergonomic Mechanical Keyboard", quantity: 1, price: 139.50 }
    ],
    status: "Delivered",
    paymentMethod: "Credit Card (Visa)",
    shippingAddress: "742 Evergreen Terrace, Springfield, OR"
  },
  {
    id: "ORD-9082",
    customer: "Sophia Chen",
    email: "sophia.chen@techmail.io",
    date: "2026-08-12T18:15:00Z",
    total: 599.00,
    itemsCount: 1,
    items: [
      { name: "Ultra-wide 34-inch Curved Monitor", quantity: 1, price: 599.00 }
    ],
    status: "Processing",
    paymentMethod: "PayPal",
    shippingAddress: "100 Innovation Way, San Jose, CA"
  },
  {
    id: "ORD-9083",
    customer: "David Miller",
    email: "d.miller@workspace.net",
    date: "2026-08-13T09:10:00Z",
    total: 228.99,
    itemsCount: 2,
    items: [
      { name: "Smart Fitness Watch V2", quantity: 1, price: 199.00 },
      { name: "Stainless Steel Insulated Bottle", quantity: 1, price: 29.99 }
    ],
    status: "Pending",
    paymentMethod: "Apple Pay",
    shippingAddress: "450 5th Avenue, New York, NY"
  },
  {
    id: "ORD-9084",
    customer: "Elena Rostova",
    email: "elena.r@designhub.org",
    date: "2026-08-11T11:45:00Z",
    total: 89.99,
    itemsCount: 1,
    items: [
      { name: "Minimalist Leather Backpack", quantity: 1, price: 89.99 }
    ],
    status: "Shipped",
    paymentMethod: "Credit Card (Mastercard)",
    shippingAddress: "128 Beacon Street, Boston, MA"
  },
  {
    id: "ORD-9085",
    customer: "Marcus Johnson",
    email: "marcus.j@enterprise.com",
    date: "2026-08-10T16:20:00Z",
    total: 124.40,
    itemsCount: 2,
    items: [
      { name: "Adjustable Desk Dual Arm Mount", quantity: 1, price: 74.50 },
      { name: "Ceramic Pour-Over Coffee Set", quantity: 1, price: 49.90 }
    ],
    status: "Delivered",
    paymentMethod: "Credit Card (Amex)",
    shippingAddress: "88 Market St, San Francisco, CA"
  },
  {
    id: "ORD-9086",
    customer: "Hannah Abbott",
    email: "hannah.a@gmail.com",
    date: "2026-08-09T08:50:00Z",
    total: 249.99,
    itemsCount: 1,
    items: [
      { name: "Wireless Noise-Canceling Headphones", quantity: 1, price: 249.99 }
    ],
    status: "Cancelled",
    paymentMethod: "Store Credit",
    shippingAddress: "32 High St, Austin, TX"
  }
];

export const SALES_TRENDS = {
  "7d": [
    { label: "Mon", revenue: 4200, orders: 28, units: 42 },
    { label: "Tue", revenue: 5100, orders: 34, units: 58 },
    { label: "Wed", revenue: 4800, orders: 31, units: 49 },
    { label: "Thu", revenue: 6300, orders: 42, units: 68 },
    { label: "Fri", revenue: 7900, orders: 55, units: 91 },
    { label: "Sat", revenue: 9400, orders: 68, units: 112 },
    { label: "Sun", revenue: 8600, orders: 61, units: 98 }
  ],
  "30d": [
    { label: "Week 1", revenue: 28400, orders: 195, units: 310 },
    { label: "Week 2", revenue: 32100, orders: 220, units: 360 },
    { label: "Week 3", revenue: 39500, orders: 275, units: 440 },
    { label: "Week 4", revenue: 46300, orders: 310, units: 510 }
  ],
  "ytd": [
    { label: "Jan", revenue: 98000, orders: 680, units: 1100 },
    { label: "Feb", revenue: 105000, orders: 740, units: 1220 },
    { label: "Mar", revenue: 118000, orders: 820, units: 1350 },
    { label: "Apr", revenue: 112000, orders: 790, units: 1290 },
    { label: "May", revenue: 126000, orders: 890, units: 1480 },
    { label: "Jun", revenue: 141000, orders: 960, units: 1610 },
    { label: "Jul", revenue: 138000, orders: 940, units: 1580 },
    { label: "Aug", revenue: 68000, orders: 460, units: 750 }
  ]
};

export const CATEGORY_BREAKDOWN = [
  { category: "Electronics", percentage: 38, revenue: 55600, color: "#6366f1" },
  { category: "Computers", percentage: 32, revenue: 46800, color: "#06b6d4" },
  { category: "Home & Living", percentage: 18, revenue: 26300, color: "#10b981" },
  { category: "Fashion", percentage: 12, revenue: 17500, color: "#f59e0b" }
];

export const INITIAL_CUSTOMERS = [
  { id: "CUST-01", name: "Alex Morgan", email: "alex.m@example.com", totalSpent: 1840.50, ordersCount: 7, status: "Active", joined: "2025-11-12" },
  { id: "CUST-02", name: "Sophia Chen", email: "sophia.chen@techmail.io", totalSpent: 2396.00, ordersCount: 4, status: "VIP", joined: "2025-09-04" },
  { id: "CUST-03", name: "David Miller", email: "d.miller@workspace.net", totalSpent: 628.99, ordersCount: 3, status: "Active", joined: "2026-02-18" },
  { id: "CUST-04", name: "Elena Rostova", email: "elena.r@designhub.org", totalSpent: 1250.00, ordersCount: 5, status: "Active", joined: "2025-12-01" },
  { id: "CUST-05", name: "Marcus Johnson", email: "marcus.j@enterprise.com", totalSpent: 4120.00, ordersCount: 12, status: "VIP", joined: "2025-06-20" }
];
