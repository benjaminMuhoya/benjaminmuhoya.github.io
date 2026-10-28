import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dna,
  ExternalLink,
  FlaskConical,
  Globe2,
  Mail,
  Map,
  Menu,
  Microscope,
  Mouse,
  Waves,
  X,
} from "lucide-react";

const navItems = [
  { label: "A little about me", href: "/" },
  { label: "Research", href: "/research/" },
  { label: "Projects", href: "/projects/" },
  { label: "Publications", href: "/publications/" },
  { label: "Gallery", href: "/gallery/" },
];

const researchInterests = [
  {
    number: "01",
    icon: Microscope,
    title: "Metabolic phenotypes",
    text: "I use NMR and mass spectrometry technologies to quantify metabolic phenotypes, then apply computational and statistical methods to make sense of these complex data.",
  },
  {
    number: "02",
    icon: Dna,
    title: "Gene × environment interactions",
    text: "I am interested in the context dependence of metabolic phenotypes: how much is shaped by environment, genetics, and their interaction.",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Beyond the Western world",
    text: "My work focuses on communities whose lifestyles differ from Western lifestyles and on how lifestyle shifts affect metabolic phenotypes.",
  },
];

const currentProjects = [
  {
    icon: Map,
    eyebrow: "Population biology",
    title: "Turkana health and lifestyle transitions",
    text: "Studying how unique lifestyles and rapid lifestyle change reshape metabolism and cardiometabolic disease risk.",
    image: "/images/turkana_machine.jpg",
    alt: "Field research equipment used during work in Turkana",
  },
  {
    icon: FlaskConical,
    eyebrow: "Molecular phenotyping",
    title: "Targeted and untargeted metabolomics and lipidomics",
    text: "Using mass spectrometry- and NMR-based metabolomic approaches to quantify hundreds of metabolic phenotypes.",
    image: "/images/network_node.png",
    alt: "Metabolic network visualization",
  },
  {
    icon: Waves,
    eyebrow: "Lipid biology",
    title: "Lipoprotein subclasses, diet, and inflammation",
    text: "Using high-resolution NMR technology to investigate how lipoprotein dynamics vary across contexts.",
    image: "/images/apolipo.png",
    alt: "Illustration of apolipoprotein structure and lipid transport",
  },
  {
    icon: Mouse,
    eyebrow: "Experimental models",
    title: "Animal models for studying metabolism",
    text: "Testing inflammation-driven metabolic remodeling under controlled experimental conditions.",
    image: "/images/Mouse_model.png",
    alt: "Diagram of an experimental mouse model",
  },
];

const publications = [
  {
    title: "Built environment is a key driver of cardiometabolic health in two Indigenous groups undergoing rapid lifestyle change.",
    authors: "Watowich M. M., Arner A. M., Wang S., John E., Kahumbu J. C., Kinyua P., Lopurudoi A., Lotukoi F., Mwai C. M., Muhoya B., et al.",
  },
  {
    title: "Urbanization exacerbates age-associated declines in cardiometabolic health in Turkana and Orang Asli.",
    authors: "Watowich M. M., Brassington L., Longtin A., Wang S., Rossow R., Reinhardt K. D., John E., Kahumbu J. C., Kinyua P., Lopurudoi A., Lotukoi F., Miano C., Muhoya B., et al.",
  },
  {
    title: "Adaptations to water stress and pastoralism.",
    authors: "Lea A. J., Caldas I. V., Garske K. M., Kahumbu J., Kinyua P., Miano C., Muhoya B., Peng J., Rabinowitz J. D., Roichman A., et al.",
  },
  {
    title: "Socioeconomic status effects on health vary between rural and urban Turkana.",
    authors: "Lea A. J., Waigwa C., Muhoya B., Lotukoi F., Peng J., Henry L., Abhyankar V., et al.",
  },
  {
    title: "Sex differences in immune function and disease risk are not easily explained by an evolutionary mismatch.",
    authors: "Arner A. M., Muhoya B., Snyder-Mackler N., Ayroles J. F., & Lea A. J.",
  },
];

