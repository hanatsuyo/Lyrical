import { getSession } from "@auth0/nextjs-auth0";

export const getUserId = async () => {
  const session = await getSession();
  if (!session) throw new Error("session is undefined");
  const id = session.user.app_uuid;
  return id;
};
