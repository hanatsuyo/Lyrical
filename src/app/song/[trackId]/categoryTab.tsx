"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import Threads from "./threads";
import type { Thread } from "@/app/types/thread";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TitleForm from "./form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CategoryTab({ trackId }: { trackId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<
    "source" | "video" | "other"
  >("source");
  const [threadList, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchThreads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/database/thread/get/thread_list?category=${selectedCategory}&trackId=${trackId}`
      );

      if (!response.ok) {
        throw new Error("スレッドの取得に失敗しました");
      }

      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "スレッドの取得に失敗しました。",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, trackId, toast]);

  const handleCreateSuccess = useCallback(() => {
    fetchThreads();
    toast({
      title: "作成完了",
      description: "新しいスレッドを作成しました。",
    });
  }, [fetchThreads, toast]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="source"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <div className="flex items-center space-x-4 mb-4">
          <TabsList className="flex-none">
            <TabsTrigger value="source">音源</TabsTrigger>
            <TabsTrigger value="video">映像</TabsTrigger>
            <TabsTrigger value="other">その他</TabsTrigger>
          </TabsList>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>新規スレッド作成</DialogTitle>
              <TitleForm
                trackId={trackId}
                setOpen={setIsOpen}
                defaultCategory={selectedCategory}
                onSuccess={handleCreateSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="source">
          <Threads threadList={threadList} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="video">
          <Threads threadList={threadList} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="other">
          <Threads threadList={threadList} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
