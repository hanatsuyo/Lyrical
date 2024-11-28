"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IFormInputs {
  name: string;
  gender: string;
  birthdate: string;
}

export default function RegistrationForm() {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    console.log("Sending data:", data);
    const body = JSON.stringify(data);
    console.log("Stringified body:", body);

    try {
      const response = await fetch("/api/database/register", {
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
        throw new Error(responseData.error || "Registration failed");
      }

      setSubmitStatus({
        type: "success",
        message: "登録が完了しました！",
      });
      form.reset();
      setTimeout(() => {
        router.push("/dashboard/");
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "登録に失敗しました。",
      });
    }
  };

  return (
    <div className="px-8 pt-16">
      <div className="max-w-[800px] mr-auto ml-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {submitStatus.message && (
              <Alert
                variant={
                  submitStatus.type === "success" ? "default" : "destructive"
                }
              >
                <AlertDescription>{submitStatus.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "名前は必須です" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="名前を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              rules={{ required: "性別を選択してください" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性別</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        回答しない
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              rules={{
                required: "生年月日は必須です",
                validate: (value) => {
                  const date = new Date(value);
                  const now = new Date();
                  return date <= now || "未来の日付は選択できません";
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>生年月日</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
