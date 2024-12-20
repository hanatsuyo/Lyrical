"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState, useEffect } from "react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getUserId } from "@/app/util/client/getUserId";
import { categoryList } from "@/data/category";
import { DialogTitle } from "@radix-ui/react-dialog";

// スキーマ定義
const formSchema = z.object({
  title: z.string().min(1, {
    message: "タイトルを入力してください",
  }),
  category: z.string().min(1, {
    message: "カテゴリーを選択してください",
  }),
  emoji: z.string().min(1, {
    message: "絵文字を選択してください",
  }),
});

// 型定義
type FormValues = z.infer<typeof formSchema>;

interface TitleFormProps {
  trackId: string;
  setOpen: (open: boolean) => void;
  defaultCategory: string;
  onSuccess?: () => void;
  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void;
}

// emoji-martの型定義
interface EmojiSelectData {
  native: string;
  id: string;
  name: string;
  unified: string;
}

// Pickerのスタイル型
interface PickerStyle extends React.CSSProperties {
  "--em-rgb-input": string;
}

export default function TitleForm({
  trackId,
  setOpen,
  defaultCategory,
  onSuccess,
  isSubmitting,
  setSubmitting,
}: TitleFormProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: defaultCategory,
      emoji: "",
    },
  });

  useEffect(() => {
    form.setValue(
      "category",
      defaultCategory !== "all" ? defaultCategory : "other"
    );
  }, [defaultCategory, form]);

  const onEmojiSelect = (emoji: EmojiSelectData) => {
    form.setValue("emoji", emoji.native, {
      shouldValidate: true,
    });
    setShowEmojiPicker(false);
  };

  const onSubmit = async (formData: FormValues) => {
    setSubmitting(true);
    const user_id = await getUserId();
    const data = { ...formData, trackId, user_id };
    const body = JSON.stringify(data);
    try {
      const response = await fetch("/api/database/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("thread failed");
      }
      form.reset({
        title: "",
        category: defaultCategory,
        emoji: "",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリー" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryList
                    .filter((category) => category.value !== "all")
                    .map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emoji"
          render={({ field }) => (
            <FormItem>
              <FormLabel>絵文字</FormLabel>
              <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {field.value ? (
                      <span className="text-2xl">{field.value}</span>
                    ) : (
                      "絵文字を選択"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 sm:max-w-[425px]">
                  <DialogTitle className="hidden">絵文字選択</DialogTitle>
                  <div className="p-4">
                    <Picker
                      data={data}
                      onEmojiSelect={onEmojiSelect}
                      locale="ja"
                      previewPosition="none"
                      skinTonePosition="none"
                      theme="light"
                      set="native"
                      maxFrequentRows={2}
                      style={
                        {
                          width: "100%",
                          "--em-rgb-input": "229, 231, 235",
                        } as PickerStyle
                      }
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          追加
        </Button>
      </form>
    </Form>
  );
}
