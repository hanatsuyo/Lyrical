"use client";

import { useState, useEffect } from "react";
import { getUserId } from "../util/getUserId";

export default function Information() {
  const [userInfo, setUserInfo] = useState();
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
    <>
      <div>{userInfo?.id}</div>
      <div>{userInfo?.name}</div>
      <div>{userInfo?.gender}</div>
      <div>{userInfo?.birthdate}</div>
    </>
  );
}
