import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
};

const SUGGESTED_PROMPTS = [
  "איפה אתה מרגיש את זה בגוף?",
  "בוא נעשה עצירה של 3 דקות",
  "איזה דפוס חוזר הופיע היום?",
  "איזור בכף הרגל רגיש לי"
];

const BOT_RESPONSES = [
  "נסה לקחת נשימה עמוקה אל תוך האזור המורגש. האם התחושה משתנה?",
  "הרבה פעמים רגישות באזור הזה קשורה לעומס מצטבר. מתי שמת לב לזה לראשונה?",
  "בואו ניקח רגע. שים לב לכפות הרגליים שלך על הקרקע. האם אתה יכול לרכך את המאמץ שם?",
  "זה מעניין. ברפלקסולוגיה, האזור הזה מייצג גם החזקה רגשית. האם זה מהדהד לך?"
];

export default function AIGuide() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "שלום, אני מדריך המודעות שלך. על מה תרצה להתבונן היום?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsgId = Date.now();
    setMessages(prev => [...prev, { id: newMsgId, text, sender: "user" }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, text: randomResponse, sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      <header className="mb-6 text-center shrink-0">
        <h1 className="text-3xl font-light text-primary">מדריך גוף</h1>
        <p className="text-muted-foreground mt-1">חקירה משותפת של תחושות ודפוסים פיזיים</p>
      </header>

      <Card className="flex-1 border-none shadow-sm flex flex-col overflow-hidden bg-card/80 backdrop-blur-sm">
        <ScrollArea className="flex-1 p-4 h-full" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'bot' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                  {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'bot' 
                    ? 'bg-muted text-foreground rounded-tr-none' 
                    : 'bg-primary text-primary-foreground rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card">
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_PROMPTS.map(prompt => (
              <button 
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-muted hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1.5 rounded-full border"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="כתוב כאן תחושה או שאלה..." 
              className="rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0">
              <Send className="w-4 h-4 rtl:-scale-x-100" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
