import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";



export const commonNavItems = (role : UserRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            // title : "Dashboard",
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                },
            ]
        },
    ]
}


export const manualOrderNavItems : NavSection[] = [
   {
    title: "Counter POS",
    items: [
      {
        title: "New Order (POS)",
        href: "/manual-order-entry/orders/new",
        icon: "PlusCircle",
      },
      {
        title: "Orders List",
        href: "/manual-order-entry/orders",
        icon: "ShoppingBag",
      },
      {
        title: "Customer Search",
        href: "/manual-order-entry/customers",
        icon: "Users",
      },
      {
        title: "Live Stock Check",
        href: "/manual-order-entry/products",
        icon: "Package",
      },
    ],
  },
]

export const adminNavItems: NavSection[] = [
   {
       title: "Dashboard",
       items: [
           {
               title: "Admin Dashboard",
               href: "/admin/dashboard",
               icon: "LayoutDashboard",
           },
           {
               title: "Customers",
               href: "/admin/customers",
               icon: "User",
           },
        //    {
        //        title: "Inventory",
        //        href: "/admin/inventory",
        //        icon: "ShoppingBag",
        //    },
        //    {
        //        title: "Orders",
        //        href: "/admin/orders",
        //        icon: "List",
        //    },
           {
               title: "Products",
               href: "/admin/products",
               icon: "List",
           },
       ],
   },
   {
    title: "Catalog & Inventory",
    items: [
      {
        title: "New Product",
        href: "/admin/products/new",
        icon: "Package",
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: "FolderTree",
      },
      {
        title: "Brands",
        href: "/admin/brands",
        icon: "Award",
      },
      {
        title: "Stock Control",
        href: "/admin/inventory",
        icon: "Boxes",
      },
    ],
  },
  // {
  //   title: "Administration",
  //   items: [
  //     {
  //       title: "Staff & Officers",
  //       href: "/admin/settings/users",
  //       icon: "Shield",
  //     },
  //     {
  //       title: "Coupons & Offers",
  //       href: "/discounts",
  //       icon: "TicketPercent",
  //     },
  //     {
  //       title: "Store Settings",
  //       href: "/settings",
  //       icon: "Settings",
  //     },
  //   ],
  // },
];

export const customerNavItems: NavSection[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Dashboard",
                href: "/customer/dashboard",
                icon: "LayoutDashboard",
            },
            {
                title: "Orders",
                href: "/customer/orders",
                icon: "List",
            },
        ],
    },
];

export const getNavItemsByRole = (role : UserRole) : NavSection[] => {
    const commonNav = commonNavItems(role);

    switch (role) {
        case "MANAGER":
        case "ADMIN":
            return [...commonNav, ...adminNavItems];

        case "MANUAL_ORDER_ENTRY":
            return [...commonNav, ...manualOrderNavItems];

        case "CUSTOMER":
            return [...commonNav, ...customerNavItems];
            default:
      return commonNav;
    }
}



