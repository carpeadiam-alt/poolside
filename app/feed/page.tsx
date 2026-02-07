"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  username: string;
}

interface FeedCard {
  page_id: number;
  title: string;
  display_title?: string;
  summary?: string;
  image?: string;
  link?: string;
  source: "taste" | "explore";
}

export default function FeedPage() {
  const router = useRouter();
  const [cards, setCards] = useState<FeedCard[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      router.push("/login");
      return;
    }

    const u = JSON.parse(raw) as User;
    setUser(u);

    fetch(`https://thecodeworks.in/pool/feed?user_id=${u.user_id}`)
      .then((res) => res.json())
      .then((data: FeedCard[]) => setCards(data));
  }, []);

  /* -------------------------
     ACTION HANDLERS
  ------------------------- */

  function markSeen(card: FeedCard) {
    if (!user) return;

    fetch(`https://thecodeworks.in/pool/seen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        page_id: card.page_id,
      }),
    });
  }

  function likeArticle(card: FeedCard) {
    if (!user) return;

    fetch(`https://thecodeworks.in/pool/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        page_id: card.page_id,
      }),
    });
  }

  function bookmarkArticle(card: FeedCard) {
    if (!user) return;

    fetch(`https://thecodeworks.in/pool/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        page_id: card.page_id,
      }),
    });
  }

  function openArticle(card: FeedCard) {
    markSeen(card);

    // Navigate to reader
    router.push(`/article/${encodeURIComponent(card.title)}`);
  }

  /* -------------------------
     RENDER
  ------------------------- */

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Feed</h1>

      {cards.map((card) => (
        <div
          key={card.page_id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 20,
          }}
        >
          {card.image && (
            <img src={card.image} width={220} alt={card.display_title} />
          )}

          <h3>{card.display_title || card.title.replaceAll("_", " ")}</h3>

          {card.summary && <p>{card.summary}</p>}

          <small>
            {card.source === "explore" ? "🌍 Explore" : "🎯 For you"}
          </small> 

          <div style={{ marginTop: 10 }}>
            <button onClick={() => openArticle(card)}>Read</button>
            <button onClick={() => likeArticle(card)} style={{ marginLeft: 8 }}>
              👍 Like
            </button>
            <button
              onClick={() => bookmarkArticle(card)}
              style={{ marginLeft: 8 }}
            >
              🔖 Bookmark
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
