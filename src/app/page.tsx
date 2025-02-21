"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";
import type { Button } from "@prisma/client";
import PostSummary from "@/app/_components/PostSummary";
import dummyPosts from "@/app/_mocks/dummyPosts";
import dummyButton from "./_mocks/dummyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  // 投稿データを「状態」として管理 (初期値はnull)
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [buttons, setButtons] = useState<Button[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    const fetchButtons = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/button`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const buttonApiResponse: Button[] = await response.json();
        const button_before = buttonApiResponse.filter(
          (data) => data.userId === "c96d0c06-bd86-4b32-94b6-4567f54c0740"
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
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/posts/`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const postApiResponse: PostApiResponse[] = await response.json();
        setPosts(
          postApiResponse.map((rawPost) => ({
            id: rawPost.id,
            title: rawPost.title,
            synopsis: rawPost.title,
            content: rawPost.content,
            coverImage: {
              url: rawPost.coverImageURL,
              width: 1000,
              height: 1000,
            },
            createdAt: rawPost.createdAt,
            updateAt: rawPost.updateAt,
            unlockPostId: rawPost.unlockPostId,
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
    fetchPosts();
    fetchButtons();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  // 投稿データが取得できるまでは「Loading...」を表示
  if (!posts || !buttons) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  console.log("Post1 object:", posts);
  console.log("Button1 object:", buttons);

  const findButtonById = (postId: string): Button | undefined => {
    return buttons.find((button) => button.postId === postId);
  };

  // 投稿データが取得できたら「投稿記事の一覧」を出力
  return (
    <main>
      <div className="mb-2 text-2xl font-bold">Main</div>
      <div className="space-y-3">
        {posts.map((post) => {
          const button = findButtonById(post.id);
          // buttonがundefinedの場合、何らかのエラーハンドリングやデフォルト値を設定する
          if (button) {
            return (
              <PostSummary
                key={post.id}
                post={post}
                posts={posts}
                button={button} // ここでbuttonがundefinedでないことが保証される
                buttons={buttons}
              />
            );
          }
          // buttonがundefinedの場合、何も返さない (または適切なエラーハンドリングを行う)
          return null;
        })}
      </div>
    </main>
  );
};

export default Page;
