"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserId } from "@/app/util/getUserId";
import { useToast } from "@/hooks/use-toast";

type FormValues = {
  title: string;
  category: string;
};

interface TitleFormProps {
  trackId: string;
  setOpen: (open: boolean) => void; // モーダルを閉じるための関数
}

export default function TitleForm({ trackId, setOpen }: TitleFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "",
    },
  });

  const onSubmit = async (formData: FormValues) => {
    const user_id = await getUserId();
    const data = { ...formData, trackId, user_id };
    const body = JSON.stringify(data);

    try {
      const response = await fetch("/api/database/thread/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "thread failed");
      }

      // 成功時の処理
      toast({
        title: "作成完了",
        description: "スレッドが正常に作成されました",
      });

      form.reset();
      setOpen(false); // モーダルを閉じる
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "スレッドの作成に失敗しました",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="タイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリー</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリー" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="source">音源</SelectItem>
                  <SelectItem value="video">映像</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">追加</Button>
      </form>
    </Form>
  );
}
