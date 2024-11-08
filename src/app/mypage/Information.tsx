"use client";
import { useState, useEffect } from "react";
import { getUserId } from "../util/getUserId";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type User = {
  id: string;
  name: string;
  gender: string;
  birthdate: string;
};

// ユーザー名から初期文字を取得する関数
const getInitials = (name: string) => {
  if (!name) return "";
  // 文字列を空白で分割し、最初の2文字を取得
  const words = name.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  // 単一の名前の場合は最初の2文字を取得
  return name.slice(0, 2).toUpperCase();
};

export default function Information() {
  const [userInfo, setUserInfo] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const user_id = await getUserId();
      const response = await fetch(`/api/database/user/get?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error("ユーザー情報の取得に失敗しました。");
      }
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </>
              ) : (
                <>
                  <Avatar className="h-24 w-24 bg-primary text-primary-foreground">
                    <AvatarFallback className="text-2xl font-semibold">
                      {getInitials(userInfo?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userInfo?.name}
                  </h2>
                </>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
