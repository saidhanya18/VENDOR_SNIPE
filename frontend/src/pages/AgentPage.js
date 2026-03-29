import { useState } from "react";

function AgentPage({ goNext }) {
  const [logs, setLogs] = useState([]);

  const runAgent = () => {
    const eventSource = new EventSource("http://localhost:5000/run-agent");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.log) {
        setLogs((prev) => [...prev, data.log]);
      }

      if (data.result) {
        eventSource.close();
        goNext(data.result);
      }
    };
  };

  return (
    <div>
      <h2> AI Agent Execution</h2>

      <button onClick={runAgent}>Start Agent</button>

      {logs.map((log, i) => (
        <p key={i}>{log}</p>
      ))}
    </div>
  );
}

export default AgentPage;