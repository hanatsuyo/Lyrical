// import { getSession } from "@auth0/nextjs-auth0";
// import { redirect } from "next/navigation";
export default async function Home() {
  // const session = await getSession();
  // if (session) redirect("/dashboard");
  return (
    <>
      <div>
        <div className="w-screen h-[calc(100vh - 60px)]">
          <h1 className="text-center text-6xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:whitespace-nowrap">
            Welcome to Lyrical
          </h1>
        </div>
      </div>
    </>
  );
}
