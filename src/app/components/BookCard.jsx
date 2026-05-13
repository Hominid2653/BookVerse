export default function BookCard({ image, title, author }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/5] overflow-hidden bg-slate-950">
        <img
          src={image}
          alt={`Cover of ${title}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-slate-500">{author}</p>
        <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
      </div>
    </article>
  )
}
