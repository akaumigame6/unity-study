import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase"; // Supabaseクライアントのインポート

// APIハンドラーの例
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Bearerトークンを取得
    if (!token) {
      throw new Error("Authorization token not found");
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      throw new Error("Failed to fetch user data");
    }

    const user = data.user;
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "userの取得に失敗しました" },
      { status: 401 }
    );
  }
}
