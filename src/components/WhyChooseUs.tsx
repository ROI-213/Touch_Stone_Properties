import { resolveLocalImage, siteImages } from "@/data/siteImages";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Shield } from "lucide-react";
import { useAboutContent } from "@/hooks/useSiteSettings";

function resolveIcon(name: string) {
  const Icon = (LucideIcons as any)[name];
  return (Icon ?? Shield) as React.ComponentType<{ size?: number }>;
}

export function WhyChooseUs() {
  const { content } = useAboutContent();
  const features = content.why_us_features;
  return (
    <section className="bg-sand px-6 py-16 md:py-20">
      <div className="mx-auto grid w-full items-center gap-12 lg:grid-cols-2">
        {/* Left photo */}
        <motion.div
          initial={{ x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -left-6 -top-6 hidden h-48 w-48 grid-pattern md:block" />
          <img
            src={resolveLocalImage(content.photo_url, siteImages.hero.welcome)}
            alt="Luxury interior"
            className="relative h-[500px] w-full rounded-[12px] object-cover shadow-elevated"
          />
          <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 grid-pattern md:block" />
        </motion.div>

        {/* Right copy */}
        <div>
          <motion.h2
            initial={{ y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[42px] font-bold text-charcoal"
          >
            {content.heading}
          </motion.h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-charcoal/70">
            {content.intro}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => {
              const Icon = resolveIcon(f.icon);
              return (
                <motion.div
                  key={`${f.title}-${i}`}
                  initial={{ y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-[10px] border-l-4 border-gold bg-white p-5 shadow-card"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 text-gold">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-sans text-[17px] font-bold text-charcoal">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/65">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
