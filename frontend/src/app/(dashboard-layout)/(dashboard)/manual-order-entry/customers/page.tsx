import { mockCustomers } from "@/lib/mock-data";

export default function ManualOrderCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Counter workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Customer search</h1>
        <p className="mt-1 text-sm text-slate-500">Find saved customer details before creating an order.</p>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-slate-950">Saved customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-155 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Phone</th><th className="px-3 py-3">Location</th><th className="px-5 py-3 text-right">Orders</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-semibold text-slate-900">{customer.name}</td>
                  <td className="px-3 py-4 font-mono text-xs text-slate-600">{customer.phone}</td>
                  <td className="px-3 py-4 text-slate-600">{customer.address}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900">{customer.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
