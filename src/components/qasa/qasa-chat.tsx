"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { X, Bot, User, Wand2, FileText } from "lucide-react";
import { generateSolutions } from "@/ai/flows/ai-qasa-content-generation";
import { summarizeDocument } from "@/ai/flows/ai-qasa-summarization";
import { ScrollArea } from "../ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { LineLoader } from "../ui/line-loader";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AiAction = "summarize" | "generate";

export function QasaChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [aiAction, setAiAction] = useState<AiAction>("generate");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isPending]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    startTransition(async () => {
      let assistantResponse = "Sorry, I couldn't process that request.";
      try {
        if (aiAction === 'generate') {
          const result = await generateSolutions({ problemDescription: currentInput });
          assistantResponse = "Here are some potential solutions:\n\n" + result.solutions.map(s => `• ${s}`).join('\n');
        } else {
          const result = await summarizeDocument({ documentContent: currentInput });
          assistantResponse = "Here is the summary:\n\n" + result.summary;
        }
      } catch (error) {
        console.error("AI action failed:", error);
        assistantResponse = "An error occurred while processing your request. Please try again.";
      }
      
      const assistantMessage: Message = { role: "assistant", content: assistantResponse };
      setMessages(prev => [...prev, assistantMessage]);
    });
  };

  const getPlaceholder = () => {
    return aiAction === 'generate' ? "Describe an IT problem..." : "Paste the document content to summarize...";
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <Card className="w-[90vw] max-w-2xl h-[80vh] flex flex-col bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="flex flex-row items-center justify-between border-b border-b-primary/10">
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Bot /> QASA Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4"/>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                  {msg.role === 'assistant' && <Bot className="text-primary flex-shrink-0 mt-1" />}
                  <div className={cn("rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && <User className="text-primary flex-shrink-0 mt-1" />}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3">
                  <Bot className="text-primary mt-1" />
                  <div className="rounded-lg px-4 py-2 bg-secondary flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center">
                      <LineLoader className="h-0.5" />
                    </div>
                    Thinking...
                  </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 border-t border-t-primary/10 pt-4">
            <RadioGroup defaultValue="generate" onValueChange={(value: AiAction) => setAiAction(value)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="generate" id="r1" />
                    <Label htmlFor="r1" className="flex items-center gap-2 cursor-pointer"><Wand2 size={16}/> Generate Solutions</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="summarize" id="r2" />
                    <Label htmlFor="r2" className="flex items-center gap-2 cursor-pointer"><FileText size={16}/> Summarize Document</Label>
                </div>
            </RadioGroup>
            <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="flex-1 resize-none bg-background"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    disabled={isPending}
                />
                <Button type="submit" disabled={isPending || !input.trim()} className="w-20">
                    {isPending ? <div className="w-full"><LineLoader className="h-0.5" /></div> : 'Send'}
                </Button>
            </form>
        </CardFooter>
      </Card>
    </div>
  );
}
