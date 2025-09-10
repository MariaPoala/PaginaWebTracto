// CardsGrid.tsx
type Item = {
  id: number;
  image: string;
  title: string;
  text: string;
  cta: string;
  href?: string;
  onClick?: () => void;
};

const items: Item[] = [
 { id: 1, image: "https://picsum.photos/640/360?random=1", title: "Card 1", text: "Descripción breve 1", cta: "Ver más", href: "#" },
  { id: 2, image: "https://picsum.photos/640/360?random=2", title: "Card 2", text: "Descripción breve 2", cta: "Ver más", href: "#" },
  { id: 3, image: "https://picsum.photos/640/360?random=3", title: "Card 3", text: "Descripción breve 3", cta: "Ver más", href: "#" },
  { id: 4, image: "https://picsum.photos/640/360?random=4", title: "Card 4", text: "Descripción breve 4", cta: "Ver más", href: "#" },
  { id: 5, image: "https://picsum.photos/640/360?random=5", title: "Card 5", text: "Descripción breve 5", cta: "Ver más", href: "#" },
  { id: 6, image: "https://picsum.photos/640/360?random=6", title: "Card 6", text: "Descripción breve 6", cta: "Ver más", href: "#" },
  { id: 7, image: "https://picsum.photos/640/360?random=7", title: "Card 7", text: "Descripción breve 7", cta: "Ver más", href: "#" },
  { id: 8, image: "https://picsum.photos/640/360?random=8", title: "Card 8", text: "Descripción breve 8", cta: "Ver más", href: "#" },

];

export default function CardsService() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-4">
      {items.map((it) => (
        <Card key={it.id} {...it} />
      ))}
    </div>
  );
}

function Card({ image, title, text, cta, href, onClick }: Item) {
  const CtaTag: any = href ? "a" : "button";

  return (
    <div
      className="group max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      role="group"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{text}</p>

        <div className="mt-4">
          <CtaTag
            {...(href ? { href } : { type: "button", onClick })}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:bg-gray-100 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus-visible:ring-offset-neutral-900"
            aria-label={cta}
          >
            {cta}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M13.5 4.5a.75.75 0 0 1 .75-.75H19.5a.75.75 0 0 1 .75.75V9a.75.75 0 0 1-1.5 0V6.31l-7.22 7.22a.75.75 0 1 1-1.06-1.06l7.22-7.22H14.25a.75.75 0 0 1-.75-.75Z" />
              <path d="M5.25 6.75A2.25 2.25 0 0 0 3 9v9.75A2.25 2.25 0 0 0 5.25 21h9.75A2.25 2.25 0 0 0 17.25 18.75V12a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75H12a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
          </CtaTag>
        </div>
      </div>
    </div>
  );
}
