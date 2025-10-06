"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { DeploymentForm, DeploymentResponse } from "@/types/deployments";

export default function CreateDeploymentPage() {
  const router = useRouter();

  const [form, setForm] = useState<DeploymentForm>({
    projectName: "",
    projectIdentifier: "",
    type: "nextjs",
    host: "",
    user: "",
    port: "22",
    hostedPath: "",
    nodeVersion: "20",
    branch: "production",
    envType: "prod",
  });

  const [loading, setLoading] = useState(false);

  // Handle input & select field updates
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create deployment");

      const data: DeploymentResponse = await res.json();
      console.log("Created deployment:", data);

      // Navigate to the environment’s deployment list
      router.push(`/dashboard/${form.envType}-deployments`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create deployment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Create Deployment</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-6 rounded-xl shadow bg-white"
      >
        {(
          [
            "projectName",
            "projectIdentifier",
            "host",
            "user",
            "port",
            "hostedPath",
            "nodeVersion",
            "branch",
          ] as (keyof DeploymentForm)[]
        ).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">
              {field}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">Environment</label>
          <select
            name="envType"
            value={form.envType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="dev">Dev</option>
            <option value="qa">QA</option>
            <option value="prod">Prod</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Deployment"}
        </button>
      </form>
    </div>
  );
}
