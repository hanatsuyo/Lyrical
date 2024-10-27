"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    // 送信データをログ出力
    console.log("Sending data:", data);

    const body = JSON.stringify(data);
    console.log("Stringified body:", body); // 変換後のJSONを確認

    try {
      const response = await fetch("/api/database/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      // レスポンスの詳細をログ出力
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
      reset();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitStatus.message && (
        <div
          className={`p-4 rounded ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <div>
        <input
          {...register("name", { required: true })}
          aria-invalid={errors.name ? "true" : "false"}
          className="w-full p-2 border rounded"
          placeholder="名前"
        />
        {errors.name?.type === "required" && (
          <p role="alert" className="text-red-500">
            名前は必須です
          </p>
        )}
      </div>
      <div>
        <select
          {...register("gender", { required: "性別を選択してください" })}
          aria-invalid={errors.gender ? "true" : "false"}
          className="w-full p-2 border rounded"
          defaultValue=""
        >
          <option value="" disabled>
            性別を選択
          </option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
          <option value="prefer_not_to_say">回答しない</option>
        </select>
        {errors.gender && (
          <p role="alert" className="text-red-500">
            {errors.gender?.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          生年月日
        </label>
        <input
          {...register("birthdate", {
            required: "生年月日は必須です",
            validate: (value) => {
              const date = new Date(value);
              const now = new Date();
              return date <= now || "未来の日付は選択できません";
            },
          })}
          type="date"
          className="w-full p-2 border rounded"
          aria-invalid={errors.birthdate ? "true" : "false"}
        />
        {errors.birthdate && (
          <p role="alert" className="text-red-500">
            {errors.birthdate?.message}
          </p>
        )}
      </div>

      <input
        type="submit"
        className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
        value="登録"
      />
    </form>
  );
}
