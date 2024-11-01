"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = {
  title: string;
};

export default function TitleForm({ trackId }: { trackId: string }) {
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Submitted data:", trackId);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="タイトル" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">追加</Button>
      </form>
    </Form>
  );
}
