"use client";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        {user.picture && user.name ? (
          <div className="relative w-[40px] h-[40px]">
            <img src={user.picture} alt="" />
          </div>
        ) : (
          ""
        )}
        <h2>{user.name}</h2>
      </div>
    )
  );
}
