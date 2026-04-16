import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOnlineStore } from "@/store/useOnlineStore";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare, Users, Send, Paperclip, Image as ImageIcon,
  Phone, Video, MoreVertical, Smile, FileText, X, Download,
  Music, Film,
} from "lucide-react";
import type { Participant } from "@/types/chat";

// ── Emoji data ────────────────────────────────────────────
const EMOJI_CATEGORIES = [
  { label: "😊 Biểu cảm", emojis: ["😀","😂","🥲","😊","😇","🙂","😉","😌","😍","🥰","😘","😋","😜","🤪","😎","🤓","🤩","🥳","😏","😒","😞","😢","😭","😤","😡","🤯","😳","🥺","😱","😰","😓","🤔","🤭","😬","🙄","😴"] },
  { label: "👋 Cử chỉ", emojis: ["👍","👎","👏","🙌","🤝","✌️","🤞","🤟","🤘","👌","🤌","🤙","👊","✊","🖐️","✋","👋","🤏","🫶","💪","🙏","💅","🤲"] },
  { label: "❤️ Ký hiệu", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💔","💕","💞","💗","💓","💘","💝","🔥","✨","⭐","🌟","💫","🎉","🎊","🎈","🏆","🌈","💯","✅","❌","⚡","💥","🔔","🎵"] },
  { label: "🍕 Đồ ăn", emojis: ["🍕","🍔","🍟","🌮","🌯","🥗","🍜","🍱","🍣","🍦","🍰","🎂","🍩","🍪","☕","🍵","🧃","🥤","🍺","🥂","🧋","🍓","🍇","🥑"] },
  { label: "🚀 Khác", emojis: ["⚽","🏀","🎮","🎯","🎲","🎵","🎶","📱","💻","📷","🎬","📚","🚀","✈️","🏠","🚗","🌍","🌙","☀️","🌊","🐱","🐶","🦄","🌸"] },
];

// ── File type helper ──────────────────────────────────────
interface FilePayload {
  name: string;
  size: number;
  mimeType: string;
  data: string; // base64 dataURL
}

const parseFilePayload = (content: string): FilePayload | null => {
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.name && parsed.data) return parsed as FilePayload;
    return null;
  } catch {
    return null;
  }
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileCard = ({
  payload,
  isMine,
}: {
  payload: FilePayload;
  isMine: boolean;
}) => {
  const mime = payload.mimeType || "";

  // Ảnh — hiển thị inline
  if (mime.startsWith("image/")) {
    return (
      <div className="relative group">
        <img
          src={payload.data}
          alt={payload.name}
          className="rounded-xl max-h-60 max-w-xs object-cover"
        />
        <a
          href={payload.data}
          download={payload.name}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          title="Tải xuống"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Xác định icon + màu theo loại file
  let Icon = FileText;
  let iconColor = "text-muted-foreground";
  let iconBg = "bg-muted";

  if (mime === "application/pdf") { Icon = FileText; iconColor = "text-red-500"; iconBg = "bg-red-500/10"; }
  else if (mime.includes("word") || mime.includes("document")) { Icon = FileText; iconColor = "text-blue-500"; iconBg = "bg-blue-500/10"; }
  else if (mime.includes("sheet") || mime.includes("excel")) { Icon = FileText; iconColor = "text-green-600"; iconBg = "bg-green-600/10"; }
  else if (mime.includes("presentation") || mime.includes("powerpoint")) { Icon = FileText; iconColor = "text-orange-500"; iconBg = "bg-orange-500/10"; }
  else if (mime.startsWith("video/")) { Icon = Film; iconColor = "text-purple-500"; iconBg = "bg-purple-500/10"; }
  else if (mime.startsWith("audio/")) { Icon = Music; iconColor = "text-pink-500"; iconBg = "bg-pink-500/10"; }

  const cardBg = isMine ? "bg-white/15" : "bg-background/80";

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${cardBg} border border-white/10 min-w-0`}>
      {/* Icon */}
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className={`text-[13px] font-semibold truncate max-w-40 ${isMine ? "text-white" : "text-foreground"}`}>
          {payload.name}
        </span>
        <span className={`text-[11px] ${isMine ? "text-white/60" : "text-muted-foreground"}`}>
          {formatSize(payload.size)}
        </span>
      </div>
      {/* Download */}
      <a
        href={payload.data}
        download={payload.name}
        className={`shrink-0 p-1.5 rounded-lg transition-colors ${
          isMine
            ? "text-white/70 hover:text-white hover:bg-white/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        title="Tải xuống"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
};

// ── Main component ────────────────────────────────────────
const ChatWindowLayout = () => {
  const { selectedConversation, messages, isSending, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const onlineUserIds = useOnlineStore((state) => state.onlineUserIds);

  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Attachment: ảnh hoặc file đều lưu dưới dạng { file, dataUrl, payload }
  const [selectedImage, setSelectedImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ file: File; payload: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── File handlers ─────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("Ảnh quá lớn! Tối đa 10MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({ file, dataUrl: reader.result as string });
      setSelectedFile(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { alert("File quá lớn! Tối đa 20MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const payload: FilePayload = {
        name: file.name,
        size: file.size,
        mimeType: file.type,
        data: reader.result as string,
      };
      setSelectedFile({ file, payload: JSON.stringify(payload) });
      setSelectedImage(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clearAttachment = () => { setSelectedImage(null); setSelectedFile(null); };

  const handleSend = () => {
    if (selectedImage) {
      sendMessage(selectedImage.dataUrl, "image");
      setSelectedImage(null);
      return;
    }
    if (selectedFile) {
      sendMessage(selectedFile.payload, "file");
      setSelectedFile(null);
      return;
    }
    if (!content.trim()) return;
    sendMessage(content.trim(), "text");
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = !!(content.trim() || selectedImage || selectedFile);

  // ── Empty state ───────────────────────────────────────
  if (!selectedConversation) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-background border-l border-border/50">
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute h-44 w-44 rounded-full bg-[#2dd4bf]/5 animate-pulse" />
          <div className="absolute h-32 w-32 rounded-full bg-[#2dd4bf]/10 animate-pulse [animation-delay:150ms]" />
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-[#2dd4bf] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-[#2dd4bf]/30 z-10">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-black bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] bg-clip-text text-transparent mb-2">
          Chào mừng đến với Halo!
        </h2>
        <p className="text-sm text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
      </div>
    );
  }

  // ── Header info ───────────────────────────────────────
  const isGroup = selectedConversation.type === "group";
  let headerName = "Cuộc trò chuyện";
  let avatarUrl = "";
  let otherUserId = "";

  if (isGroup) {
    headerName = selectedConversation.name || "Nhóm không tên";
  } else {
    const other = selectedConversation.participants.find(
      (p): p is Participant => typeof p !== "string" && p._id !== user?._id,
    );
    if (other) { headerName = other.displayName; avatarUrl = other.avatarUrl || ""; otherUserId = other._id; }
  }

  const dmOnline = !isGroup && otherUserId ? onlineUserIds.includes(otherUserId) : false;

  const getSender = (senderId: string | { _id: string }): Participant | null => {
    const id = typeof senderId === "string" ? senderId : senderId._id;
    return (selectedConversation.participants.find(
      (p): p is Participant => typeof p !== "string" && p._id === id,
    )) ?? null;
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-background border-l border-border/50 overflow-hidden">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="shrink-0 h-16 border-b flex items-center justify-between px-5 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-[#2dd4bf]/20">
              {isGroup ? (
                <AvatarFallback className="bg-gradient-to-br from-[#2dd4bf]/20 to-[#0ea5e9]/20">
                  <Users className="h-5 w-5 text-[#0ea5e9]" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={avatarUrl} alt={headerName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#2dd4bf]/30 to-[#0ea5e9]/30 text-[#0ea5e9] font-bold">
                    {headerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            {/* Online dot cho DM */}
            {!isGroup && (
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${dmOnline ? "bg-green-500" : "bg-muted-foreground/30"}`} />
            )}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-foreground leading-tight">{headerName}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              {isGroup ? (
                <><Users className="h-3 w-3" />{selectedConversation.participants.length} thành viên</>
              ) : (
                <><span className={`h-1.5 w-1.5 rounded-full inline-block ${dmOnline ? "bg-green-500" : "bg-muted-foreground/40"}`} />{dmOnline ? "Đang hoạt động" : "Ngoại tuyến"}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {([Phone, Video, MoreVertical] as const).map((Icon, i) => (
            <button key={i} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
              <Icon className="h-[18px] w-[18px]" />
            </button>
          ))}
        </div>
      </header>

      {/* ── Messages ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-0.5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
            <MessageSquare className="h-10 w-10" />
            <p className="text-sm">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = typeof msg.senderId === "string"
              ? msg.senderId === user?._id
              : msg.senderId._id === user?._id;
            const sender = !isMine ? getSender(msg.senderId) : null;
            const prev = index > 0 ? messages[index - 1] : null;
            const prevId = prev ? (typeof prev.senderId === "string" ? prev.senderId : prev.senderId._id) : null;
            const currId = typeof msg.senderId === "string" ? msg.senderId : msg.senderId._id;
            const isFirstInGroup = prevId !== currId;
            const filePayload = msg.type === "file" ? parseFilePayload(msg.content) : null;

            return (
              <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-4" : "mt-0.5"}`}>
                {!isMine && (
                  <div className="w-8 mr-2 shrink-0 self-end mb-1">
                    {isGroup && isFirstInGroup ? (
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={sender?.avatarUrl} />
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-semibold">
                          {sender?.displayName?.charAt(0).toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    ) : <div className="h-7 w-7" />}
                  </div>
                )}

                <div className={`flex flex-col max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && isGroup && isFirstInGroup && sender && (
                    <span className="text-[11px] font-semibold text-[#0ea5e9] mb-1 ml-1">{sender.displayName}</span>
                  )}

                  <div className={`px-4 py-2.5 rounded-2xl ${
                    isMine
                      ? "bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] text-white rounded-tr-sm shadow-sm shadow-[#2dd4bf]/20"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}>
                    {msg.type === "text" && (
                      <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                    )}
                    {msg.type === "image" && (
                      <div className="relative group">
                        <img src={msg.content} alt="Ảnh" className="rounded-xl max-h-60 max-w-xs object-cover" />
                        <a
                          href={msg.content}
                          download="image"
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Tải xuống"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                    {msg.type === "file" && (
                      filePayload
                        ? <FileCard payload={filePayload} isMine={isMine} />
                        : <div className="flex items-center gap-2"><FileText className="h-4 w-4 shrink-0" /><span className="text-[13px] break-all">{msg.content}</span></div>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ──────────────────────────────────── */}
      <div className="shrink-0 bg-background border-t">
        {/* Attachment preview */}
        {(selectedImage || selectedFile) && (
          <div className="px-4 pt-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border w-fit max-w-xs">
              {selectedImage ? (
                <><img src={selectedImage.dataUrl} className="h-10 w-10 rounded-lg object-cover shrink-0" /><span className="text-xs text-muted-foreground truncate max-w-32">{selectedImage.file.name}</span></>
              ) : selectedFile ? (
                <><div className="h-10 w-10 rounded-lg bg-[#2dd4bf]/10 flex items-center justify-center shrink-0"><FileText className="h-5 w-5 text-[#2dd4bf]" /></div><div className="min-w-0"><p className="text-xs font-semibold truncate max-w-32">{selectedFile.file.name}</p><p className="text-[10px] text-muted-foreground">{formatSize(selectedFile.file.size)}</p></div></>
              ) : null}
              <button onClick={clearAttachment} className="shrink-0 p-1 rounded-full hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="p-4">
          <div className="relative" ref={emojiPickerRef}>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 w-80 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="flex gap-1 px-3 pt-3 pb-2 border-b overflow-x-auto">
                  {EMOJI_CATEGORIES.map((cat, i) => (
                    <button key={i} onClick={() => setActiveCategoryIdx(i)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${activeCategoryIdx === i ? "bg-[#2dd4bf]/15 text-[#2dd4bf]" : "text-muted-foreground hover:bg-muted"}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-9 gap-0.5 p-3">
                  {EMOJI_CATEGORIES[activeCategoryIdx].emojis.map((emoji, i) => (
                    <button key={i} onClick={() => setContent((p) => p + emoji)}
                      className="text-xl w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors">
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

            <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#2dd4bf]/30 focus-within:border-[#2dd4bf]/50 transition-all">
              <button onClick={() => setShowEmojiPicker((v) => !v)}
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${showEmojiPicker ? "bg-[#2dd4bf]/15 text-[#2dd4bf]" : "text-muted-foreground hover:text-[#2dd4bf] hover:bg-[#2dd4bf]/10"}`}
                title="Emoji">
                <Smile className="h-[18px] w-[18px]" />
              </button>
              <button onClick={() => imageInputRef.current?.click()}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-colors shrink-0" title="Gửi ảnh">
                <ImageIcon className="h-[18px] w-[18px]" />
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-colors shrink-0" title="Gửi file">
                <Paperclip className="h-[18px] w-[18px]" />
              </button>

              <input type="text"
                placeholder={selectedImage ? "Thêm chú thích..." : selectedFile ? "Thêm mô tả..." : "Nhập tin nhắn..."}
                className="flex-1 bg-transparent border-none outline-none py-1.5 px-2 text-[14px] text-foreground placeholder:text-muted-foreground/60"
                value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={handleKeyDown} />

              <button onClick={handleSend} disabled={!canSend || isSending}
                className={`p-2 rounded-xl shrink-0 flex items-center justify-center transition-all ${canSend ? "bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] text-white shadow-sm shadow-[#2dd4bf]/25 hover:scale-105" : "bg-muted text-muted-foreground/40 cursor-not-allowed"}`}>
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowLayout;
