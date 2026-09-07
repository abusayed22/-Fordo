/* ─────────────────────────────────────────────
   Pordo — Frontend Mock Data & Types
   ───────────────────────────────────────────── */

// ── Types ──

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number;
  costPrice: number;
  regularPrice: number;
  stock: number;
  unit: "KG" | "GM" | "PIECE" | "LITER" | "MG";
  sku: string;
  categoryId: string;
  category: string;
  brandId: string;
  brand?: string;
  vendor?: string;
  status?: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  sizes?: string[];
  colors?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
  status?: string;
  createdAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website?: string;
  origin?: string;
  status?: string;
  isActive: boolean;
  productCount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  price: number;
  costPrice: number;
  total: number;
  size?: string;
  image?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discount: number;
  deliveryCharge: number;
  deliveryFee: number;
  deliveryZone: string;
  total: number;
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "Pending"
    | "Processing"
    | "Delivered"
    | "Cancelled"
    | "Returned";
  paymentMethod: "COD" | "BKASH" | "NAGAD" | "CARD" | "BANK";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  shippingAddress: string;
  isManual: boolean;
  orderDate: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  district?: string;
  status?: string;
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  type?: string;
  value?: number;
  minOrderAmount: number;
  minOrder?: number;
  maxDiscount?: number;
  maxUses: number;
  usedCount: number;
  status?: string;
  isActive: boolean;
  expiresAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "MANAGER" | "DELIVERY_MAN" | "MANUAL_ORDER_ENTRY";
  avatar?: string;
  status?: "active" | "inactive" | "Active" | "Inactive";
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  createdDate?: string;
}

export interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  deliveryCharge: number;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeDeliveryMinOrder: number;
  taxRate: number;
  codEnabled: boolean;
  bkashEnabled: boolean;
  bkashMerchantNumber: string;
  nagadEnabled: boolean;
  nagadMerchantNumber: string;
  courierSteadfastKey: string;
  courierPathaoKey: string;
  invoiceFooterNote: string;
}

// ── Mock Data ──

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Men's Wear",
    slug: "mens-wear",
    description: "Premium men's clothing collection",
    image: "/placeholder-category.jpg",
    productCount: 45,
    isActive: true,
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    id: "cat-2",
    name: "Women's Wear",
    slug: "womens-wear",
    description: "Elegant women's clothing collection",
    image: "/placeholder-category.jpg",
    productCount: 62,
    isActive: true,
    status: "Active",
    createdAt: "2024-01-12",
  },
  {
    id: "cat-3",
    name: "Accessories",
    slug: "accessories",
    description: "Premium accessories and lifestyle items",
    image: "/placeholder-category.jpg",
    productCount: 28,
    isActive: true,
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "cat-4",
    name: "Footwear",
    slug: "footwear",
    description: "Shoes, sneakers, and sandals",
    image: "/placeholder-category.jpg",
    productCount: 35,
    isActive: true,
    status: "Active",
    createdAt: "2024-01-20",
  },
  {
    id: "cat-5",
    name: "Electronics",
    slug: "electronics",
    description: "Tech gadgets and electronics",
    image: "/placeholder-category.jpg",
    productCount: 18,
    isActive: true,
    status: "Active",
    createdAt: "2024-01-25",
  },
  {
    id: "cat-6",
    name: "Saree",
    slug: "saree",
    description: "Traditional and designer sarees",
    image: "/placeholder-category.jpg",
    productCount: 40,
    isActive: true,
    status: "Active",
    createdAt: "2024-02-01",
  },
];

