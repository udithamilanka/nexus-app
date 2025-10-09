"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Deployment } from "@/types/deployments";

export default function DeploymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    const fetchDeployment = async () => {
      const res = await fetch(`/api/deployments/${id}`);
      if (res.ok) {
        const data: Deployment = await res.json();
        setDeployment(data);
      }
    };
    fetchDeployment();
  }, [id]);

  const handleDeployClick = () => {
    setLogs([]);
    setDeploying(true);
    const eventSource = new EventSource(`/api/deploy/prod?id=${id}`);

    eventSource.onmessage = (event: MessageEvent) => {
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.onerror = () => {
      setLogs((prev) => [...prev, "❌ Deployment stream closed."]);
      setDeploying(false);
      eventSource.close();
    };
  };

  if (!deployment) return <p className="p-6">Loading deployment...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{deployment.projectName}</h1>
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <p><strong>Identifier:</strong> {deployment.projectIdentifier}</p>
        <p><strong>Host:</strong> {deployment.host}</p>
        <p><strong>Branch:</strong> {deployment.branch}</p>
        <p><strong>Node Version:</strong> {deployment.nodeVersion}</p>
      </div>

      <button
        onClick={handleDeployClick}
        disabled={deploying}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {deploying ? "Deploying..." : "Deploy Now 🚀"}
      </button>

      <div className="mt-6 bg-black text-green-400 p-4 rounded-lg font-mono h-80 overflow-y-scroll whitespace-pre-line">
        {logs.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
