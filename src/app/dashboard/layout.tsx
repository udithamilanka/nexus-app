import { redirect } from "next/navigation";
import { getAuthToken, verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LogoutButton from "@/components/LogoutButton";

import { DashboardUser } from "@/types/user";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const decoded = verifyToken(token);
  if (!decoded) redirect("/login");

  await connectDB();
  const user = await User.findById(decoded.userId).select("-password").lean<DashboardUser>();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={JSON.parse(JSON.stringify(user))} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-sm px-6 h-16 flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">Overview</h1>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </nav>
        <div className="p-7">
          {children}
        </div>
      </div>
    </div>
  );
}