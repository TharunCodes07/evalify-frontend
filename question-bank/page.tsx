"use client";
import React from "react";
import Bank from "@/components/bank/bank";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BankPage() {
  const router = useRouter();
  return (
    <div>
      <Button onClick={() => router.push("/create-quiz")}>Add Bank</Button>
      <Bank />
    </div>
  );
}
