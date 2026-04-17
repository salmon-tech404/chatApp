import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserPlus, Check, X, Clock, Users } from "lucide-react";
import friendService from "@/services/friendService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, FriendRequest, Friend } from "@/types/user";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import UserChatDialog from "@/components/chat/UserChatDialog";

type Tab = "search" | "pending" | "friends";

interface AddFriendModelProps {
  asButton?: boolean;
}

const AddFriendModel = ({ asButton = false }: AddFriendModelProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("search");

  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const { user: currentUser } = useAuthStore();

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Pending
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  // Friends
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // Tracking ID đang được xử lý (accept/reject)
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // UserChatDialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userChatOpen, setUserChatOpen] = useState(false);

  // Load pending count khi mount (cho badge ngoài trigger)
  useEffect(() => {
    friendService
      .getPendingRequests()
      .then((reqs) => setPendingRequests(reqs))
      .catch(() => {});
  }, []);

  // Load data khi mở dialog và đổi tab
  useEffect(() => {
    if (!open) return;
    if (activeTab === "pending") fetchPending();
    if (activeTab === "friends") fetchFriends();
  }, [open, activeTab]);

  const fetchPending = async () => {
    setIsLoadingPending(true);
    try {
      const reqs = await friendService.getPendingRequests();
      setPendingRequests(reqs);
    } catch {
      toast.error("Lỗi khi tải danh sách lời mời");
    } finally {
      setIsLoadingPending(false);
    }
  };

  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const data = await friendService.getFriends();
      // API có thể trả về array hoặc { friends: [...] } hoặc { data: [...] }
      const list: Friend[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.friends)
          ? (data as any).friends
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
      setFriends(list);
    } catch (error) {
      console.error("fetchFriends error:", error);
      toast.error("Lỗi khi tải danh sách bạn bè");
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSearch = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await friendService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch {
      toast.error("Lỗi khi tìm kiếm người dùng");
    } finally {
      setIsSearching(false);
    }
  };

  const respondRequest = async (friendshipId: string, status: "accepted" | "rejected") => {
    setRespondingId(friendshipId);
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000),
      );
      await Promise.race([friendService.respondToRequest(friendshipId, status), timeout]);
      toast.success(status === "accepted" ? "Đã chấp nhận kết bạn!" : "Đã từ chối");
      fetchPending();
      if (status === "accepted") fetchConversations();
    } catch (error: unknown) {
      const isTimeout = error instanceof Error && error.message === "Request timeout";
      console.error("respondRequest error:", error);
      toast.error(isTimeout ? "Hết thời gian chờ, thử lại sau" : "Lỗi khi xử lý yêu cầu");
    } finally {
      setRespondingId(null);
    }
  };

  const pendingCount = pendingRequests.length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "search", label: "Tìm bạn" },
    { id: "pending", label: "Lời mời" },
    { id: "friends", label: "Bạn bè" },
  ];

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ── Trigger ─────────────────────────────────────── */}
      <DialogTrigger asChild>
        {asButton ? (
          /* Full-width button shown in sidebar */
          <button className="relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-[#2dd4bf]/50 hover:bg-[#2dd4bf]/5 transition-all text-sm font-medium">
            <Search className="h-4 w-4 shrink-0 text-[#2dd4bf]" />
            <span>Tìm kiếm bạn bè...</span>
            {pendingCount > 0 && (
              <span className="ml-auto h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
        ) : (
          /* Icon-only used as SidebarGroupAction */
          <div className="relative flex items-center justify-center w-full h-full">
            <UserPlus className="h-5 w-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-sidebar">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-background rounded-2xl overflow-hidden border-border/50 p-0">
        <DialogHeader className="px-6 pt-5 pb-0">
          <DialogTitle className="text-xl font-bold">Quản Lý Bạn Bè</DialogTitle>
        </DialogHeader>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="flex border-b mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-[#2dd4bf]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {/* Badge trên tab Lời mời */}
              {tab.id === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {pendingCount}
                </span>
              )}
              {/* Badge trên tab Bạn bè */}
              {tab.id === "friends" && friends.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf] text-[9px] font-bold">
                  {friends.length}
                </span>
              )}
              {/* Active indicator */}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Tìm bạn ─────────────────────────────── */}
        {activeTab === "search" && (
          <div className="p-5 h-[320px] flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Nhập tên hoặc username..."
                  className="w-full bg-muted/50 border rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/30 focus:border-[#2dd4bf]/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSearching ? "..." : "Tìm"}
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {searchResults.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                  <Search className="h-9 w-9" />
                  <p className="text-sm">Nhập tên để tìm kiếm người dùng</p>
                </div>
              ) : (
                searchResults.filter((u) => u._id !== currentUser?._id).map((u) => (
                  <div
                    key={u._id}
                    onClick={() => { setSelectedUser(u); setUserChatOpen(true); }}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:shadow-sm hover:border-[#2dd4bf]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback className="bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold">
                          {u.displayName?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm leading-tight">{u.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{u.username}</p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#2dd4bf]/10 text-[#2dd4bf] flex items-center justify-center">
                      <UserPlus className="h-4 w-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Lời mời ─────────────────────────────── */}
        {activeTab === "pending" && (
          <div className="p-5 h-[320px] flex flex-col">
            {isLoadingPending ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground animate-pulse">Đang tải...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                <Clock className="h-9 w-9" />
                <p className="text-sm">Không có lời mời nào đang chờ</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {pendingRequests.map((req) => {
                  const requester =
                    typeof req.requesterId === "object" && "_id" in req.requesterId
                      ? (req.requesterId as User)
                      : null;
                  if (!requester) return null;

                  return (
                    <div
                      key={req._id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={requester.avatarUrl} />
                        <AvatarFallback className="bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold">
                          {requester.username?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{requester.username}</p>
                        <p className="text-xs text-muted-foreground">Muốn kết bạn với bạn</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => respondRequest(req._id, "accepted")}
                          disabled={respondingId === req._id}
                          className="h-8 w-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-wait"
                          title="Chấp nhận"
                        >
                          {respondingId === req._id ? (
                            <span className="h-3 w-3 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => respondRequest(req._id, "rejected")}
                          disabled={respondingId === req._id}
                          className="h-8 w-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-wait"
                          title="Từ chối"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Bạn bè ──────────────────────────────── */}
        {activeTab === "friends" && (
          <div className="p-5 h-[320px] flex flex-col">
            {isLoadingFriends ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground animate-pulse">Đang tải...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                <Users className="h-9 w-9" />
                <p className="text-sm">Bạn chưa có bạn bè nào</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {friends.filter((f) => f._id !== currentUser?._id).map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={friend.avatarUrl} />
                        <AvatarFallback className="bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold">
                          {friend.displayName?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online dot */}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{friend.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{friend.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Dialog xem profile + kết bạn / nhắn tin */}
    <UserChatDialog
      user={selectedUser}
      open={userChatOpen}
      onOpenChange={setUserChatOpen}
      onNavigated={() => { setUserChatOpen(false); setOpen(false); }}
    />
  </>
  );
};

export default AddFriendModel;
