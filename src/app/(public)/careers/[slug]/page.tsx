import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleDetail } from "@/components/careers/role-detail";
import { CAREERS_ROLES, getRoleBySlug } from "@/data/careers/roles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CAREERS_ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) return { title: "Role not found" };
  return {
    title: role.title,
    description: role.summary,
  };
}

export default async function CareerRolePage({ params }: Props) {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) notFound();

  return <RoleDetail role={role} />;
}