const galleryImages = [
  { src: "/images/cshl.jpg", caption: "Meetings and learning" },
  { src: "/images/teaching_field_course.jpg", caption: "Heading to Turkana with Emma and Thomas" },
  { src: "/images/turkana_landscape.jpg", caption: "A warm welcome from the Turkana" },
  { src: "/images/turkana_machine.jpg", caption: "Real-time lifestyle transitions" },
  { src: "/images/Turkana_home.jpg", caption: "A unique lifestyle" },
  { src: "/images/presentation.jpg", caption: "Presenting our work at Mpala Research Centre" },
  { src: "/images/lab_microscope.jpg", caption: "The Laikipia Governor visits the lab" },
  { src: "/images/snow_princeton.jpg", caption: "Meeting a snowwoman for the first time at Princeton" },
  { src: "/images/lab_photo.jpg", caption: "The lab, where the magic happens" },
  { src: "/images/podcast_princeton.jpg", caption: "Science communication" },
  { src: "/images/fieldwork_turkana_group.jpg", caption: "The field team in Kenya" },
  { src: "/images/ayroles_lab.jpg", caption: "The Ayroles Lab" },
];

const formatAuthors = (authors) =>
  authors.split(/(Muhoya)/gi).map((part, index) =>
    part.toLowerCase() === "muhoya" ? (
      <strong key={`${part}-${index}`} className="font-semibold text-[#20231f]">Muhoya</strong>
    ) : part,
  );

const pageForPath = (pathname) => {
  const normalized = pathname.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
  return {
    "/": "home",
    "/research": "research",
    "/projects": "projects",
    "/publications": "publications",
    "/gallery": "gallery",
  }[normalized];
};

const ImageBlock = ({ src, alt, className = "", imgClassName = "" }) => (
  <figure className={`overflow-hidden bg-[#e9eadf] ${className}`}>
    <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${imgClassName}`} />
  </figure>
);

const LinkButton = ({ href, children, variant = "solid", external = false }) => {
  const styles = variant === "outline"
    ? "border border-[#9aaa88]/50 bg-white/70 text-[#263028] hover:border-[#8a6f2c] hover:bg-[#f8f2df]"
    : "bg-[#637357] text-white shadow-sm hover:bg-[#4f6046]";
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${styles}`}>
      {children}
    </a>
  );
};

const SectionKicker = ({ children }) => (
  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a6f2c]">{children}</p>
);

function SiteHeader({ page }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#20231f]/10 bg-[#fbfaf4]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <a href="/" className="group inline-flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8fa37d] transition group-hover:bg-[#b78b35]" />
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#20231f]">Benjamin Muhoya</span>
        </a>
        <div className="hidden items-center gap-1 rounded-full border border-[#20231f]/10 bg-white/70 p-1 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} aria-current={page === pageForPath(item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition ${page === pageForPath(item.href) ? "bg-[#637357] text-white" : "text-[#4c5348] hover:bg-[#e9eadf] hover:text-[#20231f]"}`}>
              {item.label}
            </a>
          ))}
        </div>
        <button type="button" onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#20231f]/10 bg-white text-[#20231f] md:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-[#20231f]/10 bg-[#fbfaf4] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} aria-current={page === pageForPath(item.href) ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-sm ${page === pageForPath(item.href) ? "bg-[#637357] text-white" : "bg-white text-[#4c5348]"}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function PageIntro({ kicker, title, text }) {
  return (
    <section className="px-4 pb-12 pt-32 sm:px-6 sm:pb-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {kicker && <SectionKicker>{kicker}</SectionKicker>}
        {title && text ? (
          <div className="grid gap-7 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg leading-8 text-[#5d6658]">{text}</p>
          </div>
        ) : title ? (
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">{title}</h1>
        ) : (
          <p className="max-w-2xl text-lg leading-8 text-[#5d6658]">{text}</p>
        )}
      </div>
    </section>
  );
}

