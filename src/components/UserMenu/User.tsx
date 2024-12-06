import { getUserName } from "@/app/util/server/getUserName";
import { getUserId } from "@/app/util/server/getUserId";
import UserMenu from "./UserMenu";

export default async function User() {
  const userId = await getUserId();
  const userInfo = await getUserName(userId);

  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return <UserMenu userInfo={getInitials(userInfo?.name)} />;
}
