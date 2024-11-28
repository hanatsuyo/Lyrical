import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/20 z-[9999]">
      <Loader className="animate-spin text-white w-8 h-8" />
    </div>
  );
}
