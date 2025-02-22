"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/_hooks/useAuth";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import type { Button, User } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

import DOMPurify from "isomorphic-dompurify";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [button, setButton] = useState<Button | null>(null);
  const [user, setUsers] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 認証されたかどうかのフラグ

  const { token } = useAuth();
  const router = useRouter();

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postApiResponse: PostApiResponse = await response.json();
        setPost({
          id: postApiResponse.id,
          title: postApiResponse.title,
          synopsis: postApiResponse.synopsis,
          content: postApiResponse.content,
          coverImage: {
            url: postApiResponse.coverImageURL,
            width: 1000,
            height: 1000,
          },
          createdAt: postApiResponse.createdAt,
          updateAt: postApiResponse.updateAt,
          unlockPostId: postApiResponse.unlockPostId,
        });
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

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
      if (user && post)
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
          const rawButton = button_before.find(
            (button) => button.postId === post.id
          );
          if (rawButton) setButton(rawButton);
        } catch (e) {
          setFetchError(
            e instanceof Error ? e.message : "予期せぬエラーが発生しました"
          );
        } finally {
          setIsLoading(false);
        }
    };
    fetchButtons();
  }, [user, post]);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データが取得できるまでは「Loading...」を表示
  if (!post || !button) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  // 投稿データが取得できなかったらエラーメッセージを表示
  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  const ButonPUT = async () => {
    // ▼▼ 追加 ウェブAPI (/api/admin/posts/[id]) にPUTリクエストを送信する処理
    try {
      const requestBody = {
        id: button.id,
        postId: button.postId,
        userId: button.userId,
        push: !button.push,
      };
      const requestUrl = `/api/button/${button.id}`;
      console.log(`${requestUrl} => ${JSON.stringify(requestBody, null, 2)}`);
      const res = await fetch(requestUrl, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
      }
      router.replace("/posts");
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `ButtonのPOSTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    }
  };

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        <div>
          <Image
            src={post.coverImage.url}
            alt="Example Image"
            width={post.coverImage.width}
            height={post.coverImage.height}
            priority
            className="rounded-xl"
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
        {button.push ? (
          <button
            onClick={ButonPUT}
            className={twMerge(
              "rounded-md px-2 py-0.5",
              "text-xs font-bold",
              "border border-green-600 text-white",
              "bg-green-400"
            )}
          >
            complete
          </button>
        ) : (
          <button
            onClick={ButonPUT}
            className={twMerge(
              "rounded-md px-2 py-0.5",
              "text-xs font-bold",
              "border border-red-600 text-white",
              "bg-red-400"
            )}
          >
            incomplete
          </button>
        )}
      </div>
    </main>
  );
};

export default Page;
