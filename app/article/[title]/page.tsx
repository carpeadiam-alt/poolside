"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface User {
  user_id: number;
  username: string;
}

export default function ArticleReaderPage() {
  const params = useParams();
  const router = useRouter();
  const title = decodeURIComponent(params.title as string);
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw) as User;
      setUser(u);
    }
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

  useEffect(() => {
    fetchWikiContent(title);
  }, [title]);

  const fetchWikiContent = async (pageName: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?` +
        `action=parse&format=json&page=${encodeURIComponent(pageName)}` +
        `&prop=text&formatversion=2&origin=*`
      );
      
      if (!response.ok) throw new Error("Failed to fetch Wikipedia content");
      
      const data = await response.json();
      setContent(data.parse.text);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Wikipedia content:", error);
      setLoading(false);
    }
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' && target instanceof HTMLAnchorElement) {
      const href = target.getAttribute('href');
      
      // Handle internal Wikipedia links
      if (href && href.startsWith('/wiki/')) {
        event.preventDefault();
        const pageName = decodeURIComponent(href.split('/wiki/')[1])
          .split('#')[0]
          .split('?')[0];
        
        router.push(`/article/${encodeURIComponent(pageName)}`);
      }
    }
  };

  const likeArticle = () => {
    if (!user) return;
    
    // You'll need to get the page_id - for now using title as identifier
    fetch(`https://thecodeworks.in/pool/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        page_id: title, // You may need to adjust this based on your backend
      }),
    });
  };

  const bookmarkArticle = () => {
    if (!user) return;
    
    fetch(`https://thecodeworks.in/pool/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        page_id: title,
      }),
    });
  };

  const searchArticle = () => {
    // Open Google News search for the article title in the same page
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(title)}&tbm=nws`;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
        
        .wiki-content a {
          color: #0066cc;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }
        
        .wiki-content a:hover {
          border-bottom: 1px solid #0066cc;
        }
        
        .wiki-content p {
          margin-bottom: 16px;
          line-height: 1.7;
        }
        
        .wiki-content h2 {
          font-family: 'DM Serif Text', serif;
          font-size: 28px;
          margin-top: 40px;
          margin-bottom: 16px;
          font-weight: 400;
          color: #000000;
        }
        
        .wiki-content h3 {
          font-family: 'DM Serif Text', serif;
          font-size: 22px;
          margin-top: 32px;
          margin-bottom: 12px;
          font-weight: 400;
          color: #000000;
        }
        
        .wiki-content img {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
        }
        
        .wiki-content ul, .wiki-content ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        
        .wiki-content li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        
        .wiki-content table {
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        
        .wiki-content table td, .wiki-content table th {
          border: 1px solid #e5e5e5;
          padding: 8px 12px;
        }
        
        .wiki-content table th {
          background-color: #f5f5f5;
          font-weight: 500;
        }
        
        .wiki-content .infobox {
          float: right;
          margin-left: 20px;
          margin-bottom: 20px;
          max-width: 300px;
          border: 1px solid #e5e5e5;
          background-color: #fafafa;
        }
        
        .wiki-content blockquote {
          border-left: 3px solid #e5e5e5;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #555555;
        }
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
          backgroundImage: 'url(https://thecodeworks.in/pool_bar1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid #e5e5e5',
          backdropFilter: 'blur(10px)',
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}>
          <div style={{
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
              Reader
            </h1>
            
            <button
              onClick={() => router.push('/')}
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
              HOME
            </button>
          </div>
        </header>

        {/* Article Content */}
        <main style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '120px 40px 60px',
        }}>
          {/* Article Title */}
          <h1 style={{
            fontFamily: "'DM Serif Text', serif",
            fontSize: '48px',
            fontWeight: 400,
            lineHeight: '1.2',
            margin: '0 0 32px 0',
            color: '#000000',
            letterSpacing: '-0.5px',
          }}>
            {title.replaceAll("_", " ")}
          </h1>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '40px',
            paddingBottom: '32px',
            borderBottom: '1px solid #e5e5e5',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={likeArticle}
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
              onClick={bookmarkArticle}
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

            <button
              onClick={searchArticle}
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
              SEARCH NEWS
            </button>
          </div>

          {/* Wikipedia Content */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#666666',
              fontSize: '14px',
            }}>
              Loading article...
            </div>
          ) : (
            <div 
              className="wiki-content"
              onClick={handleLinkClick}
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#1a1a1a',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Footer Link */}
          <div style={{
            marginTop: '60px',
            paddingTop: '32px',
            borderTop: '1px solid #e5e5e5',
            textAlign: 'center',
          }}>
            <a
              href={`https://en.wikipedia.org/wiki/${title.replaceAll(" ", "_")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                color: '#666666',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderBottomColor = '#000000';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#666666';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              VIEW ON WIKIPEDIA →
            </a>
          </div>
        </main>
      </div>
    </>
  );
}