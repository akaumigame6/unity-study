"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_hooks/useAuth";

// WelcomePageコンポーネント
const Page: React.FC = () => {
  const { isLoading, session } = useAuth();

  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="">実際に機能を体験しながらUnityを学ぼう!!</h1>
      <h1 className="py-1 text-5xl">Uinty-Study-Notes</h1>
      <div>ログインしているのにエラーが起きた場合はリロードしてください。</div>
      {!isLoading &&
        (session ? (
          <div>
            <h2 className="pt-5">
              ログインしています。Unity-Studyにようこそ！
            </h2>
            <div className="pt-3">
              <button
                onClick={() => router.replace("/posts")}
                className={twMerge(
                  "rounded-md px-5 py-2 font-bold",
                  "bg-black text-white hover:bg-slate-700"
                )}
              >
                Posts
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="pt-5">
              現在、ログインしていません。ログインしてください。
            </h2>
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
        ))}
    </div>
  );
};

export default Page;
