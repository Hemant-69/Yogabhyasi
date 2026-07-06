import { redirect } from "next/navigation";

interface AdminPageProps {
  params: Promise<{ adminPath: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { adminPath } = await params;
  redirect(`/${adminPath}/dashboard`);
}
