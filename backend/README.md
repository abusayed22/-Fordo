# 🛒 Grocery & E-Commerce Platform Architecture Documentation

এই ডকুমেন্টে প্রজেক্টের ডেটাবেজ আর্কিটেকচার, ইনভেন্টরি ও প্রফিট ম্যানেজমেন্টের মূল ব্যবসায়িক সিদ্ধান্তসমূহ লিপিবদ্ধ করা হয়েছে।

---

## 📌 ১. ইনভেন্টরি ও প্রফিট ম্যানেজমেন্ট পদ্ধতি

### সিদ্ধান্ত: Weighted Average Method + Purchase History
খোলা পণ্য (যেমন: চাল, ডাল, আলু) ও প্যাকেটজাত পণ্যের স্টক এবং দাম নিখুঁতভাবে ট্র্যাক করতে **Weighted Average Method** ব্যবহার করা হয়েছে।

1. **Purchase Table (লগ/হিস্ট্রি):** প্রতিবার পাইকারি বাজার বা সাপ্লায়ার থেকে মাল কেনার মেমো/ভাউচার এই টেবিলে সেভ থাকবে।
2. **Product.costPrice (গড় কেনা দাম):** নতুন মাল ক্রয়ের সাথে সাথে স্বয়ংক্রিয়ভাবে গড় দাম আপডেট হবে:
   $$\text{New Cost Price} = \frac{(\text{আগের স্টক} \times \text{আগের কেনা দাম}) + (\text{নতুন ক্রয়} \times \text{নতুন ক্রয়ের দাম})}{\text{মোট নতুন স্টক}}$$
3. **OrderItem.costPrice (হিস্টোরিক্যাল প্রফিট স্ন্যাপশট):** প্রতিটি অর্ডার প্লেস হওয়ার মুহূর্তে তৎকালীন `costPrice` স্ন্যাপশট হিসেবে `OrderItem` টেবিলে সেভ থাকবে, যাতে ভবিষ্যতে ক্রয়ের দাম পরিবর্তিত হলেও অতীতের বিক্রির লাভের হিসাবে কোনো গরমিল না হয়।

---

## 💰 ২. লাভ ও ব্যয় ক্যালকুলেশন লজিক (Accounting Architecture)

* **গ্রস লাভ (Gross Profit):**
  $$\text{Gross Profit} = \sum \Big( (\text{OrderItem.unitPrice} - \text{OrderItem.costPrice}) \times \text{OrderItem.quantity} \Big) - \text{Order.discountAmount}$$
* **মোট ব্যয় (Total Expense):**
  `Expense` টেবিলে স্টাফ স্যালারি, অফিস/দোকান ভাড়া, বিদ্যুৎ বিল ও প্যাকেজিং খরচ সংরক্ষিত থাকবে।
* **নিট লাভ (Net Profit):**
  $$\text{Net Profit} = \text{Gross Profit} - \sum (\text{Expenses})$$
* **পার্টনার প্রফিট শেয়ারিং:**
  ৩ জন পার্টনারের জন্য তাদের নির্ধারিত শতকরা হার (`sharePercentage`) অনুযায়ী মাস শেষে নিট লাভ বণ্টন করা হবে।

---

## ⚖️ ৩. ফ্র্যাকশনাল ইউনিট ও ওজন হ্যান্ডলিং

* চাল, ডাল বা খোলা পণ্যের জন্য `quantity` ফিল্ডটি `Float` রাখা হয়েছে, যাতে কাস্টমার `0.5` কেজি (হাফ কেজি) বা `1.5` কেজির মতো ভগ্নাংশ পরিমাণেও কিনতে পারেন।
* বেস ইউনিট হিসেবে `KG`, `GM`, `MG`, `PIECE`, `LITER` সাপোর্ট করে।

---

## 👥 ৪. ইউজার ও রোল আর্কিটেকচার

* **রোলস:** `CUSTOMER`, `ADMIN`, `MANAGER`, `DELIVERY_MAN`, `MANUAL_ORDER_ENTRY`।
* **ম্যানুয়াল অর্ডার (Manual Orders):** ডেলিভারি বয় বা স্টাফরা অফলাইন কাস্টমারদের জন্য সরাসরি অর্ডার এন্ট্রি করতে পারবেন (`Order.isManual = true` এবং `Order.createdById` দ্বারা ট্র্যাক করা হবে)।

