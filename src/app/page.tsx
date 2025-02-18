"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
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

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    // 本来はウェブAPIを叩いてデータを取得するが、まずはモックデータを使用
    // (ネットからのデータ取得をシミュレートして１秒後にデータをセットする)
    const timer = setTimeout(() => {
      console.log("ウェブAPIからデータを取得しました (虚言)");
      setPosts(dummyPosts);
    }, 1000); // 1000ミリ秒 = 1秒
    const timer2 = setTimeout(() => {
      console.log("ウェブAPIからデータを取得しました (虚言)");
      setButtons(dummyButton);
    }, 1000); // 1000ミリ秒 = 1秒

    // データ取得の途中でページ遷移したときにタイマーを解除する処理
    return () => clearTimeout(timer);
  }, []);

  // 投稿データが取得できるまでは「Loading...」を表示
  if (!posts || !buttons) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

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
                button={button} // ここでbuttonがundefinedでないことが保証される
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
