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
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);


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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowHeader(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: 'url(https://thecodeworks.in/pool_bar1.png)',
  backdropFilter: 'blur(10px)',
  transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: `
    0 1px 0 #000000,
    0 8px 0 #ffffff,
    0 9px 0 #000000
  `,
}}>
  <div style={{
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  }}>
    <h1 style={{
      fontFamily: "'DM Serif Text', serif",
      fontSize: '32px',
      fontWeight: 400,
      margin: 0,
      color: '#004911',
      letterSpacing: '-0.5px',
    }}>
      Feed
    </h1>

    {/* Menu Button */}
    <div style={{ position: 'relative' }}>
    <button onClick={() => setMenuOpen(!menuOpen)} style={{ backgroundColor: 'transparent', border: '1px solid #000000', padding: '8px 18px', fontSize: '13px', fontFamily: "'DM Mono', monospace", cursor: 'pointer', letterSpacing: '1px', }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.color = '#ffffff'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000000'; }} > MENU </button>



      {/* Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '110%',
          backgroundColor: '#ffffff',
          border: '1px solid #000000',
          minWidth: '160px',
          zIndex: 2000,
        }}>
          {[
            { label: '> Home', path: '/' },
            { label: '> Bookmarks', path: '/bookmarks' },
            { label: '> Logout', path: '/logout' },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => {
                setMenuOpen(false);
                router.push(item.path);
              }}
              style={{
                padding: '12px 16px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '13px',
                cursor: 'pointer',
                borderBottom: item.label !== 'Logout' ? '1px solid #e5e5e5' : 'none',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</header>


        {/* Feed Content */}
        <main style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '120px 40px 60px',
        }}>
          {cards.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#666666',
          fontSize: '14px',
        }}>
          <img
            src="https://thecodeworks.in/load1.gif" // placeholder URL
            alt="Loading"
            style={{
              width: '32px',
              height: '32px',
              marginBottom: '16px',
              objectFit: 'contain',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />

          Loading your feed...
        </div>

          ) : (
            cards.map((card) => (
              <article
                key={card.page_id}
                style={{
                  marginBottom: '32px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #000000',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Article Image */}
                {card.image && (
                  <div 
                    onClick={() => openArticle(card)}
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      height: '280px',
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.display_title || card.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: '24px' }}>
                  {/* Source Tag */}
                  <div style={{
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    color: '#666666',
                    fontWeight: 500,
                  }}>
                    {card.source === "explore" ? "Explore" : "For You"}
                  </div>

                  {/* Article Title */}
                  <h2
                    onClick={() => openArticle(card)}
                    style={{
                      fontFamily: "'DM Serif Text', serif",
                      fontSize: '24px',
                      fontWeight: 400,
                      lineHeight: '1.3',
                      margin: '0 0 12px 0',
                      color: '#000000',
                      cursor: 'pointer',
                      letterSpacing: '-0.3px',
                      transition: 'opacity 0.2s ease',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
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
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#555555',
                      margin: '0 0 20px 0',
                      fontWeight: 300,
                      display: '-webkit-box',
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {card.summary}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={() => openArticle(card)}
                      style={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '12px',
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
                        fontSize: '12px',
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
                        fontSize: '12px',
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
                </div>
              </article>
            ))
          )}
        </main>
      </div>
    </>
  );
}