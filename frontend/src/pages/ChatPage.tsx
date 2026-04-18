import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { useChatStore } from "@/store/useChatStore";
import NavRail, { type NavPanel } from "@/components/layout/NavRail";
import ChatPanel from "@/components/layout/ChatPanel";
import FriendsPanel from "@/components/layout/FriendsPanel";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";

const ChatPage = () => {
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const [activePanel, setActivePanel] = useState<NavPanel>("chat");

  useEffect(() => {
    connectSocket();
    fetchConversations();
    return () => { disconnectSocket(); };
  }, [fetchConversations]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Nav Rail (64px) ─────────────────────── */}
      <NavRail activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* ── Side Panel (280px) ──────────────────── */}
      <div className="w-[280px] shrink-0 border-r border-border/50 overflow-hidden">
        {activePanel === "chat" && <ChatPanel />}
        {activePanel === "friends" && <FriendsPanel />}
      </div>

      {/* ── Chat window ─────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <ChatWindowLayout />
      </div>
    </div>
  );
};

export default ChatPage;
