"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";

export function HelloWorld() {
  const [name, setName] = useState("");
  const { mutate, isPending } = useMutation(
    orpc.helloWorld.mutationOptions({
      onSuccess: (data) => {
        toast.success(data);
      },
    }),
  );
  return (
    <div className="">
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={() => mutate({ name })} disabled={isPending || !name}>
        {isPending ? "Loading..." : "Hello"}
      </Button>
    </div>
  );
}
