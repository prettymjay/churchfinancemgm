export default function Card({ title, value, extra, color }: any) {
  return (
    <div className={`card ${color}`}>
      <p className="card-title">{title}</p>
      <h2>{value}</h2>
      {extra && <span className="extra">{extra}</span>}
    </div>
  );
}