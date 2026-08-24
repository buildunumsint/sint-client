import type { MetadataRoute } from "next";

import { OG_URL } from "./layout";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/auth"],
    },
    sitemap: `${OG_URL}/sitemap.xml`,
  };
}
