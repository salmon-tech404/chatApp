import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Send, Paperclip, Image as ImageIcon } from "lucide-react";
import type { Participant } from "@/types/chat";

const ChatWindowLayout = () => {
  const { selectedConversation, messages, isSending, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom every time messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim()) return;
    sendMessage(content.trim(), "text");
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-background rounded-l-2xl shadow-sm border-l border-border/50">
        {/* Vòng tròn hiệu ứng layer đổ bóng */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute h-40 w-40 rounded-full bg-primary/5 animate-pulse"></div>
          <div className="absolute h-32 w-32 rounded-full bg-primary/10 animate-pulse delay-75"></div>
          <div className="absolute h-24 w-24 rounded-full bg-primary/20 animate-pulse delay-150"></div>
          
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/40 z-10">
            <MessageSquare className="h-7 w-7 text-primary-foreground drop-shadow-md" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
          Chào mừng bạn đến với Halo!
        </h2>
        <p className="text-[15px] text-muted-foreground font-medium">
          Chọn một cuộc hội thoại để bắt đầu chat!
        </p>
      </div>
    );
  }

  // Header Details
  let headerName = "Cuộc trò chuyện";
  let avatarUrl = "";
  let isGroup = selectedConversation.type === "group";

  if (isGroup) {
    headerName = selectedConversation.name || "Nhóm không tên";
  } else {
    const otherParticipant = selectedConversation.participants.find(
      (p) => typeof p !== "string" && p._id !== user?._id
    ) as Participant | undefined;
    if (otherParticipant) {
      headerName = otherParticipant.displayName;
      avatarUrl = otherParticipant.avatarUrl || "";
    }
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background rounded-l-2xl border-l border-border/50 shadow-sm overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b flex items-center px-6 shrink-0 bg-background z-10 shadow-sm">
        <Avatar className={`h-10 w-10 mr-4 ${isGroup ? "bg-primary/10" : ""}`}>
          {isGroup && !avatarUrl ? (
            <AvatarFallback><Users className="h-5 w-5 text-primary" /></AvatarFallback>
          ) : (
            <>
              <AvatarImage src={avatarUrl} alt={headerName} />
              <AvatarFallback>{headerName.charAt(0).toUpperCase()}</AvatarFallback>
            </>
          )}
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{headerName}</h2>
          <p className="text-xs text-muted-foreground">
            {isGroup ? `${selectedConversation.participants.length} thành viên` : "Online"}
          </p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMine = typeof msg.senderId === "string" ? msg.senderId === user?._id : msg.senderId._id === user?._id;
          
          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col max-w-[70%]">
                <div 
                  className={`px-4 py-2 rounded-2xl ${
                    isMine 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.type === "text" && <p className="text-[15px] whitespace-pre-wrap break-words">{msg.content}</p>}
                  {msg.type === "image" && <img src={msg.content} alt="Image" className="rounded-lg max-h-60 mt-1" />}
                </div>
                <span className={`text-[11px] text-muted-foreground mt-1 mx-1 block ${isMine ? "text-right" : "text-left"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {/* Empty div for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="flex items-center gap-2 bg-muted/50 border rounded-full px-2 p-1 focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all shadow-sm">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background shrink-0">
             <Paperclip className="h-5 w-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background shrink-0">
             <ImageIcon className="h-5 w-5" />
          </button>
          
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            className="flex-1 bg-transparent border-none outline-none py-2 px-2 text-[15px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <button 
             className={`p-2 rounded-full shrink-0 flex items-center justify-center transition-colors ${content.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
             onClick={handleSend}
             disabled={!content.trim() || isSending}
          >
             <Send className="h-5 w-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowLayout;
