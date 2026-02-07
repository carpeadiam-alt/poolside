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
    router.push(`/article/${encodeURIComponent(card.title)}`);
  }

  /* -------------------------
     RENDER
  ------------------------- */

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
      `}</style>

      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        fontFamily: "'DM Mono', monospace"
      }}>
        {/* Top Navigation Bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundSize: 'cover',
          backgroundImage: 'url(https://thecodeworks.in/pool_bar.png)',
          backgroundPosition: 'center',
          borderBottom: '1px solid #e5e5e5',
          
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h1 style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: '32px',
              fontWeight: 400,
              margin: 0,
              color: '#000000',
              letterSpacing: '-0.5px',
            }}>
              Feed
            </h1>
            
            <button
              onClick={() => router.push('/bookmarks')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                padding: '10px 24px',
                fontSize: '14px',
                fontFamily: "'DM Mono', monospace",
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#000000',
                fontWeight: 400,
                letterSpacing: '0.5px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }}
            >
              BOOKMARKS
            </button>
          </div>
        </header>

        {/* Feed Content */}
        <main style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '60px 40px',
        }}>
          {cards.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#666666',
              fontSize: '14px',
            }}>
              Loading your feed...
            </div>
          ) : (
            cards.map((card) => (
              <article
                key={card.page_id}
                style={{
                  marginBottom: '48px',
                  paddingBottom: '48px',
                  borderBottom: '1px solid #e5e5e5',
                }}
              >
                {/* Source Tag */}
                <div style={{
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  color: '#666666',
                  fontWeight: 500,
                }}>
                  {card.source === "explore" ? "Explore" : "For You"}
                </div>

                {/* Article Image */}
                {card.image && (
                  <div 
                    onClick={() => openArticle(card)}
                    style={{
                      marginBottom: '20px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.display_title || card.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                )}

                {/* Article Title */}
                <h2
                  onClick={() => openArticle(card)}
                  style={{
                    fontFamily: "'DM Serif Text', serif",
                    fontSize: '28px',
                    fontWeight: 400,
                    lineHeight: '1.3',
                    margin: '0 0 16px 0',
                    color: '#000000',
                    cursor: 'pointer',
                    letterSpacing: '-0.3px',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  {card.display_title || card.title.replaceAll("_", " ")}
                </h2>

                {/* Summary */}
                {card.summary && (
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: '#333333',
                    margin: '0 0 24px 0',
                    fontWeight: 300,
                  }}>
                    {card.summary}
                  </p>
                )}

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}>
                  <button
                    onClick={() => openArticle(card)}
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontFamily: "'DM Mono', monospace",
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.5px',
                      fontWeight: 400,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#333333';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                    }}
                  >
                    READ
                  </button>

                  <button
                    onClick={() => likeArticle(card)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#000000',
                      border: '1px solid #d0d0d0',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontFamily: "'DM Mono', monospace",
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.5px',
                      fontWeight: 400,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#d0d0d0';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    LIKE
                  </button>

                  <button
                    onClick={() => bookmarkArticle(card)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#000000',
                      border: '1px solid #d0d0d0',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontFamily: "'DM Mono', monospace",
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.5px',
                      fontWeight: 400,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#d0d0d0';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    BOOKMARK
                  </button>
                </div>
              </article>
            ))
          )}
        </main>
      </div>
    </>
  );
}