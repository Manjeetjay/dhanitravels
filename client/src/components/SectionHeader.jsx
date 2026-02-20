import { motion } from "framer-motion";

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col gap-3"
    >
      {eyebrow ? (
        <span className="inline-flex w-fit rounded-full bg-brand-citrus/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-clay">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-bold leading-tight text-brand-charcoal sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="gold-line mt-1" />
      {subtitle ? (
        <p className="max-w-3xl text-sm leading-relaxed text-brand-charcoal/65 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

export default SectionHeader;
