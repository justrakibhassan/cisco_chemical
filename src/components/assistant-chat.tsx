"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Bot, 
  X, 
  Send, 
  MessageCircle, 
  Sparkles, 
  Beaker, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const AssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, status, error, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 128)}px`; // Max 128px (max-h-32)
    }
  }, [inputValue]);

  useEffect(() => {
    if (error) {
      console.error("AI CHAT ERROR:", error);
    }
  }, [error]);

  const isStreaming = status === "streaming" || status === "submitted";

  const onScroll = () => {
    if (viewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, status]);

  const handleManualSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage({ text });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMessageText = (m: any) => {
    if (m.content) {
      if (typeof m.content === 'string') return m.content;
      return JSON.stringify(m.content);
    }
    
    return m.parts
      ? (m.parts as Array<{ type: string; text?: string }>)
          .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join('')
      : "";
  };

  const renderFormattedLine = (line: string) => {
    // Regex matches markdown links, raw /products/... routes, and bold syntax
    const regex = /(\[.*?\]\(.*?\)|\/products\/[a-zA-Z0-9_-]+|\*\*.*?\*\*)/g;
    const parts = line.split(regex);

    return parts.map((part, i) => {
      const mdLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (mdLinkMatch) {
        const [, label, url] = mdLinkMatch;
        return (
          <Link
            key={i}
            href={url}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-0.5 font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            {label}
          </Link>
        );
      }

      if (part.startsWith("/products/")) {
        return (
          <Link
            key={i}
            href={part}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-xs border border-emerald-200/70 transition-all hover:bg-emerald-100"
          >
            <span>View Product</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-zinc-950">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  const FormattedMessage = ({ text }: { text: string }) => {
    const lines = text.split("\n");

    return (
      <div className="space-y-1 text-[14px]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
          const content = isBullet ? trimmed.slice(2) : line;

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div className="flex-1">{renderFormattedLine(content)}</div>
              </div>
            );
          }

          return <div key={idx}>{renderFormattedLine(line)}</div>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-28 sm:bottom-6 right-6 z-[100]"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black hover:bg-zinc-800 shadow-xl flex items-center justify-center group border-none relative overflow-hidden"
          size="icon"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white relative z-10" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed z-[110] bg-white shadow-2xl flex flex-col overflow-hidden",
              "inset-0 h-[100dvh] sm:h-[650px] sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:rounded-2xl sm:border sm:border-zinc-200"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 leading-tight">Cisco AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  className="w-8 h-8 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 relative bg-zinc-50/30 min-h-0">
              <ScrollArea 
                className="h-full" 
                viewportRef={viewportRef}
                onScroll={onScroll}
              >
                <div className="px-6 py-8 space-y-6">
                  {messages.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="text-center space-y-3 pt-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-6 h-6 text-zinc-900" />
                        </div>
                        <h4 className="text-lg font-semibold text-zinc-900 tracking-tight">How can I help?</h4>
                        <p className="text-sm text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                          Ask about our chemicals, pricing, or industrial solutions.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        {[
                          { text: "Browse product catalog", icon: Zap },
                          { text: "Request a bulk quote", icon: ShieldCheck },
                          { text: "View safety datasheets", icon: Beaker }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(item.text)}
                            className="flex items-center gap-3 w-full p-4 bg-white border border-zinc-100 rounded-xl hover:border-zinc-300 hover:shadow-sm transition-all text-left text-sm font-medium text-zinc-700 group"
                          >
                            <item.icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            {item.text}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex flex-col gap-2 max-w-[85%]",
                        m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed",
                          m.role === "user"
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-white text-zinc-800 border border-zinc-200 rounded-tl-none shadow-sm"
                        )}
                      >
                        {m.role === "user" ? (
                          getMessageText(m)
                        ) : (
                          <FormattedMessage text={getMessageText(m)} />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium px-1 uppercase tracking-wider">
                        {m.role === "user" ? "You" : "Cisco AI"}
                      </span>
                    </motion.div>
                  ))}

                  {isStreaming && (
                    <div className="flex flex-col gap-2 max-w-[85%] mr-auto items-start">
                      <div className="bg-white border border-zinc-200 px-4 py-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                      <p className="text-xs text-red-600 font-medium">
                        Something went wrong. Please try again later.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </ScrollArea>

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-white border border-zinc-200 rounded-full shadow-lg hover:bg-zinc-50 transition-colors z-20"
                  >
                    <ChevronRight className="w-4 h-4 rotate-90 text-zinc-500" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-white border-t border-zinc-100 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6">
              <form
                onSubmit={handleManualSubmit}
                className="relative flex items-end gap-2 max-w-4xl mx-auto w-full"
              >
                <div className="relative flex-1">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleManualSubmit();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 pr-14 text-[16px] text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all resize-none max-h-32 placeholder:text-zinc-400 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  />
                  <div className="absolute right-2.5 bottom-2.5">
                    <Button
                      type="submit"
                      disabled={isStreaming || !inputValue.trim()}
                      className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all disabled:opacity-20 p-0 shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </form>
              <p className="text-[10px] text-zinc-400 text-center mt-3 font-medium uppercase tracking-[0.2em] hidden sm:block">
                Cisco AI Enterprise Support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
