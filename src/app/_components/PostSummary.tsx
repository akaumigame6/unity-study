"use client";
import type { Post } from "@/app/_types/Post";
import type { Button } from "@/app/_types/Button";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faClock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {
  post: Post;
  posts: Post[];
  button: Button;
  buttons: Button[];
};

const PostSummary: React.FC<Props> = (props) => {
  const { post, posts, button, buttons } = props;
  const dtFmt = "YYYY-MM-DD HH:mm";
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });
  console.log("Post object:", post);
  console.log("Posts object:", posts);

  // unlockPostId が未定義でないか確認し、空の配列をデフォルト値とする
  const unlockPostIds = post.unlockPostId || [];

  // unlockPostId を使って posts から対応するタイトルを取得
  const unlockTitles = unlockPostIds
    .map((unlockId) => {
      const unlockedPost = posts.find((p) => p.id === unlockId);
      return unlockedPost ? unlockedPost.title : null; // 見つからない場合は null
    })
    .filter(Boolean); // null をフィルタリング

  const UnlockCheck = (buttons: Button[], postIds: string[]): boolean => {
    return postIds.every((postId) =>
      buttons.some(
        (button) => button.postId === postId && button.completed === true
      )
    );
  };

  if (post.unlockPostId && !UnlockCheck(buttons, post.unlockPostId)) {
    return (
      <div className="border border-slate-400 bg-slate-200 p-3">
        <div className="flex items-center justify-between">
          <div>
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            {dayjs(post.createdAt).format(dtFmt)}
            <FontAwesomeIcon icon={faPen} className="ml-3" />
            {dayjs(post.createdAt).format(dtFmt)}
            <span className="ml-3">
              解放条件:
              {
                unlockPostIds.length == 0
                  ? "なし"
                  : unlockTitles.join(", ") + "のクリア" // タイトルをカンマ区切りで表示
              }
            </span>
          </div>
          <div className="flex space-x-1.5">
            {button.completed ? (
              <div
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-green-600 text-slate-300",
                  "bg-green-500"
                )}
              >
                complete
              </div>
            ) : (
              <div
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-red-600 text-slate-300",
                  "bg-red-500"
                )}
              >
                incomplete
              </div>
            )}
          </div>
        </div>
        <div className="mb-1 text-lg font-bold">{post.title}</div>
        <div className="mb-1 font-bold">{post.synopsis}</div>
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </div>
    );
  } else {
    return (
      <div className="border border-slate-400 p-3">
        <div className="flex items-center justify-between">
          <div>
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            {dayjs(post.createdAt).format(dtFmt)}
            <FontAwesomeIcon icon={faPen} className="ml-3" />
            {dayjs(post.createdAt).format(dtFmt)}
            <span className="ml-3">
              解放条件:
              {
                unlockPostIds.length == 0
                  ? "なし"
                  : unlockTitles.join(", ") + "のクリア" // タイトルをカンマ区切りで表示
              }
            </span>
          </div>
          <div className="flex space-x-1.5">
            {button.completed ? (
              <div
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-green-600 text-white",
                  "bg-green-400"
                )}
              >
                complete
              </div>
            ) : (
              <div
                className={twMerge(
                  "rounded-md px-2 py-0.5",
                  "text-xs font-bold",
                  "border border-red-600 text-white",
                  "bg-red-400"
                )}
              >
                incomplete
              </div>
            )}
          </div>
        </div>
        <Link href={`/posts/${post.id}`}>
          <div className="mb-1 text-lg font-bold">{post.title}</div>
          <div className="mb-1 font-bold">{post.synopsis}</div>
          <div
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </Link>
      </div>
    );
  }
};

export default PostSummary;
