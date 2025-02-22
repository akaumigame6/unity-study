"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import type { Button, User } from "@prisma/client";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  // 投稿データを「状態」として管理 (初期値はnull)
  const [buttons, setButtons] = useState<Button[] | null>(null);
  const [user, setUsers] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 認証されたかどうかのフラグ

  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      // 認証成功のフラグがfalseの場合のみリクエストを行う
      if (!isAuthenticated) {
        console.log(token);
        setIsLoading(true);
        try {
          const requestUrl = `/api/user/authUser`;
          const response = await fetch(requestUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.status === 401) {
            setIsAuthenticated(false); // 認証失敗
            throw new Error("未認証です。");
          } else if (!response.ok) {
            throw new Error("データの取得に失敗しました");
          }

          const data = await response.json();
          setIsAuthenticated(true); // 認証成功
          console.log(data);
          setFetchError(null);

          // ユーザー情報の取得
          const requrl = `/api/user/${data.user.id}`;
          const res = await fetch(requrl, {
            method: "GET",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            throw new Error("データの取得に失敗しました");
          }

          const userRes: User = await res.json();
          console.log(userRes);
          setUsers({
            id: userRes.id,
            name: userRes.name,
            role: userRes.role,
            password: userRes.password,
          });
        } catch (e) {
          setFetchError(
            e instanceof Error ? e.message : "予期せぬエラーが発生しました"
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [token, isAuthenticated]); // isAuthenticatedを依存配列に追加

  useEffect(() => {
    const fetchButtons = async () => {
      setIsLoading(true);
      if (user)
        try {
          const requestUrl = `/api/button`;
          const response = await fetch(requestUrl, {
            method: "GET",
            cache: "no-store",
          });
          if (!response.ok) {
            throw new Error("Buttonデータの取得に失敗しました");
          }
          const buttonApiResponse: Button[] = await response.json();
          const button_before = buttonApiResponse.filter(
            (data) => data.userId === user.id

            // (data) => data.userId === "c96d0c06-bd86-4b32-94b6-4567f54c0740"
          );
          setButtons(
            button_before.map((rawButton) => ({
              id: rawButton.id,
              postId: rawButton.postId,
              userId: rawButton.userId,
              push: rawButton.push,
            }))
          );
        } catch (e) {
          setFetchError(
            e instanceof Error ? e.message : "予期せぬエラーが発生しました"
          );
        } finally {
          setIsLoading(false);
        }
    };
    fetchButtons();
  }, [user]);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データが取得できるまでは「Loading...」を表示
  if (!buttons) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }
  console.log("Button1 object:", buttons);

  const findButtonById = (postId: string): Button | undefined => {
    return buttons.find((button) => button.postId === postId);
  };

  // 投稿データが取得できたら「投稿記事の一覧」を出力
  return (
    <main>
      <div className="mb-2 text-2xl font-bold">DEMO</div>
      <div className="space-y-3">Unityのゲーム画面</div>
    </main>
  );
};

export default Page;
