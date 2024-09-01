"use client";
import React, { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";

interface Message {
  role: "user" | "bot";
  content: string;
}

const ConversationPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const chatForm = useForm({
    resolver: zodResolver(
      z.object({
        message: z.string().min(1, { message: "Message is required." }),
      })
    ),
  });

  const onChatSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.post("/api/chat", { message: data.message });
      setMessages([
        ...messages,
        { role: "user", content: data.message },
        { role: "bot", content: response.data.answer }, // Access the 'answer' property
      ]);
    } catch (error) {
      console.error("Error in chat: ", error);
      setError("An error occurred while sending the message. Please try again."); // Set error message
    }
    setIsLoading(false);
    chatForm.reset();
  };

  return (
    <div>
      <Heading
        title="Interactive Chatbot"
        description="Engage in a conversation."
      />

      {/* Chat Interaction Form */}
      <div className="px-4 lg:px-8 mt-4">
        <Form {...chatForm}>
          <form
            onSubmit={chatForm.handleSubmit(onChatSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input {...field} placeholder="Type your message" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full bg-green text-white"
              type="submit"
            >
              Send Message
            </Button>
          </form>
        </Form>
        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                }`}
              >
                {message.role === "user" ? "User" : "Bot"}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