export const mockBrands: Brand[] = [
  {
    id: "brand-1",
    name: "Aarong",
    slug: "aarong",
    logo: "/placeholder-brand.jpg",
    description: "Bangladesh's leading lifestyle retail chain",
    website: "https://aarong.com",
    origin: "Local",
    status: "Active",
    isActive: true,
    productCount: 30,
  },
  {
    id: "brand-2",
    name: "Yellow",
    slug: "yellow",
    logo: "/placeholder-brand.jpg",
    description: "Contemporary fashion brand",
    origin: "Local",
    status: "Active",
    isActive: true,
    productCount: 22,
  },
  {
    id: "brand-3",
    name: "Richman",
    slug: "richman",
    logo: "/placeholder-brand.jpg",
    description: "Premium menswear brand",
    origin: "Local",
    status: "Active",
    isActive: true,
    productCount: 15,
  },
  {
    id: "brand-4",
    name: "Ecstasy",
    slug: "ecstasy",
    logo: "/placeholder-brand.jpg",
    description: "Modern fashion brand for all",
    origin: "Local",
    status: "Active",
    isActive: true,
    productCount: 28,
  },
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Premium Panjabi — Midnight Blue",
    slug: "premium-panjabi-midnight-blue",
    description: "Handcrafted cotton panjabi with intricate embroidery.",
    price: 3500,
    regularPrice: 3500,
    salePrice: 2999,
    costPrice: 1800,
    stock: 25,
    unit: "PIECE",
    sku: "PNJ-001",
    categoryId: "cat-1",
    category: "Men's Wear",
    brandId: "brand-1",
    brand: "Aarong",
    vendor: "Aarong Retail",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.5,
    reviewCount: 42,
    isActive: true,
    isFeatured: true,
    tags: ["eid", "premium", "panjabi"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Midnight Blue", "Ivory", "Black"],
    createdAt: "2024-08-01T00:00:00Z",
  },
  {
    id: "prod-2",
    name: "Silk Saree — Royal Gold",
    slug: "silk-saree-royal-gold",
    description: "Pure silk saree with golden zari work.",
    price: 8500,
    regularPrice: 8500,
    salePrice: 7499,
    costPrice: 4500,
    stock: 12,
    unit: "PIECE",
    sku: "SAR-001",
    categoryId: "cat-6",
    category: "Saree",
    brandId: "brand-1",
    brand: "Aarong",
    vendor: "Aarong Retail",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.8,
    reviewCount: 28,
    isActive: true,
    isFeatured: true,
    tags: ["silk", "saree", "premium"],
    colors: ["Royal Gold", "Deep Maroon"],
    createdAt: "2024-08-05T00:00:00Z",
  },
  {
    id: "prod-3",
    name: "Leather Wallet — Classic Brown",
    slug: "leather-wallet-classic-brown",
    description: "Genuine leather bifold wallet with RFID protection.",
    price: 1200,
    regularPrice: 1200,
    salePrice: 999,
    costPrice: 550,
    stock: 50,
    unit: "PIECE",
    sku: "ACC-001",
    categoryId: "cat-3",
    category: "Accessories",
    brandId: "brand-3",
    brand: "Richman",
    vendor: "Richman Leather",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.3,
    reviewCount: 15,
    isActive: true,
    isFeatured: false,
    tags: ["leather", "wallet", "accessories"],
    colors: ["Brown", "Black"],
    createdAt: "2024-08-10T00:00:00Z",
  },
  {
    id: "prod-4",
    name: "Casual Shirt — Olive Green",
    slug: "casual-shirt-olive-green",
    description: "Slim fit casual shirt in premium cotton.",
    price: 1800,
    regularPrice: 1800,
    salePrice: 1499,
    costPrice: 850,
    stock: 35,
    unit: "PIECE",
    sku: "SHR-001",
    categoryId: "cat-1",
    category: "Men's Wear",
    brandId: "brand-2",
    brand: "Yellow",
    vendor: "Beximco Apparels",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.2,
    reviewCount: 33,
    isActive: true,
    isFeatured: true,
    tags: ["casual", "shirt", "cotton"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Sky Blue", "White"],
    createdAt: "2024-08-12T00:00:00Z",
  },
  {
    id: "prod-5",
    name: "Sneakers — Urban Grey",
    slug: "sneakers-urban-grey",
    description: "Lightweight sneakers with memory foam insole.",
    price: 3200,
    regularPrice: 3200,
    salePrice: 2799,
    costPrice: 1600,
    stock: 20,
    unit: "PIECE",
    sku: "SHO-001",
    categoryId: "cat-4",
    category: "Footwear",
    brandId: "brand-4",
    brand: "Ecstasy",
    vendor: "Apex Partner",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.6,
    reviewCount: 55,
    isActive: true,
    isFeatured: true,
    tags: ["sneakers", "footwear", "urban"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Urban Grey", "Black", "White"],
    createdAt: "2024-08-15T00:00:00Z",
  },
  {
    id: "prod-6",
    name: "Formal Blazer — Charcoal",
    slug: "formal-blazer-charcoal",
    description: "Tailored single-breasted blazer in premium wool blend.",
    price: 5500,
    regularPrice: 5500,
    salePrice: 4999,
    costPrice: 2800,
    stock: 10,
    unit: "PIECE",
    sku: "BLZ-001",
    categoryId: "cat-1",
    category: "Men's Wear",
    brandId: "brand-3",
    brand: "Richman",
    vendor: "Richman Suiting",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.7,
    reviewCount: 18,
    isActive: true,
    isFeatured: false,
    tags: ["formal", "blazer", "premium"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Navy"],
    createdAt: "2024-08-18T00:00:00Z",
  },
  {
    id: "prod-7",
    name: "Kurti — Floral Print",
    slug: "kurti-floral-print",
    description: "Comfortable cotton kurti with hand-printed floral design.",
    price: 1500,
    regularPrice: 1500,
    salePrice: 1299,
    costPrice: 700,
    stock: 40,
    unit: "PIECE",
    sku: "KRT-001",
    categoryId: "cat-2",
    category: "Women's Wear",
    brandId: "brand-2",
    brand: "Yellow",
    vendor: "Yellow Fashion",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.4,
    reviewCount: 38,
    isActive: true,
    isFeatured: true,
    tags: ["kurti", "floral", "women"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi", "Blue Floral", "Pink Floral"],
    createdAt: "2024-08-20T00:00:00Z",
  },
  {
    id: "prod-8",
    name: "Wireless Earbuds — Pro Max",
    slug: "wireless-earbuds-pro-max",
    description: "Active noise cancelling wireless earbuds with 30hr battery.",
    price: 4500,
    regularPrice: 4500,
    salePrice: 3999,
    costPrice: 2200,
    stock: 30,
    unit: "PIECE",
    sku: "ELC-001",
    categoryId: "cat-5",
    category: "Electronics",
    brandId: "brand-4",
    brand: "Ecstasy",
    vendor: "Gadget World",
    status: "Active",
    image: "/placeholder-product.jpg",
    images: ["/placeholder-product.jpg"],
    rating: 4.5,
    reviewCount: 67,
    isActive: true,
    isFeatured: true,
    tags: ["electronics", "earbuds", "wireless"],
    colors: ["Matte Black", "Pearl White"],
    createdAt: "2024-08-22T00:00:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-20240901-001",
    customerId: "cust-1",
    customerName: "Rahim Uddin",
    customerPhone: "+8801712345678",
    customerAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    items: [
      {
        id: "oi-1",
        productId: "prod-1",
        productName: "Premium Panjabi — Midnight Blue",
        name: "Premium Panjabi — Midnight Blue",
        sku: "PNJ-001",
        quantity: 1,
        unitPrice: 2999,
        price: 2999,
        costPrice: 1800,
        total: 2999,
        size: "L",
        image: "/placeholder-product.jpg",
      },
      {
        id: "oi-2",
        productId: "prod-3",
        productName: "Leather Wallet — Classic Brown",
        name: "Leather Wallet — Classic Brown",
        sku: "ACC-001",
        quantity: 1,
        unitPrice: 999,
        price: 999,
        costPrice: 550,
        total: 999,
        image: "/placeholder-product.jpg",
      },
    ],
    subtotal: 3998,
    discountAmount: 200,
    discount: 200,
    deliveryCharge: 60,
    deliveryFee: 60,
    deliveryZone: "Inside Dhaka",
    total: 3858,
    totalAmount: 3858,
    status: "DELIVERED",
    paymentMethod: "COD",
    paymentStatus: "PAID",
    shippingAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    isManual: false,
    orderDate: "2024-09-01",
    createdAt: "2024-09-01T10:30:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-20240902-001",
    customerId: "cust-2",
    customerName: "Fatima Akter",
    customerPhone: "+8801898765432",
    customerAddress: "Apartment 4B, Gulshan-2, Dhaka",
    items: [
      {
        id: "oi-3",
        productId: "prod-2",
        productName: "Silk Saree — Royal Gold",
        name: "Silk Saree — Royal Gold",
        sku: "SAR-001",
        quantity: 1,
        unitPrice: 7499,
        price: 7499,
        costPrice: 4500,
        total: 7499,
        image: "/placeholder-product.jpg",
      },
    ],
    subtotal: 7499,
    discountAmount: 0,
    discount: 0,
    deliveryCharge: 0,
    deliveryFee: 0,
    deliveryZone: "Inside Dhaka",
    total: 7499,
    totalAmount: 7499,
    status: "PROCESSING",
    paymentMethod: "BKASH",
    paymentStatus: "PAID",
    shippingAddress: "Apartment 4B, Gulshan-2, Dhaka",
    isManual: false,
    orderDate: "2024-09-02",
    createdAt: "2024-09-02T14:15:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-20240903-001",
    customerId: "cust-3",
    customerName: "Karim Hossain",
    customerPhone: "+8801612345678",
    customerAddress: "23/A, Mirpur-10, Dhaka",
    items: [
      {
        id: "oi-4",
        productId: "prod-5",
        productName: "Sneakers — Urban Grey",
        name: "Sneakers — Urban Grey",
        sku: "SHO-001",
        quantity: 1,
        unitPrice: 2799,
        price: 2799,
        costPrice: 1600,
        total: 2799,
        size: "42",
        image: "/placeholder-product.jpg",
      },
      {
        id: "oi-5",
        productId: "prod-4",
        productName: "Casual Shirt — Olive Green",
        name: "Casual Shirt — Olive Green",
        sku: "SHR-001",
        quantity: 2,
        unitPrice: 1499,
        price: 1499,
        costPrice: 850,
        total: 2998,
        size: "L",
        image: "/placeholder-product.jpg",
      },
    ],
    subtotal: 5797,
    discountAmount: 500,
    discount: 500,
    deliveryCharge: 60,
    deliveryFee: 60,
    deliveryZone: "Inside Dhaka",
    total: 5357,
    totalAmount: 5357,
    status: "PENDING",
    paymentMethod: "COD",
    paymentStatus: "UNPAID",
    shippingAddress: "23/A, Mirpur-10, Dhaka",
    isManual: true,
    orderDate: "2024-09-03",
    createdAt: "2024-09-03T09:00:00Z",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Rahim Uddin",
    email: "rahim@example.com",
    phone: "+8801712345678",
    address: "Dhanmondi, Dhaka",
    district: "Dhaka",
    status: "Active",
    totalOrders: 5,
    totalSpent: 15200,
    isActive: true,
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "cust-2",
    name: "Fatima Akter",
    email: "fatima@example.com",
    phone: "+8801898765432",
    address: "Gulshan, Dhaka",
    district: "Dhaka",
    status: "Active",
    totalOrders: 3,
    totalSpent: 22000,
    isActive: true,
    createdAt: "2024-06-15T00:00:00Z",
  },
  {
    id: "cust-3",
    name: "Karim Hossain",
    email: "karim@example.com",
    phone: "+8801612345678",
    address: "Mirpur, Dhaka",
    district: "Dhaka",
    status: "Active",
    totalOrders: 8,
    totalSpent: 35000,
    isActive: true,
    createdAt: "2024-05-20T00:00:00Z",
  },
  {
    id: "cust-4",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+8801512345678",
    address: "Uttara, Dhaka",
    district: "Dhaka",
    status: "Active",
    totalOrders: 2,
    totalSpent: 8500,
    isActive: true,
    createdAt: "2024-07-10T00:00:00Z",
  },
];

export const mockCoupons: Coupon[] = [
  {
    id: "coup-1",
    code: "EID2024",
    description: "Eid special discount",
    discountType: "PERCENTAGE",
    discountValue: 15,
    type: "Percentage",
    value: 15,
    minOrderAmount: 2000,
    minOrder: 2000,
    maxDiscount: 500,
    maxUses: 500,
    usedCount: 234,
    status: "Active",
    isActive: true,
    expiresAt: "2024-12-31T23:59:59Z",
  },
  {
    id: "coup-2",
    code: "WELCOME10",
    description: "New customer welcome discount",
    discountType: "PERCENTAGE",
    discountValue: 10,
    type: "Percentage",
    value: 10,
    minOrderAmount: 1000,
    minOrder: 1000,
    maxDiscount: 200,
    maxUses: 1000,
    usedCount: 567,
    status: "Active",
    isActive: true,
    expiresAt: "2025-06-30T23:59:59Z",
  },
  {
    id: "coup-3",
    code: "FLAT200",
    description: "Flat 200 taka off",
    discountType: "FIXED",
    discountValue: 200,
    type: "Fixed",
    value: 200,
    minOrderAmount: 1500,
    minOrder: 1500,
    maxDiscount: 200,
    maxUses: 200,
    usedCount: 89,
    status: "Active",
    isActive: true,
    expiresAt: "2024-10-31T23:59:59Z",
  },
];

export const mockStaff: StaffUser[] = [
  {
    id: "staff-1",
    name: "Admin User",
    email: "admin@pordo.com",
    phone: "+8801700000001",
    role: "ADMIN",
    avatar: "/placeholder-avatar.jpg",
    status: "Active",
    isActive: true,
    lastLogin: "2024-09-05T12:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    createdDate: "2024-01-01",
  },
  {
    id: "staff-2",
    name: "Manager Kamal",
    email: "kamal@pordo.com",
    phone: "+8801700000002",
    role: "MANAGER",
    avatar: "/placeholder-avatar.jpg",
    status: "Active",
    isActive: true,
    lastLogin: "2024-09-04T09:30:00Z",
    createdAt: "2024-02-15T00:00:00Z",
    createdDate: "2024-02-15",
  },
  {
    id: "staff-3",
    name: "Delivery Boy Rony",
    email: "rony@pordo.com",
    phone: "+8801700000003",
    role: "DELIVERY_MAN",
    avatar: "/placeholder-avatar.jpg",
    status: "Active",
    isActive: true,
    lastLogin: "2024-09-05T08:00:00Z",
    createdAt: "2024-03-10T00:00:00Z",
    createdDate: "2024-03-10",
  },
];

export const initialSettings: Settings = {
  storeName: "Pordo",
  storeEmail: "hello@pordo.com",
  storePhone: "+8801700000000",
  storeAddress: "Dhaka, Bangladesh",
  currency: "BDT",
  deliveryCharge: 60,
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeDeliveryMinOrder: 3000,
  taxRate: 0,
  codEnabled: true,
  bkashEnabled: true,
  bkashMerchantNumber: "01700000000",
  nagadEnabled: false,
  nagadMerchantNumber: "",
  courierSteadfastKey: "",
  courierPathaoKey: "",
  invoiceFooterNote: "Thank you for shopping with Pordo!",
};
