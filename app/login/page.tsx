"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  username: string;
}

export default function LoginPage() {
  const router = useRouter();
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
    <div style={{ padding: 40 }}>
      <h1>Wiki Pool</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />

      <input
        placeholder="DOB (YYYY-MM-DD)"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <br />

      <button onClick={() => submit("login")}>Login</button>
      <button onClick={() => submit("signup")}>Signup</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
