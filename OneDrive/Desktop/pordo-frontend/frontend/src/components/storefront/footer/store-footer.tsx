import React from "react";
import Link from "next/link";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="bg-[#0b1320] text-slate-300 pt-10 sm:pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-10">
        {/* Newsletter Box */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Subscribe to Pordo VIP Discounts
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Get exclusive promo codes and latest collection drops delivered to your inbox.
            </p>
          </div>

          <div className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              className="px-5 h-10 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          {/* Col 1: Brand & Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-[#056D6E] to-[#044342] flex items-center justify-center text-white font-bold shadow-xs">
                <Store className="size-4.5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white font-sans">
                PORDO MART
              </span>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Premium Bangladesh e-commerce destination for handcrafted Panjabi, Jamdani Sarees, Designer Kurtis, Modest Wear and formal essentials.
            </p>

            <div className="space-y-2 pt-1 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-emerald-400 shrink-0" />
                <span>+880 1700-112233 (24/7 Hotline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-emerald-400 shrink-0" />
                <span>support@pordo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-emerald-400 shrink-0" />
                <span>House 12, Road 4, Sector 3, Uttara, Dhaka-1230</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Top Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/#categories" className="hover:text-white transition-colors">Mens Ethnic Wear</Link></li>
              <li><Link href="/#categories" className="hover:text-white transition-colors">Dhakai Jamdani Saree</Link></li>
              <li><Link href="/#categories" className="hover:text-white transition-colors">Womens Kurti Sets</Link></li>
              <li><Link href="/#categories" className="hover:text-white transition-colors">Mens Formal Shirts</Link></li>
              <li><Link href="/#categories" className="hover:text-white transition-colors">Dubai Cherry Abayas</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/orders/new" className="hover:text-white transition-colors">Manual POS Entry</Link></li>
              <li><Link href="/#deals" className="hover:text-white transition-colors">Coupons &amp; Deals</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link href="/#categories" className="hover:text-white transition-colors">Exchange &amp; Returns</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Payment */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Staff Portal
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/dashboard" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  Admin Dashboard
                </Link>
              </li>
              <li><Link href="/orders/new" className="hover:text-white transition-colors">POS Officer Hub</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Catalog Management</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Category CRUD</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors">Brand CRUD</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment icons & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Pordo E-Commerce Store. All rights reserved.</p>

          <div className="flex items-center gap-2 font-bold text-[11px] text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-pink-400">bKash</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-orange-400">Nagad</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">COD</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-400">Visa / Master</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
