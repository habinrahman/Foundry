import { AppProviders } from "@/components/providers/app-providers";

export default function FoundryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders>{children}</AppProviders>;
}
