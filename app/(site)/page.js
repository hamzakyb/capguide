import { readContent } from "@/lib/content";
import SiteApp from "@/components/SiteApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();
  return <SiteApp content={content} />;
}
