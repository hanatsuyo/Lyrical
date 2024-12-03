"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import Threads from "./Threads";
import type { Thread } from "@/types/thread";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TitleForm from "./Form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Loading from "@/components/Loading";
import { categoryList } from "@/data/category";
import useSWR from "swr";

// フェッチャー関数を定義
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoryTab({ trackId }: { trackId: string }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // useSWRを使用してデータフェッチ
  const {
    data: threadList = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Thread[]>(
    `/api/database/thread?category=${selectedCategory}&trackId=${trackId}`,
    fetcher
  );

  const handleCreateSuccess = useCallback(() => {
    mutate(); // キャッシュを更新
    setIsFormSubmitting(false);
  }, [mutate]);

  const [isVisible, setIsVisible] = useState(false);
  const threshold = 0.4;

  useEffect(() => {
    const target = document.createElement("div");
    target.style.position = "absolute";
    target.style.top = `${threshold * 100}%`;
    document.body.appendChild(target);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      document.body.removeChild(target);
    };
  }, [threshold]);

  const buttonClass = `fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black grid justify-center items-center hover:scale-125 transition-all duration-300 ease-out
    ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10 pointer-events-none"
    }`;

  if (error) return <div>エラーが発生しました</div>;

  return (
    <div>
      <div className="space-y-4">
        <Tabs
          defaultValue="source"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="overflow-x-auto">
              <TabsList className="flex-none">
                {categoryList.map((category) => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                <Plus className="h-4 w-4 mr-2" />
                <span>新規作成</span>
              </Button>
            </DialogTrigger>
            <DialogTrigger className={buttonClass}>
              <Plus className="w-8 h-8 text-white" />
            </DialogTrigger>
            <DialogContent className="top-[30%] sm:top-[50%] max-w-[500px] w-[90%] rounded-lg">
              <DialogTitle>新規スレッド作成</DialogTitle>
              <TitleForm
                trackId={trackId}
                setOpen={setIsOpen}
                defaultCategory={selectedCategory}
                onSuccess={handleCreateSuccess}
                isSubmitting={isFormSubmitting}
                setSubmitting={setIsFormSubmitting}
              />
            </DialogContent>
          </Dialog>
          <div>
            {categoryList.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                <Threads threadList={threadList} isLoading={isLoading} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      {isFormSubmitting && <Loading />}
    </div>
  );
}
