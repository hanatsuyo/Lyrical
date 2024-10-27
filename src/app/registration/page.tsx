import RegistrationForm from "@/app/components/RegistrationForm";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { checkExistingUser } from "@/app/util/checkExistingUser";
export default async function Registration() {
  const session = await getSession();
  if (!session) redirect("/api/auth/login?returnTo=/registration");
  const existingUser = await checkExistingUser(session.user.email);
  if (existingUser) redirect("/dashboard");
  return (
    <>
      <RegistrationForm />
    </>
  );
}
