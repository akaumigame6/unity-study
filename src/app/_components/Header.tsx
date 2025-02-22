"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faGamepad, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation"; // ◀ 追加

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };
  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <Link href="/">
              <FontAwesomeIcon icon={faPen} className="mr-1" />
              Unity-Study-Notes
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {!isLoading &&
              (session ? (
                <div>
                  <Link href="/demo">
                    <FontAwesomeIcon icon={faGamepad} className="mr-1" />
                    DEMO
                  </Link>
                </div>
              ) : (
                <div></div>
              ))}
            <div>
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              {!isLoading &&
                (session ? (
                  <Link href="/user">User</Link>
                ) : (
                  <Link href="/login">Login</Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
