"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faGamepad, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Header: React.FC = () => {
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
            <div>
              <Link href="/demo">
                <FontAwesomeIcon icon={faGamepad} className="mr-1" />
                DEMO
              </Link>
            </div>
            <div>
              <Link href="/user">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                User
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
