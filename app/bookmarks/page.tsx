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

    fetch(`https://thecodeworks.in/pool/bookmarks?user_id=${u.user_id}`)
      .then((res) => res.json())
      .then((data: Bookmark[]) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  function openArticle(title: string) {
    router.push(`/article/${encodeURIComponent(title)}`);
  }

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
      Bookmarks
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

        {/* Bookmarks Content */}
        <main style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '120px 40px 60px',
        }}>
          {loading ? (
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

          Loading bookmarks...
        </div>
          ) : bookmarks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
            }}>
              <p style={{
                color: '#666666',
                fontSize: '14px',
                marginBottom: '20px',
              }}>
                No bookmarks yet.
              </p>
              <button
                onClick={() => router.push('/')}
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
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
                EXPLORE FEED
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}>
              {bookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.page_id}
                  onClick={() => openArticle(bookmark.title)}
                  style={{
                    padding: '24px 0',
                    borderBottom: index === bookmarks.length - 1 ? 'none' : '1px solid #e5e5e5',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.paddingLeft = '12px';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.paddingLeft = '0';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <h2 style={{
                    fontFamily: "'DM Serif Text', serif",
                    fontSize: '22px',
                    fontWeight: 400,
                    margin: 0,
                    color: '#000000',
                    letterSpacing: '-0.3px',
                    lineHeight: '1.4',
                  }}>
                    {bookmark.title.replaceAll("_", " ")}
                  </h2>
                </div>
              ))}
            </div>
          )}

          {bookmarks.length > 0 && (
            <div style={{
              marginTop: '60px',
              paddingTop: '32px',
              borderTop: '1px solid #e5e5e5',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '13px',
                color: '#666666',
                letterSpacing: '0.5px',
              }}>
                {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} saved
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}