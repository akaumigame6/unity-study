import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase"; // Supabaseクライアントのインポート

export const getAuthUser = async (req: NextRequest) => {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Bearerトークンを取得
  if (!token) {
    throw new Error("Authorization token not found");
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    throw new Error("Failed to fetch user data");
  }

  return data.user; // 認証済みユーザー情報を返す
};

// APIハンドラーの例
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "userの取得に失敗しました" },
      { status: 401 }
    );
  }
}
