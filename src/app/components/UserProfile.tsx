import { buttonVariants } from "@/components/ui/button";

export default async function UserProfile() {
  return (
    <>
      <a
        href="/api/auth/logout"
        className={buttonVariants({ variant: "outline" })}
      >
        ログアウト
      </a>
    </>
  );
}
