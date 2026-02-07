"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  username: string;
}

interface Bookmark {
  page_id: number;
  title: string;
}

export default function BookmarksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      router.push("/login");
      return;
    }

    const u = JSON.parse(raw) as User;
    setUser(u);

    fetch(`https://thecodeworks.in/pool/bookmarks?user_id=${u.user_id}`)
      .then((res) => res.json())
      .then((data: Bookmark[]) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function openArticle(title: string) {
    router.push(`/article/${encodeURIComponent(title)}`);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Bookmarks</h1>

      {loading && <p>Loading…</p>}

      {!loading && bookmarks.length === 0 && (
        <p>No bookmarks yet.</p>
      )}

      <ul style={{ paddingLeft: 20 }}>
        {bookmarks.map((b) => (
          <li
            key={b.page_id}
            style={{ marginBottom: 10, cursor: "pointer" }}
            onClick={() => openArticle(b.title)}
          >
            {b.title.replaceAll("_", " ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
