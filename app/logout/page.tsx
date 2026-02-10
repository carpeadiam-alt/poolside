"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage
    localStorage.clear();


    // Redirect to home
    router.replace("/");
  }, [router]);

  return null; // no UI, instant redirect
}
