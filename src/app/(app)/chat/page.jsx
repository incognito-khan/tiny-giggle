"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  createMessage,
  getAllMessages,
  addMessage,
} from "@/store/slices/messageSlice";
import { getAllChats } from "@/store/slices/chatSlice";
import Loading from "@/components/loading";
import { pusherClient } from "@/lib/pusher-client";

export default function ChatPage() {
  const chats = useSelector((state) => state.chat.chats);
  console.log(chats);
  const messages = useSelector((state) => state.message.messages);
  console.log(messages, "messages");
  const user = useSelector((state) => state.auth.user);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(getAllChats({ setLoading, parentId: user.id }));
  }, []);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const channel = pusherClient.subscribe(`chat-${selectedChat.id}`);

    channel.bind("new-message", (newMsg) => {
      dispatch(addMessage(newMsg));
    });

    return () => {
      pusherClient.unsubscribe(`chat-${selectedChat.id}`);
    };
  }, [selectedChat?.id, dispatch]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await dispatch(
      createMessage({
        parentId: user.id,
        chatId: selectedChat?.id,
        senderId: user.id,
        content: input,
      })
    ).unwrap();
    setInput("");
  };

  const handleChatChange = (chat) => {
    setSelectedChat(chat);
    dispatch(
      getAllMessages({ setLoading, parentId: user.id, chatId: chat.id })
    );
  };

  return (
    <div className="flex h-[calc(100vh-150px)] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {loading && <Loading />}
      {/* Sidebar */}
      <aside className="w-[20%] border-r border-pink-100 bg-white/60 backdrop-blur-sm p-4">
        <h2 className="font-bold text-lg mb-4 text-gray-800">Chats</h2>
        <ScrollArea className="h-[70vh] pr-2">
          {chats?.map((chat, idx) => (
            <Card
              key={idx}
              className="mb-3 bg-white/80 border-pink-100 hover:shadow-md rounded-2xl cursor-pointer transition-all"
              onClick={() => handleChatChange(chat)}
            >
              <CardContent className="flex items-center gap-3 p-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                    {chat?.title ? chat.title.charAt(0).toUpperCase() : ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{chat?.title}</p>
                  {/* <p className="text-xs text-gray-500">Last message...</p> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </aside>

      {/* Chat Window */}
      {selectedChat?.id && (
        <main className="flex flex-1 flex-col h-full">
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-sm border-b border-pink-100 p-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                {selectedChat?.title
                  ? selectedChat?.title.charAt(0).toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-800">
                {selectedChat?.title}
              </p>
            </div>
          </header>

          {/* Messages */}
          {messages?.length !== 0 ? (
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar"
              ref={containerRef}
            >
              {messages?.map((msg) => (
                <div
                  key={msg?.id}
                  className={`flex ${msg?.senderId === user?.id ? "justify-end" : "justify-start"} pb-3`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs ${
                      msg?.senderId === user?.id
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-white border border-pink-100 text-gray-800"
                    }`}
                  >
                    {msg?.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 h-full w-full flex justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-500">
                No Message Found. Be the First!
              </h3>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-pink-100 bg-white/60 backdrop-blur-sm flex items-center gap-3 mb-5">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="rounded-full bg-gray-50 border-gray-200"
            />
            <Button
              onClick={handleSend}
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              Send
            </Button>
          </div>
        </main>
      )}
      {!selectedChat?.id && (
        <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
          <h2 className="text-lg font-semibold text-gray-500">
            Select Chat to See Messages
          </h2>
        </div>
      )}
    </div>
  );
}
