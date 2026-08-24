import type { MetadataRoute } from "next";

import { OG_URL } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: OG_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${OG_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${OG_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${OG_URL}/delete-account`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
