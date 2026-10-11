type Product = {
  id: number | string;
  nameBn: string;
  unit?: string;
  today: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD").format(price);

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("Marquee API error:", response.status);
      return [];
    }

    const json: unknown = await response.json();

    const items: unknown[] = Array.isArray(json)
      ? json
      : typeof json === "object" &&
          json !== null &&
          "data" in json &&
          Array.isArray(json.data)
        ? json.data
        : [];

    return items.filter((item): item is Product => {
      if (!item || typeof item !== "object") return false;

      const product = item as Partial<Product>;

      return (
        (typeof product.id === "number" ||
          typeof product.id === "string") &&
        typeof product.nameBn === "string" &&
        typeof product.today === "number"
      );
    });
  } catch (error) {
    console.error("Could not load marquee products:", error);
    return [];
  }
}

export default async function Marquee() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="border-y border-green-100 bg-green-50 px-4 py-3 text-center text-sm text-green-800">
        <span className="font-semibold">বাজার দর</span>
        <span className="mx-2">•</span>
        আজকের বাজারদর দেখুন
      </div>
    );
  }

  return (
    <section
      aria-label="Today's market prices"
      className="overflow-hidden border-y border-green-100 bg-green-50"
    >
      <div className="flex min-h-11 items-center gap-4">
        <div className="z-10 shrink-0 bg-green-700 px-4 py-3 text-sm font-bold text-white">
          আজকের দর
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="bazardor-marquee flex w-max items-center gap-8 py-3">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center gap-8"
              >
                {products.map((product) => {
                  const direction = product.change?.dir ?? "flat";

                  const color =
                    direction === "up"
                      ? "text-red-600"
                      : direction === "down"
                        ? "text-green-700"
                        : "text-gray-600";

                  const arrow =
                    direction === "up"
                      ? "▲"
                      : direction === "down"
                        ? "▼"
                        : "•";

                  return (
                    <span
                      key={`${copy}-${product.id}`}
                      className="whitespace-nowrap text-sm text-gray-700"
                    >
                      <span className="font-medium">
                        {product.nameBn}
                      </span>
                      <span className="mx-2 text-gray-400">—</span>
                      <span className="font-bold">
                        ৳{formatPrice(product.today)}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        / {product.unit ?? "কেজি"}
                      </span>
                      {product.change && (
                        <span className={`ml-2 text-xs font-semibold ${color}`}>
                          {arrow}{" "}
                          {new Intl.NumberFormat("bn-BD", {
                            maximumFractionDigits: 1,
                          }).format(Math.abs(product.change.pct))}
                          %
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .bazardor-marquee {
          animation: bazardor-scroll 45s linear infinite;
        }

        .bazardor-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes bazardor-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bazardor-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}