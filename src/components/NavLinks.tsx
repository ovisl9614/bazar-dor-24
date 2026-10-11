import Link from "next/link";

type NavCategory = {
  id: string | number;
  slug?: string;
  nameBn: string;
  icon?: string;
};

type ApiProduct = {
  id?: string | number;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
};

const BASE_URL =
  "https://api.abcz.workers.dev/api/bazardor";

async function getCategories(): Promise<NavCategory[]> {
  try {
    // First try the categories endpoint.
    const response = await fetch(`${BASE_URL}/categories`, {
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const json: unknown = await response.json();

      const items: unknown[] = Array.isArray(json)
        ? json
        : typeof json === "object" &&
            json !== null &&
            "data" in json &&
            Array.isArray(json.data)
          ? json.data
          : [];

      const categories = items.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];

        const row = item as Record<string, unknown>;
        const name = row.nameBn ?? row.categoryNameBn ?? row.name;
        const id = row.id ?? row.slug ?? row.category;

        if (
          (typeof id !== "string" && typeof id !== "number") ||
          typeof name !== "string"
        ) {
          return [];
        }

        return [
          {
            id,
            slug: typeof row.slug === "string" ? row.slug : String(id),
            nameBn: name,
            icon:
              typeof row.icon === "string"
                ? row.icon
                : typeof row.categoryIcon === "string"
                  ? row.categoryIcon
                  : "🛒",
          },
        ];
      });

      if (categories.length > 0) return categories;
    }
  } catch (error) {
    console.error("Categories API request failed:", error);
  }

  // If the categories endpoint fails, derive categories from products.
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const json: unknown = await response.json();

    const products: unknown[] = Array.isArray(json)
      ? json
      : typeof json === "object" &&
          json !== null &&
          "data" in json &&
          Array.isArray(json.data)
        ? json.data
        : [];

    const unique = new Map<string, NavCategory>();

    products.forEach((item) => {
      if (!item || typeof item !== "object") return;

      const product = item as ApiProduct;

      if (!product.category) return;

      if (!unique.has(product.category)) {
        unique.set(product.category, {
          id: product.category,
          slug: product.category,
          nameBn: product.categoryNameBn ?? product.category,
          icon: product.categoryIcon ?? "🛒",
        });
      }
    });

    return Array.from(unique.values());
  } catch (error) {
    console.error("Could not derive product categories:", error);
    return [];
  }
}

export default async function NavLinks() {
  const categories = await getCategories();

  return (
    <nav
      aria-label="Product categories"
      className="w-full border-t border-gray-100 bg-white px-3 py-3 sm:px-5"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        <li>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
          >
            সব পণ্য
          </Link>
        </li>

        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${encodeURIComponent(String(category.id))}`}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:bg-green-50 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <span aria-hidden="true">{category.icon ?? "🛒"}</span>
              <span>{category.nameBn}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}