"use client";

import { useParams } from "next/navigation";

export default function ArticlePage() {
  const params = useParams();
  const title = decodeURIComponent(params.title as string);

  return (
    <div style={{ padding: 40 }}>
      <h1>{title}</h1>

      <p>Custom reader coming soon.</p>

      <a
        href={`https://en.wikipedia.org/wiki/${title.replaceAll(" ", "_")}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open on Wikipedia
      </a>
    </div>
  );
}