function ProfileContact() {
  const [contactsOpen, setContactsOpen] = useState(false);
  const mobilePanelRef = useRef(null);

  useEffect(() => {
    if (!contactsOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setContactsOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!mobilePanelRef.current?.contains(event.target)) setContactsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [contactsOpen]);

  const contactLinks = (mobile = false) => (
    <div className={`flex gap-2 ${mobile ? "flex-col [&>a]:w-full" : "mt-6 flex-wrap justify-center xl:[&>a]:w-full"}`}>
      <LinkButton href="mailto:bm0211@princeton.edu"><Mail className="h-4 w-4" />Email</LinkButton>
      <LinkButton href="https://scholar.google.com/citations?user=0tp-g1cAAAAJ&hl=en&oi=ao" variant="outline" external>Google Scholar <ExternalLink className="h-4 w-4" /></LinkButton>
      <LinkButton href="https://orcid.org/0000-0003-2228-3649" variant="outline" external>ORCID <ExternalLink className="h-4 w-4" /></LinkButton>
      <LinkButton href="https://www.linkedin.com/in/benjamin-muhoya/" variant="outline" external>LinkedIn <ExternalLink className="h-4 w-4" /></LinkButton>
      <LinkButton href="/Benjamin_Muhoya_CV.pdf" variant="outline" external>View CV <ArrowUpRight className="h-4 w-4" /></LinkButton>
    </div>
  );

  return (
    <aside
      className="sticky top-[73px] z-40 px-4 py-3 sm:px-6 xl:fixed xl:right-5 xl:top-24 xl:z-30 xl:max-h-[calc(100vh-7rem)] xl:w-[300px] xl:overflow-y-auto xl:px-0 xl:py-0"
      aria-label="Profile and contact information"
    >
      <div ref={mobilePanelRef} className="relative mx-auto max-w-7xl xl:hidden">
        <div className="flex items-center gap-2 rounded-[1.4rem] border border-[#20231f]/10 bg-[#eef0e6]/95 p-2.5 shadow-sm backdrop-blur-xl">
          <ImageBlock src="/images/Cover_home_page.jpg" alt="Benjamin Muhoya in the laboratory"
            className="h-12 w-12 shrink-0 rounded-full border-2 border-white shadow-sm"
            imgClassName="object-[center_38%]" />
          <p className="min-w-0 flex-1 text-sm font-semibold leading-tight tracking-[-0.02em] sm:text-base">Benjamin Muhoya</p>
          <button type="button" onClick={() => setContactsOpen((open) => !open)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#637357] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f6046] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#637357]"
            aria-expanded={contactsOpen} aria-controls="mobile-contact-menu">
            Contacts
            <ChevronDown className={`h-4 w-4 transition-transform ${contactsOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        {contactsOpen && (
          <div id="mobile-contact-menu" className="absolute right-0 top-[calc(100%+0.5rem)] w-full max-w-sm rounded-[1.5rem] border border-[#20231f]/10 bg-[#fbfaf4] p-3 shadow-xl">
            {contactLinks(true)}
          </div>
        )}
      </div>

      <div className="hidden rounded-[2rem] border border-[#20231f]/10 bg-[#eef0e6] p-6 text-center shadow-sm xl:block">
        <ImageBlock src="/images/Cover_home_page.jpg" alt="Benjamin Muhoya in the laboratory"
          className="mx-auto h-32 w-32 rounded-full border-4 border-white shadow-sm"
          imgClassName="object-[center_38%]" />
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6f2c]">Profile & contact</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Benjamin Muhoya</h2>
          <p className="mt-3 text-sm leading-6 text-[#4c5348]">PhD student in Ecology and Evolutionary Biology studying metabolic phenotypes in environmental and genetic context.</p>
          {contactLinks()}
        </div>
      </div>
    </aside>
  );
}

function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-14 pt-32 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[#e9eadf] blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Studying how different environments shape human biology.</h1>
              <div>
                <p className="text-lg leading-8 text-[#4c5348]">I am a grad student in Ecology and Evolutionary Biology, combining field-based research in remote locations & treatment-control experiments in the lab with high-resolution metabolomics techniques, genomics, and strong computational and statistical techniques to study how metabolic phenotypes are shaped by environments, genetics, and their interaction.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <LinkButton href="/research/">Explore my research <ArrowRight className="h-4 w-4" /></LinkButton>
                  <LinkButton href="/Benjamin_Muhoya_CV.pdf" variant="outline" external>View CV <ArrowUpRight className="h-4 w-4" /></LinkButton>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mt-12 min-h-[520px] overflow-hidden rounded-[2.6rem] border border-[#20231f]/10 bg-[#20231f] shadow-sm sm:min-h-[620px]">
            <img src="/images/landscape-original-20220621.jpg" alt="Original arid northern Kenya landscape overlaid with a metabolite network and five pathway labels" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/images/metabolite-network-overlay-v1.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f271e]/68 via-[#293328]/20 to-transparent" />
            <div className="relative z-10 flex min-h-[520px] max-w-2xl flex-col justify-end p-7 text-white sm:min-h-[620px] sm:p-12 lg:p-16">
              <h2 className="whitespace-nowrap text-[2rem] font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">Using Metabolomics</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">to explore metabolic signatures of varying environmental exposures.</p>
            </div>
          </motion.div>
          <p className="mt-3 pr-2 text-right text-xs font-normal leading-5 text-[#20231f] sm:pr-4 sm:text-sm">
            Lobopakeyu range of hills located in Turkana County, Kenya. Photo by Benjamin Muhoya.
          </p>
        </div>
      </section>
    </>
  );
}

function ResearchPage() {
  return (
    <>
      <PageIntro title="Gene × environment interactions, read through metabolism."
        text="My research connects lifestyle variation, metabolomics, genomics, and computational analysis to understand how human metabolic phenotypes vary across contexts." />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="overflow-hidden rounded-[2.3rem] border border-[#20231f]/10 bg-white p-3 shadow-sm lg:sticky lg:top-28 lg:h-fit">
            <ImageBlock src="/images/lifestyle_graphic.png" alt="Graphic contrasting pastoral and urban lifestyles" className="aspect-[3/2] rounded-[1.7rem]" imgClassName="!object-contain" />
            <div className="p-5 sm:p-7">
              <SectionKicker>Overarching question</SectionKicker>
              <p className="text-2xl font-semibold leading-snug tracking-[-0.03em]">How do unique lifestyles shape the metabolome, and what happens to metabolic health during and after lifestyle transitions?</p>
            </div>
          </div>
          <div className="space-y-5">
            {researchInterests.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="rounded-[2rem] border border-[#20231f]/10 bg-white p-7 shadow-sm sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0e6] text-[#637357]"><Icon className="h-5 w-5" /></span>
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#8a6f2c]">{item.number}</span>
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">{item.title}</h2>
                  <p className="mt-4 text-base leading-8 text-[#4c5348]">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectsPage() {
  return (
    <>
      <PageIntro title="Projects I am actively working on" />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {currentProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.article key={project.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group overflow-hidden rounded-[2rem] border border-[#20231f]/10 bg-white shadow-sm">
                <ImageBlock src={project.image} alt={project.alt} className="aspect-[4/3] rounded-none" imgClassName="!object-cover transition duration-700 group-hover:scale-[1.015]" />
                <div className="p-7 sm:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#637357]"><Icon className="h-4 w-4" />{project.eyebrow}</span>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em]">{project.title}</h2>
                  <p className="mt-4 text-base leading-8 text-[#4c5348]">{project.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function PublicationsPage() {
  return (
    <>
      <PageIntro title="Manuscripts and Published Works" />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <article className="mx-auto mb-6 grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#20231f]/10 bg-[#f7efd9] shadow-sm sm:grid-cols-[0.48fr_0.52fr]">
          <ImageBlock src="/images/Sciencelargecover.jpg" alt="Science cover featuring young Turkana herders guiding camels at sunset" className="min-h-[520px] rounded-none" imgClassName="!object-cover object-top" />
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <SectionKicker>Science cover</SectionKicker>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Adaptations to water stress and pastoralism</h2>
            <p className="mt-5 text-base leading-8 text-[#4c5348]">
              <strong className="font-semibold text-[#20231f]">COVER:</strong> Young Turkana herders guide camels across Kenya’s arid landscape near Lake Turkana at sunset. Pastoralism remains central to survival in this region, where heat and water scarcity pose constant challenges. New research uncovers the genetic signatures that underlie adaptation to arid living in this pastoralist community. In pages{" "}
              <a className="font-semibold text-[#637357] underline decoration-[#8a6f2c]/50 underline-offset-4 hover:text-[#3f5039]" href="https://www.science.org/doi/10.1126/science.aeb2287" target="_blank" rel="noreferrer">1191</a>{" "}
              and{" "}
              <a className="font-semibold text-[#637357] underline decoration-[#8a6f2c]/50 underline-offset-4 hover:text-[#3f5039]" href="https://www.science.org/doi/10.1126/science.adv2467" target="_blank" rel="noreferrer">1246</a>{" "}
              of this issue.
            </p>
            <p className="mt-5 border-t border-[#8a6f2c]/20 pt-4 text-sm italic leading-6 text-[#5d6658]">Photo: Kirsten Frost/FROST Photo Tours</p>
          </div>
        </article>
        <div className="mx-auto max-w-7xl divide-y divide-[#20231f]/10 overflow-hidden rounded-[2rem] border border-[#20231f]/10 bg-white shadow-sm">
          {publications.map((item, index) => (
            <article key={item.title} className="grid gap-5 p-6 transition hover:bg-[#fbfaf4] md:grid-cols-[4rem_1fr] md:p-8">
              <span className="text-sm font-semibold tracking-[0.2em] text-[#8a6f2c]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-semibold leading-snug tracking-[-0.02em]">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#5d6658]">{formatAuthors(item.authors)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [transitionDuration, setTransitionDuration] = useState(5.2);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const manualPauseTimeoutRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || hovered || focusWithin || manualPause) return undefined;
    let interval;
    const advance = () => {
      setTransitionDuration(5.2);
      setDirection(1);
      setActiveIndex((index) => (index + 1) % galleryImages.length);
    };
    const start = window.setTimeout(() => {
      advance();
      interval = window.setInterval(advance, 5200);
    }, 120);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [focusWithin, hovered, manualPause, shouldReduceMotion]);

  useEffect(() => () => window.clearTimeout(manualPauseTimeoutRef.current), []);

  const moveCarousel = (step) => {
    setTransitionDuration(shouldReduceMotion ? 0 : 0.65);
    setDirection(step);
    setActiveIndex((index) => (index + step + galleryImages.length) % galleryImages.length);
    setManualPause(true);
    window.clearTimeout(manualPauseTimeoutRef.current);
    manualPauseTimeoutRef.current = window.setTimeout(() => setManualPause(false), 8000);
  };

  const activeImage = galleryImages[activeIndex];
  const visibleSlides = [-1, 0, 1].map((offset) => ({
    ...galleryImages[(activeIndex + offset + galleryImages.length) % galleryImages.length],
    offset,
  }));
  const slideVariants = {
    enter: ({ offset, travelDirection }) => ({
      x: `${(offset + travelDirection) * 34}%`,
      opacity: 0,
      scale: 0.8,
    }),
    visible: ({ offset }) => ({
      x: `${offset * 34}%`,
      opacity: offset === 0 ? 1 : 0.36,
      scale: offset === 0 ? 1 : 0.86,
    }),
    exit: {
      opacity: 0,
      scale: 0.78,
    },
  };

  return (
    <>
      <PageIntro kicker="Gallery"
        text="Scenes from the field, the team behind the work, adorable moments and so on ..." />
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl" role="region" aria-roledescription="carousel" aria-label="Fieldwork and research gallery"
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
          }}>
          <div className="overflow-hidden rounded-[2.4rem] border border-[#20231f]/10 bg-white p-3 shadow-sm sm:p-4">
            <motion.div className="relative mx-auto h-[260px] max-w-5xl cursor-grab overflow-hidden rounded-[1.8rem] bg-[#eef0e6] active:cursor-grabbing sm:h-[320px] lg:h-[360px]"
              drag={shouldReduceMotion ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -55) moveCarousel(1);
                if (info.offset.x > 55) moveCarousel(-1);
              }}>
              <AnimatePresence initial={false}>
                {visibleSlides.map((image) => (
                  <motion.div key={image.src} className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    custom={{ offset: image.offset, travelDirection: direction }} variants={slideVariants}
                    initial="enter" animate="visible" exit="exit"
                    transition={{ duration: shouldReduceMotion ? 0 : transitionDuration, ease: transitionDuration > 1 ? "linear" : [0.22, 1, 0.36, 1] }}
                    style={{ zIndex: image.offset === 0 ? 2 : 1 }}>
                    <figure className="h-[82%] w-[68%] overflow-hidden rounded-[1.4rem] bg-[#e9eadf] shadow-sm sm:w-[50%] lg:w-[44%]">
                      <img src={image.src} alt={image.offset === 0 ? image.caption : ""} aria-hidden={image.offset !== 0}
                        className="h-full w-full object-cover" />
                    </figure>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence initial={false} mode="wait">
              <motion.div key={activeImage.src} className="flex min-h-20 items-center justify-between gap-5 px-3 py-5 sm:px-5"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.38, delay: shouldReduceMotion ? 0 : 0.18 }}
                aria-live="polite" aria-atomic="true">
                <span className="text-base leading-7 text-[#4c5348] sm:text-lg">{activeImage.caption}</span>
                <span className="shrink-0 text-xs font-semibold tracking-[0.16em] text-[#8a6f2c]">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => moveCarousel(-1)} aria-label="Show previous gallery image"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#9aaa88]/50 bg-white px-5 text-sm font-semibold text-[#263028] transition hover:border-[#8a6f2c] hover:bg-[#f8f2df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#637357]">
              <ChevronLeft className="h-5 w-5" /> Previous
            </button>
            <button type="button" onClick={() => moveCarousel(1)} aria-label="Show next gallery image"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#637357] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f6046] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#637357]">
              Next <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="px-4 pb-24 pt-40 text-center sm:px-6">
      <SectionKicker>404</SectionKicker>
      <h1 className="text-5xl font-semibold tracking-[-0.05em]">Page not found</h1>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#5d6658]">The page you requested does not exist.</p>
      <div className="mt-8"><LinkButton href="/">Return home</LinkButton></div>
    </section>
  );
}

const pages = {
  home: { component: HomePage, title: "Benjamin Muhoya | Human Biology & Metabolomics" },
  research: { component: ResearchPage, title: "Research | Benjamin Muhoya" },
  projects: { component: ProjectsPage, title: "Projects | Benjamin Muhoya" },
  publications: { component: PublicationsPage, title: "Publications | Benjamin Muhoya" },
  gallery: { component: GalleryPage, title: "Gallery | Benjamin Muhoya" },
};

export default function PersonalWebsite() {
  const page = pageForPath(window.location.pathname);
  const Page = pages[page]?.component || NotFoundPage;
  useEffect(() => {
    document.title = pages[page]?.title || "Page not found | Benjamin Muhoya";
    window.scrollTo(0, 0);
  }, [page]);
  return (
    <div className="min-h-screen bg-[#fbfaf4] text-[#20231f]">
      <SiteHeader page={page} />
      <main className={page ? "xl:pr-[330px]" : ""}>{page && <ProfileContact />}<Page /></main>
      <footer className={`border-t border-[#20231f]/10 px-4 py-8 sm:px-6 lg:px-8 ${page ? "xl:pr-[350px]" : ""}`}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-[#5d6658] sm:flex-row">
          <p>© 2026 Benjamin Muhoya.</p>
          <p>Context dependency of metabolism</p>
        </div>
      </footer>
    </div>
  );
}
