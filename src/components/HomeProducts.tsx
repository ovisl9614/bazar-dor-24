
import Link from "next/link";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type Product = {
  id: string | number;
  slug: string;
  nameBn: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | string;
    pct: number;
  };
  categoryNameBn?: string;
};

function price(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex min-w-0 flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl" aria-hidden="true">🛒</span>

        <span
          className={`rounded-full px-2 py-1 text-xs font-bold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
          {price(Math.abs(product.change?.pct ?? 0))}%
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 font-bold text-gray-800">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        প্রতি {product.unit}
      </p>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500">আজকের দাম</p>
        <p className="mt-1 text-lg font-extrabold text-gray-900">
          ৳{price(product.today)}
        </p>
      </div>
    </Link>
  );
}

function ProductSection({
  id,
  title,
  products,
}: {
  id: string;
  title: string;
  products: Product[];
}) {
  return (
    <section id={id} className="scroll-mt-24 py-6 sm:py-8">
      <h2 className="mb-5 text-xl font-extrabold text-gray-900 sm:text-2xl">
        {title}
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যাচ্ছে না।
        </p>
      )}
    </section>
  );
}

export default async function HomeProducts() {
  let products: Product[] = [];

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Products API request failed");
    }

    const json = await response.json();

    // API থেকে আসা products সরাসরি নেওয়া হচ্ছে
    products = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.products)
        ? json.products
        : [];
  } catch (error) {
    console.error("Products fetch error:", error);
  }

  // আগে দাম কমেছে এমন ৬টি পণ্য
  const decreased = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  // এরপর দাম বেড়েছে এমন ৬টি পণ্য
  const increased = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <main className="w-full bg-[#f7fbf8] px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ProductSection
          id="দাম-কমেছে"
          title="আজ দাম কমেছে ▼"
          products={decreased}
        />

        <ProductSection
          id="দাম-বেড়েছে"
          title="আজ দাম বেড়েছে ▲"
          products={increased}
        />

        <ProductSection
          id="সব-পণ্য"
          title="সব পণ্য"
          products={products}
        />
      </div>
    </main>
  );
}
