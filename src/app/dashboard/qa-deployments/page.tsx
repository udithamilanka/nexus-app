// app/dashboard/prod-deployments/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Deployment } from "@/types/deployments";

export default function ProdDeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const res = await fetch("/api/deployments?envType=qa");
        if (!res.ok) throw new Error("Failed to fetch deployments");
        const data: Deployment[] = await res.json();
        setDeployments(data);
      } catch (error) {
        console.error("Error loading deployments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  if (deployments.length === 0)
    return <p className="p-6">No production deployments found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Production Deployments</h1>
      <div className="space-y-3">
        {deployments.map((d) => (
          <Link
            key={d._id}
            href={`/dashboard/qa-deployments/${d._id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="font-semibold">{d.projectName}</div>
            <div className="text-sm text-gray-600">{d.projectIdentifier}</div>
            <div className="text-xs text-gray-500 mt-1">
              {d.host} — Branch: {d.branch} — Node {d.nodeVersion}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
