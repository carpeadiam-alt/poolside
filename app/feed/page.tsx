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

  function openArticle(card: FeedCard) {
    if (!user) return;

    fetch(`https://thecodeworks.in/pool/seen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        page_id: card.page_id,
      }),
    });

    router.push(`/article/${encodeURIComponent(card.title)}`);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Feed</h1>

      {cards.map((card) => (
        <div
          key={card.page_id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginBottom: 16,
          }}
        >
          {card.image && (
            <img src={card.image} width={200} alt={card.title} />
          )}

          <h3>{card.title}</h3>
          <p>{card.summary}</p>

          <small>
            {card.source === "explore" ? "🌍 Explore" : "🎯 For you"}
          </small>
          <br />

          <button onClick={() => openArticle(card)}>Read</button>
        </div>
      ))}
    </div>
  );
}
