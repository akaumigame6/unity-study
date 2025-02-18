"use client";
import type { Post } from "@/app/_types/Post";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faClock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const dtFmt = "YYYY-MM-DD HH:mm";
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });
  return (
    <div className="border border-slate-400 p-3">
      <div className="flex items-center justify-between">
        <div>
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          {dayjs(post.createdAt).format(dtFmt)}
          <FontAwesomeIcon icon={faPen} className="ml-3" />
          {dayjs(post.createdAt).format(dtFmt)}
        </div>
        <div className="flex space-x-1.5">
          {post.button ? (
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
};

export default PostSummary;
