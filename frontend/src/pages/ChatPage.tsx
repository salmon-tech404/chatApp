// src/pages/ChatPage.tsx
// UI tĩnh — không kết nối backend hay store

import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Phone, Video, MoreHorizontal,
  Paperclip, Smile, Send, LogOut,
} from "lucide-react";
import styles from "@/styles/chat.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  text: string;
  mine: boolean;
  time: string;
  date?: string;
}

interface Conversation {
  id: number;
  name: string;
  initials: string;
  gradient: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "Nguyễn Linh",
    initials: "NL",
    gradient: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
    lastMessage: "Tuyệt vời! Design trông rất đẹp 🔥",
    time: "09:32",
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: "Hey, dự án mới tiến độ thế nào rồi? 🚀", mine: false, time: "09:28", date: "Hôm nay" },
      { id: 2, text: "Đang hoàn thiện phần auth, sắp xong rồi!", mine: true, time: "09:29" },
      { id: 3, text: "Xịn thế! Dùng gì để quản lý state vậy?", mine: false, time: "09:30" },
      { id: 4, text: "Zustand — nhẹ hơn Redux nhiều, highly recommend!", mine: true, time: "09:31" },
      { id: 5, text: "Tuyệt vời! Design trông rất đẹp 🔥", mine: false, time: "09:32" },
    ],
  },
  {
    id: 2,
    name: "Trần Minh Khoa",
    initials: "MK",
    gradient: "linear-gradient(135deg, #818cf8, #6366f1)",
    lastMessage: "Ok mình sẽ review PR sớm nhé",
    time: "08:15",
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: "Bạn có thể review PR #42 cho mình không?", mine: true, time: "08:10", date: "Hôm nay" },
      { id: 2, text: "Được, để mình xem qua nhé. Link PR đâu?", mine: false, time: "08:12" },
      { id: 3, text: "github.com/haloapp/frontend/pull/42", mine: true, time: "08:13" },
      { id: 4, text: "Ok mình sẽ review PR sớm nhé", mine: false, time: "08:15" },
    ],
  },
  {
    id: 3,
    name: "Lê Thu Hà",
    initials: "TH",
    gradient: "linear-gradient(135deg, #f472b6, #ec4899)",
    lastMessage: "Cảm ơn bạn nhiều lắm! ❤️",
    time: "Hôm qua",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "Mình gặp lỗi CORS khi deploy lên server!", mine: false, time: "16:20", date: "Hôm qua" },
      { id: 2, text: "Thêm origin vào cors config là xong nhé!", mine: true, time: "16:25" },
      { id: 3, text: "Ôi xong rồi!! 🎉", mine: false, time: "16:30" },
      { id: 4, text: "Cảm ơn bạn nhiều lắm! ❤️", mine: false, time: "16:31" },
    ],
  },
  {
    id: 4,
    name: "Nhóm Dev Team",
    initials: "DT",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    lastMessage: "Meeting 3h chiều nhé mọi người",
    time: "Hôm qua",
    unread: 5,
    online: false,
    messages: [
      { id: 1, text: "Sprint review tuần này mọi người chuẩn bị chưa?", mine: false, time: "09:00", date: "Hôm qua" },
      { id: 2, text: "Mình chuẩn bị rồi, backend done 90%", mine: true, time: "09:05" },
      { id: 3, text: "Meeting 3h chiều nhé mọi người", mine: false, time: "09:10" },
    ],
  },
  {
    id: 5,
    name: "Phạm Đức Anh",
    initials: "ĐA",
    gradient: "linear-gradient(135deg, #fb923c, #f97316)",
    lastMessage: "Bạn có tài liệu về WebSocket không?",
    time: "T2",
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: "Bạn có tài liệu về WebSocket không?", mine: false, time: "14:00", date: "Thứ 2" },
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [activeId, setActiveId] = useState(1);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Message[]>(MOCK_CONVERSATIONS[0].messages);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = MOCK_CONVERSATIONS.find((c) => c.id === activeId)!;

  // Scroll xuống cuối mỗi khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectConv = (conv: Conversation) => {
    setActiveId(conv.id);
    setMessages(conv.messages);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto resize textarea
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: Message = {
      id: Date.now(),
      text,
      mine: true,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Giả lập reply sau 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Nghe hay đấy! 👍",
        "Mình hiểu rồi, để mình xử lý nhé.",
        "OK! Mình sẽ kiểm tra lại sớm.",
        "Tuyệt! Cảm ơn bạn đã thông báo. 🙌",
        "Được rồi, tiến hành thôi! 🚀",
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: replies[Math.floor(Math.random() * replies.length)],
          mine: false,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.root}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>

        {/* Header */}
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Tin nhắn</span>
          <button className={styles.newChatBtn} title="Cuộc trò chuyện mới">
            <Plus size={16} color="#2dd4bf" />
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <div className={styles.searchWrapper}>
            <Search
              size={13}
              color="rgba(255,255,255,0.3)"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              className={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className={styles.convList}>
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.convItem} ${conv.id === activeId ? styles.convItemActive : ""}`}
              onClick={() => handleSelectConv(conv)}
            >
              <div className={styles.convAvatar} style={{ background: conv.gradient }}>
                {conv.initials}
                {conv.online && <span className={styles.onlineDot} />}
              </div>
              <div className={styles.convInfo}>
                <div className={styles.convName}>{conv.name}</div>
                <div className={styles.convLastMsg}>{conv.lastMessage}</div>
              </div>
              <div className={styles.convMeta}>
                <span className={styles.convTime}>{conv.time}</span>
                {conv.unread > 0 && (
                  <span className={styles.convBadge}>{conv.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerAvatar}>ME</div>
          <div>
            <div className={styles.footerName}>Tài khoản của tôi</div>
            <div className={styles.footerStatus}>● Đang hoạt động</div>
          </div>
          <button className={styles.logoutBtn} title="Đăng xuất">
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* ── Chat Area ───────────────────────────────────────────── */}
      <main className={styles.chatArea}>

        {/* Chat header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.chatHeaderAvatar} style={{ background: activeConv.gradient }}>
              {activeConv.initials}
            </div>
            <div>
              <div className={styles.chatHeaderName}>{activeConv.name}</div>
              <div className={styles.chatHeaderStatus}>
                {activeConv.online ? "● Đang hoạt động" : "Không hoạt động"}
              </div>
            </div>
          </div>
          <div className={styles.chatHeaderActions}>
            <button className={styles.headerAction} title="Gọi thoại">
              <Phone size={16} />
            </button>
            <button className={styles.headerAction} title="Gọi video">
              <Video size={16} />
            </button>
            <button className={styles.headerAction} title="Thêm tuỳ chọn">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((msg, idx) => (
            <div key={msg.id}>
              {/* Date divider */}
              {msg.date && (
                <div className={styles.dateDivider}>
                  <span className={styles.dateDividerText}>{msg.date}</span>
                </div>
              )}

              {/* Message row */}
              <div className={`${styles.msgRow} ${msg.mine ? styles.msgRowMine : ""}`}>
                {!msg.mine && (
                  <div className={styles.msgAvatar} style={{ background: activeConv.gradient }}>
                    {activeConv.initials}
                  </div>
                )}
                <div className={styles.msgGroup}>
                  <div className={`${styles.bubble} ${msg.mine ? styles.bubbleMine : ""}`}>
                    {msg.text}
                  </div>
                  <span className={styles.msgTime}>{msg.time}</span>
                </div>
              </div>

              {/* Khoảng cách khi đổi người gửi */}
              {idx < messages.length - 1 && messages[idx + 1].mine !== msg.mine && (
                <div style={{ height: 8 }} />
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className={styles.typingRow}>
              <div className={styles.msgAvatar} style={{ background: activeConv.gradient }}>
                {activeConv.initials}
              </div>
              <div className={styles.typingBubble}>
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <textarea
              ref={textareaRef}
              className={styles.msgInput}
              placeholder={`Nhắn tin cho ${activeConv.name}...`}
              rows={1}
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.inputActions}>
              <button className={styles.inputAction} title="Đính kèm file">
                <Paperclip size={17} />
              </button>
              <button className={styles.inputAction} title="Emoji">
                <Smile size={17} />
              </button>
              <button
                className={styles.sendBtn}
                onClick={sendMessage}
                disabled={!inputText.trim()}
                title="Gửi (Enter)"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          <p style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            textAlign: "center",
            marginTop: 8,
            fontFamily: "var(--font-body)",
          }}>
            Enter để gửi · Shift+Enter xuống dòng
          </p>
        </div>

      </main>
    </div>
  );
}
