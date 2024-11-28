import RegistrationForm from "@/app/registration/_components/RegistrationForm";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { checkRegistration } from "@/app/util/client/checkRegistration";
export default async function Registration() {
  const session = await getSession();
  if (!session) redirect("/api/auth/login?returnTo=/registration");
  const existingUser = await checkRegistration(session.user.email);
  if (existingUser) redirect("/dashboard");
  return (
    <>
      <RegistrationForm />
    </>
  );
}
