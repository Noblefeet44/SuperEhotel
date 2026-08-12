import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Super E Luxury Hotel",
  description: "Admin dashboard for Super E Luxury Hotel & Suites management",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
