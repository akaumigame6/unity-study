"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { User } from "@prisma/client";
import { Role } from "@prisma/client";

interface Props {
  children: React.ReactNode;
}
const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const { isLoading, session, token } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 認証されたかどうかのフラグ
  const [user, setUsers] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      // 認証成功のフラグがfalseの場合のみリクエストを行う
      if (!isAuthenticated) {
        console.log(token);
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
        } finally {
        }
      }
    };

    fetchUser();
  }, [token, isAuthenticated]); // isAuthenticatedを依存配列に追加

  useEffect(() => {
    // 認証状況の確認中は何もせずに戻る
    if (isLoading) {
      return;
    }
    // 認証確認後、未認証であればログインページにリダイレクト
    if (session === null) {
      console.log("未認証");
      router.replace("/login");
    }
    if (user && user.role !== "ADMIN") {
      console.log("ADMINじゃない");
      router.replace("/login");
    }
  }, [isLoading, router, session, user]);

  // 認証済みが確認できるまでは何も表示しない
  if (!session) {
    return null;
  }
  return <>{children}</>;
};

export default AdminLayout;
