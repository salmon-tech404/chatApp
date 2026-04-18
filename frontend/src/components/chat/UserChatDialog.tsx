import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  MessageSquare,
  Clock,
  Check,
  X,
  Lock,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import friendService from "@/services/friendService";
import { useChatStore } from "@/store/useChatStore";
import type { User } from "@/types/user";
import type { Participant } from "@/types/chat";

type FriendshipStatus = "none" | "pending" | "accepted" | "rejected";

interface StatusInfo {
  status: FriendshipStatus;
  friendshipId?: string;
  isSender?: boolean;
}

interface UserChatDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Gọi sau khi đã chọn conversation — dùng để đóng các dialog cha */
  onNavigated?: () => void;
}

const UserChatDialog = ({ user, open, onOpenChange, onNavigated }: UserChatDialogProps) => {
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({ status: "none" });
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);

  const { conversations, fetchConversations, selectConversation } = useChatStore();

  const loadStatus = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await friendService.getFriendshipStatus(user._id);
      setStatusInfo(data);
    } catch {
      toast.error("Không thể tải trạng thái bạn bè");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user) loadStatus();
  }, [open, user, loadStatus]);

  const handleSendRequest = async () => {
    if (!user) return;
    setIsActing(true);
    try {
      await friendService.sendFriendRequest(user._id);
      toast.success("Đã gửi lời mời kết bạn!");
      setStatusInfo({ status: "pending", isSender: true });
    } catch (err) {
      toast.error(isAxiosError(err) ? (err.response?.data?.message ?? "Lỗi khi gửi lời mời") : "Lỗi khi gửi lời mời");
    } finally {
      setIsActing(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!user) return;
    setIsActing(true);
    try {
      await friendService.cancelFriendRequest(user._id);
      toast.success("Đã hủy lời mời kết bạn");
      setStatusInfo({ status: "none" });
    } catch (err) {
      toast.error(isAxiosError(err) ? (err.response?.data?.message ?? "Lỗi khi hủy lời mời") : "Lỗi khi hủy lời mời");
    } finally {
      setIsActing(false);
    }
  };

  const handleRespond = async (action: "accepted" | "rejected") => {
    if (!statusInfo.friendshipId) return;
    setIsActing(true);
    try {
      await friendService.respondToRequest(statusInfo.friendshipId, action);
      if (action === "accepted") {
        toast.success("Đã chấp nhận kết bạn!");
        setStatusInfo({ status: "accepted" });
        await fetchConversations();
      } else {
        toast.success("Đã từ chối lời mời");
        setStatusInfo({ status: "none" });
      }
    } catch (err) {
      toast.error(isAxiosError(err) ? (err.response?.data?.message ?? "Lỗi khi xử lý lời mời") : "Lỗi khi xử lý lời mời");
    } finally {
      setIsActing(false);
    }
  };

  const handleOpenChat = () => {
    if (!user) return;
    const conv = conversations.find(
      (c) =>
        c.type === "direct" &&
        c.participants.some(
          (p): p is Participant =>
            typeof p !== "string" && p._id === user._id,
        ),
    );
    if (conv) {
      selectConversation(conv);
      onOpenChange(false);
      onNavigated?.();
    } else {
      toast.error("Chưa tìm thấy cuộc trò chuyện, thử lại sau");
    }
  };

  if (!user) return null;

  const initials = user.displayName?.charAt(0).toUpperCase() ?? "U";

  // ── Friendship action area ─────────────────────────────
  const renderActions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <span className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
          Đang tải...
        </div>
      );
    }

    if (statusInfo.status === "none" || statusInfo.status === "rejected") {
      return (
        <button
          onClick={handleSendRequest}
          disabled={isActing}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isActing ? (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Kết bạn
        </button>
      );
    }

    if (statusInfo.status === "pending" && statusInfo.isSender) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-muted text-muted-foreground">
            <Clock className="h-4 w-4" />
            Đang chờ xác nhận
          </div>
          <button
            onClick={handleCancelRequest}
            disabled={isActing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-red-500 hover:border-red-400 disabled:opacity-50 transition-colors"
          >
            {isActing ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            Hủy lời mời
          </button>
        </div>
      );
    }

    if (statusInfo.status === "pending" && !statusInfo.isSender) {
      return (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground mr-1">Đã gửi lời mời cho bạn</p>
          <button
            onClick={() => handleRespond("accepted")}
            disabled={isActing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white disabled:opacity-50 transition-colors"
          >
            {isActing ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Chấp nhận
          </button>
          <button
            onClick={() => handleRespond("rejected")}
            disabled={isActing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Từ chối
          </button>
        </div>
      );
    }

    if (statusInfo.status === "accepted") {
      return (
        <button
          onClick={handleOpenChat}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white hover:opacity-90 transition-all"
        >
          <MessageSquare className="h-4 w-4" />
          Nhắn tin
        </button>
      );
    }

    return null;
  };

  // ── Chat body ──────────────────────────────────────────
  const isFriend = statusInfo.status === "accepted";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background rounded-2xl overflow-hidden border-border/50 p-0 gap-0">
        {/* ── Header ───────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#2dd4bf]/10 to-[#0ea5e9]/10 px-6 pt-6 pb-5 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="sr-only">Thông tin người dùng</DialogTitle>
          </DialogHeader>

          {/* Friend status badge */}
          {!isLoading && (
            <div className="absolute top-4 right-4">
              {isFriend ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                  <UserCheck className="h-3 w-3" /> Bạn bè
                </span>
              ) : statusInfo.status === "pending" ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Clock className="h-3 w-3" /> Đang chờ
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  <UserMinus className="h-3 w-3" /> Chưa kết bạn
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-[#2dd4bf]/30 ring-offset-2 ring-offset-background">
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-[#2dd4bf]/20 to-[#0ea5e9]/20 text-[#0ea5e9]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-foreground leading-tight truncate">
                {user.displayName}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">@{user.username}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1 font-mono">
                ID: {user._id}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center gap-2">
            {renderActions()}
          </div>
        </div>

        {/* ── Chat area ─────────────────────────────────── */}
        <div className="relative flex flex-col h-[260px]">
          {/* Locked overlay when not friends */}
          {!isFriend && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Kết bạn để bắt đầu nhắn tin
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-52">
                {statusInfo.status === "pending" && statusInfo.isSender
                  ? "Đang chờ người dùng chấp nhận lời mời của bạn"
                  : statusInfo.status === "pending" && !statusInfo.isSender
                  ? "Chấp nhận lời mời để bắt đầu trò chuyện"
                  : "Gửi lời mời kết bạn để có thể nhắn tin"}
              </p>
            </div>
          )}

          {/* Fake message area */}
          <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <MessageSquare className="h-10 w-10" />
            <p className="text-xs">
              {isFriend ? "Bắt đầu cuộc trò chuyện!" : ""}
            </p>
          </div>

          {/* Fake input bar */}
          <div className="shrink-0 border-t px-3 py-2.5">
            <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl px-3 py-2 opacity-50 pointer-events-none select-none">
              <span className="flex-1 text-sm text-muted-foreground/50">
                {isFriend ? "Nhập tin nhắn..." : "Kết bạn để nhắn tin..."}
              </span>
              <div className="p-1.5 rounded-lg bg-muted">
                <MessageSquare className="h-4 w-4 text-muted-foreground/40" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserChatDialog;
