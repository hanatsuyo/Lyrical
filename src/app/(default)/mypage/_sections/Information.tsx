import { getUserName } from "@/app/util/server/getUserName";
import { getUserId } from "@/app/util/server/getUserId";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const getInitials = (name: string) => {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default async function Information() {
  try {
    const userId = await getUserId();
    const userInfo = await getUserName(userId);

    if (!userInfo) {
      return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                ユーザー情報が見つかりません
              </CardHeader>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 bg-primary text-primary-foreground">
                  <AvatarFallback className="text-2xl font-semibold">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userInfo.name}
                </h2>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center text-red-500">
              エラーが発生しました：
              {error instanceof Error ? error.message : "Unknown error"}
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }
}
