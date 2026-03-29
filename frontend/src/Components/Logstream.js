function LogStream({ logs }) {
  return (
    <div style={{ background: "#111", color: "#0f0", padding: "10px" }}>
      {logs.map((log, i) => (
        <p key={i}>{log}</p>
      ))}
    </div>
  );
}
export default LogStream;