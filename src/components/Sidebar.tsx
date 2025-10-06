import Link from "next/link";
import { DashboardUser } from "@/types/user";

export default function Sidebar({ user }: { user: DashboardUser }) {
  // Define slugs and labels explicitly
  const NAV_ITEMS: Record<
    string,
    { label: string; slug: string }[]
  > = {
    admin: [
      { label: "Overview", slug: "" },
      { label: "Dev Deployments", slug: "dev-deployments" },
      { label: "QA Deployments", slug: "qa-deployments" },
      { label: "Prod Deployments", slug: "prod-deployments" },
      { label: "Create Deployment", slug: "create-deployment" },
      { label: "Users", slug: "users" },
      { label: "Reports", slug: "reports" },
      { label: "Settings", slug: "settings" },
    ],
    qa: [
      { label: "Overview", slug: "" },
      { label: "QA Deployments", slug: "qa-deployments" },
    ],
    developer: [
      { label: "Overview", slug: "" },
      { label: "Dev Deployments", slug: "dev-deployments" },
    ],
    devops: [
      { label: "Overview", slug: "" },
      { label: "Create Deployment", slug: "create-deployment" },
      { label: "Prod Deployments", slug: "prod-deployments" },
    ],
  };

  const items = NAV_ITEMS[user.role] || [{ label: "Overview", slug: "overview" }];

  return (
    <aside className="w-64 bg-white border-r shadow-sm h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
      </div>

      <nav className="mt-4">
        {items.map(({ label, slug }) => (
          <Link
            key={slug}
            href={`/dashboard/${slug}`}
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
