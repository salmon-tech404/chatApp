import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { useChatStore } from "@/store/useChatStore";
import NavRail, { type NavPanel } from "@/components/layout/NavRail";
import ChatPanel from "@/components/layout/ChatPanel";
import FriendsPanel from "@/components/layout/FriendsPanel";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";

const ChatPage = () => {
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const selectedConversation = useChatStore((s) => s.selectedConversation);
  const [activePanel, setActivePanel] = useState<NavPanel>("chat");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  useEffect(() => {
    connectSocket();
    fetchConversations();
    return () => { disconnectSocket(); };
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) setMobileView("chat");
  }, [selectedConversation]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <NavRail activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* Side panel — full width on mobile when in list view */}
      <div className={`${mobileView === "list" ? "flex" : "hidden"} md:flex flex-col w-full md:w-[280px] shrink-0 border-r border-border/50 overflow-hidden pb-16 md:pb-0`}>
        {activePanel === "chat" && <ChatPanel />}
        {activePanel === "friends" && <FriendsPanel />}
      </div>

      {/* Chat window — full width on mobile when in chat view */}
      <div className={`${mobileView === "chat" ? "flex" : "hidden"} md:flex flex-1 overflow-hidden flex-col`}>
        <ChatWindowLayout onBack={() => setMobileView("list")} />
      </div>
    </div>
  );
};

export default ChatPage;
