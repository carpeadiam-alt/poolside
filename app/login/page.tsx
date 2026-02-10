"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  username: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  async function submit(path: "login" | "signup") {
    setError("");

    const res = await fetch(`https://thecodeworks.in/pool/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, dob }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    const user: User = {
      user_id: data.user_id,
      username,
    };

    localStorage.setItem("user", JSON.stringify(user));
    router.push("/feed");
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
      }}>
        {/* Top Image Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '50vh',
          backgroundImage: 'url(https://thecodeworks.in/pool_bar1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            textAlign: 'center',
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}>
            <h1 style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: '64px',
              fontWeight: 400,
              marginBottom: '8px',
              letterSpacing: '-1px',
            }}>
              pool
            </h1>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '16px',
              letterSpacing: '1px',
            }}>
              doomscoll Wikipedia
            </p>
          </div>
        </div>

        {/* Border Separator */}
        <div style={{
          borderTop: '1px solid #000000',
          borderBottom: '1px solid #000000',
          padding: '7px 0',
          backgroundColor: '#ffffff',
        }} />

        {/* Form Section */}
        <div style={{
          flex: 1,
          backgroundImage: 'url(https://thecodeworks.in/grid_image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '40px',
            borderRadius: '0px',
            border: '1px solid #000000',
          }}>
            {/* Toggle Links */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}>
              <button
                onClick={() => setActiveForm("signup")}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '13px',
                  color: activeForm === "signup" ? '#000000' : '#666666',
                  cursor: 'pointer',
                  textDecoration: activeForm === "signup" ? 'underline' : 'none',
                  padding: 0,
                  letterSpacing: '0.5px',
                }}
              >
                First time? Sign up here &gt;
              </button>

              <button
                onClick={() => setActiveForm("login")}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '13px',
                  color: activeForm === "login" ? '#000000' : '#666666',
                  cursor: 'pointer',
                  textDecoration: activeForm === "login" ? 'underline' : 'none',
                  padding: 0,
                  letterSpacing: '0.5px',
                }}
              >
                Have an account? Login &gt;
              </button>
            </div>

            {/* Input Fields */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '14px',
                  border: '1px dashed #999999',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#999999';
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <input
                type="text"
                placeholder="DOB (YYYY-MM-DD)"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '14px',
                  border: '1px dashed #999999',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#999999';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => submit(activeForm)}
              style={{
                width: '100%',
                padding: '14px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                letterSpacing: '1px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
              }}
            >
              {activeForm === "login" ? "Login >" : "Signup >"}
            </button>

            {/* Error Message */}
            {error && (
              <p style={{
                marginTop: '20px',
                color: '#cc0000',
                fontSize: '13px',
                textAlign: 'center',
                fontFamily: "'DM Mono', monospace",
              }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}