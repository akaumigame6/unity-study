"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

// WelcomePageコンポーネント
const Page: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="">実際に機能を体験しながらUnityを学ぼう!!</h1>
      <h1 className="py-1 text-5xl">Uinty-Study-Notes</h1>
      {isLoggedIn ? (
        <h2 className="pt-5">{userName}さん、ようこそ！</h2>
      ) : (
        <h2 className="pt-5">
          現在、ログインしていません。ログインしてください。
        </h2>
      )}
      <div className="pt-3">
        <button
          onClick={() => router.replace("/login")}
          className={twMerge(
            "rounded-md px-5 py-2 font-bold",
            "bg-black text-white hover:bg-slate-700"
          )}
        >
          ログイン
        </button>
      </div>
    </div>
  );
};

export default Page;
