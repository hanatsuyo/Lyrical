export default function Home() {
  return (
    <>
      <div>
        <div className="w-screen h-screen flex flex-col items-center justify-center">
          <h1 className="text-6xl">Welcome to Lyrical</h1>
          <div className="mt-8">
            <a
              href="/api/auth/login?returnTo=/dashboard"
              className="inline-flex transition-all px-4 py-2rounded-md hover:opacity-70"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
