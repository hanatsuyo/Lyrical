"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getUserId } from "@/app/util/getUserId";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "コメントを入力してください",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CommentForm({
  thread_id,
  trackId,
  setOpen,
  onSuccess,
}: {
  thread_id: string;
  trackId: string;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (formData: FormValues) => {
    const user_id = await getUserId();
    const data = {
      user_id,
      thread_id,
      song_id: trackId,
      content: formData.content,
    };
    const body = JSON.stringify(data);

    try {
      const response = await fetch("/api/database/comment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("comment failed");
      }

      form.reset({
        content: "",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="コメントを入力"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">送信</Button>
        </div>
      </form>
    </Form>
  );
}
