function ResultCard({ data }) {
  return (
    <div style={{ border: "1px solid", padding: "10px", margin: "10px" }}>
      <h3>{data.name}</h3>
      <p>⭐ {data.rating}</p>
    </div>
  );
}
export default ResultCard;