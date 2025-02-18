import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";
import { supabase } from "@/utils/supabase";

type RequestBody = {
  title: string;
  synopsis: string;
  content: string;
  coverImageURL: string;
  button: boolean;
};

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });
  try {
    const requestBody: RequestBody = await req.json();

    // 分割代入
    const { title, synopsis, content, coverImageURL, button } = requestBody;

    // 投稿記事テーブルにレコードを追加
    const post: Post = await prisma.post.create({
      data: {
        title, // title: title の省略形であることに注意。以下も同様
        synopsis,
        content,
        coverImageURL,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 }
    );
  }
};
