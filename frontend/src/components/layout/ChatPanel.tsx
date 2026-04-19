import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOnlineStore } from "@/store/useOnlineStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { Participant } from "@/types/chat";
import NewGroupChatModel from "@/components/chat/NewGroupChatModel";
import CreateNewChat from "@/components/chat/CreateNewChat";

const ChatPanel = () => {
  const {
    conversations,
    selectConversation,
    selectedConversation,
    unreadCounts,
  } = useChatStore();
  const { user } = useAuthStore();
  const onlineUserIds = useOnlineStore((s) => s.onlineUserIds);

  const sorted = [...conversations].sort((a, b) => {
    const ta = a.lastMessageAt
      ? new Date(a.lastMessageAt).getTime()
      : new Date(a.updatedAt).getTime();
    const tb = b.lastMessageAt
      ? new Date(b.lastMessageAt).getTime()
      : new Date(b.updatedAt).getTime();
    return tb - ta;
  });

  const dmList = sorted.filter((c) => c.type !== "group");
  const groupList = sorted.filter((c) => c.type === "group");

  const formatTime = (dateStr: string) =>
    new Intl.DateTimeFormat("vi-VN", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(dateStr));

  const lastMsgPreview = (conv: (typeof conversations)[0]) => {
    if (!conv.lastMessage) return "Chưa có tin nhắn";
    if (typeof conv.lastMessage === "string") return "Tin nhắn mới";
    return conv.lastMessage.type === "text"
      ? conv.lastMessage.content
      : conv.lastMessage.type === "image"
        ? "[Hình ảnh]"
        : "[Tệp đính kèm]";
  };

  const renderConv = (conv: (typeof conversations)[0]) => {
    const isActive = selectedConversation?._id === conv._id;
    const unread = unreadCounts[conv._id] ?? 0;
    const isGroup = conv.type === "group";

    const other = !isGroup
      ? conv.participants.find(
          (p): p is Participant => typeof p !== "string" && p._id !== user?._id,
        )
      : null;

    const displayName = isGroup
      ? (conv.name ?? "Nhóm không tên")
      : (other?.displayName ?? "Unknown");
    const avatarUrl = other?.avatarUrl;
    const online =
      !isGroup && other ? onlineUserIds.includes(other._id) : false;
    const timeStr = formatTime(conv.lastMessageAt ?? conv.updatedAt);
    const preview = lastMsgPreview(conv);

    const participantObjects = conv.participants.filter(
      (p): p is Participant => typeof p !== "string",
    );
    const others = participantObjects.filter((p) => p._id !== user?._id);
    const stackAvatars = (
      others.length > 0 ? others : participantObjects
    ).slice(0, 2);

    return (
      <button
        key={conv._id}
        onClick={() => selectConversation(conv)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all text-left ${
          isActive
            ? "bg-[#2dd4bf]/10 border-[#2dd4bf]/25 shadow-sm"
            : unread > 0
              ? "bg-background border-[#2dd4bf]/15 hover:bg-muted/50"
              : "bg-background border-transparent hover:bg-muted/50 hover:border-border/40"
        }`}
      >
        {/* Avatar */}
        <div className='relative shrink-0'>
          {isGroup ? (
            <div className='relative flex items-center justify-center w-10 h-10'>
              {stackAvatars.length === 0 ? (
                <div className='h-10 w-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center'>
                  <Users className='h-5 w-5 text-[#2dd4bf]/70' />
                </div>
              ) : (
                <div className='flex -space-x-2.5'>
                  {stackAvatars.map((p, i) => (
                    <Avatar
                      key={p._id}
                      className={`h-7 w-7 border-2 border-background ${i === 0 ? "z-20" : "z-10"}`}
                    >
                      <AvatarImage src={p.avatarUrl} />
                      <AvatarFallback className='text-[10px] bg-gradient-to-br from-[#2dd4bf]/25 to-[#0ea5e9]/25 text-[#0ea5e9] font-semibold'>
                        {p.displayName?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
              <div className='absolute -bottom-1 -right-1 h-4 min-w-4 px-0.5 rounded-full bg-[#0ea5e9] text-white text-[9px] font-bold flex items-center justify-center border-2 border-background'>
                {conv.participants.length}
              </div>
            </div>
          ) : (
            <Avatar className='w-10 h-10 border border-border/40'>
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className='bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold'>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          {!isGroup && (
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${online ? "bg-green-500" : "bg-muted-foreground/30"}`}
            />
          )}
        </div>

        {/* Text */}
        <div className='flex flex-col flex-1 min-w-0 overflow-hidden'>
          <div className='flex items-center justify-between gap-1'>
            <span
              className={`font-bold text-[15px] leading-tight truncate ${isActive ? "text-[#2dd4bf]" : "text-foreground"}`}
            >
              {displayName}
            </span>
            <span className='text-xs text-muted-foreground shrink-0'>
              {timeStr}
            </span>
          </div>
          <div className='flex items-center justify-between gap-1 mt-0.5'>
            <span
              className={`text-sm truncate ${unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              {preview}
            </span>
            {unread > 0 && !isActive && (
              <span className='shrink-0 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white text-[9px] font-bold flex items-center justify-center'>
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <p className='px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 select-none'>
      {label}
    </p>
  );

  return (
    <div className='flex flex-col h-full bg-background'>
      {/* ── Header ───────────────────────────────── */}
      <div className='px-4 pt-4 pb-3 border-b shrink-0 border-border/50'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-lg font-black text-foreground'>Tin nhắn</h2>
          <div className='flex items-center justify-center w-8 h-8'>
            <NewGroupChatModel />
          </div>
        </div>
        <CreateNewChat />
      </div>

      {/* ── Conversation list ─────────────────────── */}
      <div className='flex-1 px-2 py-2 overflow-y-auto'>
        {sorted.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full gap-2 py-16 text-muted-foreground/40'>
            <Users className='h-9 w-9' />
            <p className='text-sm'>Chưa có cuộc trò chuyện nào</p>
          </div>
        ) : (
          <div className='space-y-1'>
            {/* ── Tin nhắn trực tiếp ── */}
            {dmList.length > 0 && (
              <>
                <SectionLabel label='Trực tiếp' />
                {dmList.map(renderConv)}
              </>
            )}

            {/* ── Divider ── */}
            {dmList.length > 0 && groupList.length > 0 && (
              <div className='h-px mx-2 my-2 bg-border/50' />
            )}

            {/* ── Nhóm ── */}
            {groupList.length > 0 && (
              <>
                <SectionLabel label='Nhóm' />
                {groupList.map(renderConv)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
