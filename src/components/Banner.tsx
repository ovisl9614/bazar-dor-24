
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="bg-[#eff5f0] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-5 rounded-2xl border border-[#e7eee8] bg-[#f9fcf9] px-5 py-6 shadow-sm sm:grid-cols-[1.45fr_0.55fr] sm:gap-6 sm:px-8 sm:py-7 md:px-10 md:py-8">


          {/* LEFT SIDE*/}
    <div className="min-w-0">
            <span className="inline-flex rounded-full border border-[#cce9d2] bg-[#e7f6e9] px-3 py-1 text-[11px] font-semibold text-[#26834a] sm:text-xs">
              সঠিক দাম, সঠিক সময়ে
            </span>

            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#26382c] sm:text-3xl md:text-[34px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 max-w-xl text-xs leading-5 text-[#69746c] sm:text-sm sm:leading-6">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস ও নিত্যপ্রয়োজনীয়
              পণ্যের সর্বশেষ বাজারদর জানুন। কোন পণ্যের দাম বাড়ছে
              আর কোনটির দাম কমছে, সব তথ্য এক জায়গায়।
            </p>

            <Link
              href="/#সব-পণ্য"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#168447] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#116c39] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 sm:text-sm"
            >
              বাজারদর দেখুন
              <span className="ml-2" aria-hidden="true">
                
              </span>

                </Link>
          </div>

        
          <div className="relative mx-auto flex w-full max-w-[260px] items-center justify-center sm:max-w-none">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের তাজা পণ্য"
              width={480}
              height={320}
              priority
              sizes="(max-width: 639px) 220px, (max-width: 1023px) 30vw, 260px"
              className="h-auto w-full max-w-[230px] object-contain sm:max-w-[220px] md:max-w-[250px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
