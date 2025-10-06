"use client";

import { useState } from "react";

export default function DeployButton() {
  const [logs, setLogs] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);

  const handleDeployClick = () => {
    setLogs([]);
    setDeploying(true);

    // Connect to the SSE API route for live logs
    const eventSource = new EventSource("/api/deploy");

    eventSource.onmessage = (event: MessageEvent) => {
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.onerror = () => {
      setLogs((prev) => [...prev, "❌ Deployment stream closed."]);
      setDeploying(false);
      eventSource.close();
    };
  };

  return (
    <div>
      <button
        onClick={handleDeployClick}
        disabled={deploying}
        style={{ padding: "10px 20px", marginBottom: "20px", cursor: "pointer" }}
      >
        {deploying ? "Deploying..." : "Deploy Now 🚀"}
      </button>

      <div
        style={{
          whiteSpace: "pre-line",
          fontFamily: "monospace",
          backgroundColor: "#111",
          color: "#0f0",
          padding: "10px",
          borderRadius: "5px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {logs.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
