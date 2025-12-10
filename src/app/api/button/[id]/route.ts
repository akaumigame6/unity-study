import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Button } from "@prisma/client";
import { supabase } from "@/utils/supabase";

type RouteParams = {
  params: {
    id: string;
  };
};

type RequestBody = {
  completed?: boolean;
};

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

export const GET = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    // パラメータプレースホルダから id を取得
    const id = routeParams.params.id;

    // findUnique は id に一致する「1件」のレコードを取得するメソッド
    // もし条件に一致するレコードが存在しないときは null が戻り値となる
    const button = await prisma.button.findUnique({
      where: { id },
      select: {
        id: true,
        completed: true,
      },
    });

    // 投稿記事が存在しないときの ( post が null のときの) 処理
    if (!button) {
      return NextResponse.json(
        { error: `id='${id}'の学習記録は見つかりませんでした` },
        { status: 404 }
      );
    }

    return NextResponse.json(button);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    const id = routeParams.params.id;
    const requestBody: RequestBody = await req
      .json()
      .catch(() => ({}) as RequestBody);

    const requestedCompleted =
      typeof requestBody.completed === "boolean"
        ? requestBody.completed
        : undefined;

    // リクエストでcompletedが指定されない場合は現在の値を反転してトグル
    let nextCompleted = requestedCompleted;
    if (nextCompleted === undefined) {
      const current = await prisma.button.findUnique({
        where: { id },
        select: { completed: true },
      });

      if (!current) {
        return NextResponse.json(
          { error: `id='${id}'の学習記録は見つかりませんでした` },
          { status: 404 }
        );
      }

      nextCompleted = !current.completed;
    }

    const button: Button = await prisma.button.update({
      where: { id },
      data: {
        completed: nextCompleted,
      },
    });

    return NextResponse.json(button);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の変更に失敗しました" },
      { status: 500 }
    );
  }
};
// ▲▲ 追記: ここまで

export const DELETE = async (req: NextRequest, routeParams: RouteParams) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });
  try {
    const id = routeParams.params.id;
    const button: Button = await prisma.button.delete({
      where: { id },
    });
    return NextResponse.json({ msg: `「${button.id}」を削除しました。` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};
