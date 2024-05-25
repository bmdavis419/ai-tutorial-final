"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActions, useUIState } from "ai/rsc";
import { type FormEvent, useState } from "react";
import { nanoid } from 'nanoid';
import type { AI } from "./actions";
import { UserMessage } from "@/components/chat/UserMessage";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setConversation((currentConversation) => [
      ...currentConversation,
      { id: nanoid(), role: 'user', display: <UserMessage message={prompt} /> },
    ]);

    const message = await continueConversation(prompt);

    setConversation((currentConversation) => [
      ...currentConversation,
      message,
    ]);

  }

  return <main className="min-h-screen flex flex-col justify-end bg-neutral-800">
    <div className="grow flex flex-col gap-6  container">
      {conversation.map((message) => (
        <div key={message.id}>
          {message.display}
        </div>
      ))}

    </div>
    <form className="bg-neutral-900 p-8 flex items-center justify-center gap-4" onSubmit={submit}>
      <Input className="w-3/4" placeholder="enter your prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Button type="submit">Send</Button>
    </form>
  </main>
}

