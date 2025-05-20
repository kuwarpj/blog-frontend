"use client";

import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("authToken");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
     
      <h1 className="text-lg font-semibold text-gray-800">Blog Admin Dashboard</h1>

     
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer rounded-full overflow-hidden w-10 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.email}
              className="w-10 h-10 object-cover rounded-full"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-gray-600" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-default select-none" disabled>
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
