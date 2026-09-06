import { readContent } from "@/lib/content";
import SiteApp from "@/components/SiteApp";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const content = readContent();
  return <SiteApp content={content} />;
}