---








---

## 📦 Inventory & Costing Policy: Weighted Average + Purchase History

এই প্রজেক্টে ইনভেন্টরি ও লাভ-ক্ষতির নির্ভুল ট্র্যাকিং নিশ্চিত করতে **Weighted Average Costing** এবং **Purchase History Log** পলিসি অনুসরণ করা হয়েছে।

### ১. মূল কার্যপদ্ধতি (Core Workflow)

1. **Purchase Entry (ক্রয় লগ):**
   * পাইকারি বাজার বা সরবরাহকারীর (Supplier) কাছ থেকে পণ্য কেনার সাথে সাথে প্রতিটি চালানের তথ্য `Purchase` টেবিলে যুক্ত হবে।
   * সংরক্ষিত তথ্য: `quantity`, `unitCost`, `totalCost`, `supplierName`, `invoiceNo`, `purchaseDate`।

2. **Weighted Average Cost Update (গড় ক্রয়মূল্য আপডেট):**
   * নতুন চালান এন্ট্রি হওয়ার পর সিস্টেম স্বয়ংক্রিয়ভাবে ফর্মুলা অনুযায়ী পণ্যের নতুন গড় দাম (`Product.costPrice`) ও মোট স্টক (`Product.stock`) আপডেট করবে।

3. **Order Snapshot (অর্ডার স্ন্যাপশট):**
   * কাস্টমার পণ্য অর্ডার করার মুহূর্তে বিদ্যমান `Product.costPrice`-এর মানটি `OrderItem.costPrice` ফিল্ডে সেভ হয়ে যাবে।
   * ফলে ভবিষ্যতে পণ্যের কেনা দাম বাড়লে বা কমলেও পূর্বের বিক্রির লাভ অপরিবর্তিত থাকবে।

---

### ২. ক্যালকুলেশন ফর্মুলা (Mathematical Formula)

নতুন চালানের পর গড় কেনা দাম নির্ধারণের গাণিতিক সূত্র:

$$\text{New Cost Price} = \frac{(\text{Current Stock} \times \text{Current Cost Price}) + (\text{New Quantity} \times \text{New Unit Cost})}{\text{Current Stock} + \text{New Quantity}}$$

#### 💡 বাস্তব উদাহরণ:
* **পূর্বের স্টক:** ১০ কেজি চাল @ ৭০ টাকা
* **নতুন ক্রয়:** ৪০ কেজি চাল @ ৭৪ টাকা
* **মোট নতুন স্টক:** $১০ + ৪০ = ৫০$ কেজি

$$\text{Updated Cost Price} = \frac{(10 \times 70) + (40 \times 74)}{50} = \frac{700 + 2960}{50} = \frac{3660}{50} = \mathbf{73.20 \text{ টাকা}}$$

---

### ৩. অর্ডার ও বিক্রয় লজিক (Sales & Stock Deduction)

* **খুচরা ও ভগ্নাংশ পরিমাণ (Fractional Quantities):** কাস্টমার যে পরিমাণই অর্ডার করুক না কেন (যেমন: `0.5` কেজি বা `1.5` কেজি), তা সরাসরি `Product.stock` থেকে মাইনাস হবে।
* **গ্রস লাভ গণনা:** 
  $$\text{Item Gross Profit} = (\text{OrderItem.unitPrice} - \text{OrderItem.costPrice}) \times \text{OrderItem.quantity}$$

---

### ৪. নীতিমালার সুবিধাসমূহ (Policy Benefits)

* **জিরো ব্যাচ জটিলতা:** দোকানে খোলা ড্রামে পুরনো ও নতুন চাল মিশ্রিত থাকলে আলাদা লট/ব্যাচ ধরে বিক্রির ঝামেলা থাকে না।
* **পূর্ণাঙ্গ অডিট ট্রেইল:** অতীতে কোন তারিখে কত দামে কার কাছ থেকে পণ্য কেনা হয়েছিল, তার ১০০% হিসাব `Purchase` টেবিলে সংরক্ষিত থাকে।
* **রিয়েল-টাইম অ্যাকাউন্টিং:** প্রতিটি অর্ডারের সঠিক ক্রয়মূল্য তাৎক্ষণিকভাবে সংরক্ষিত থাকায় দিন/মাস শেষের রিপোর্টিংয়ে কোনো বিলম্ব হয় না।

---