import { useState, useEffect } from "react";
import { Search, UserPlus, Check, X, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import friendService from "@/services/friendService";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import UserChatDialog from "@/components/chat/UserChatDialog";
import type { User, FriendRequest, Friend } from "@/types/user";

type Tab = "search" | "pending" | "friends";

const FriendsPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const { user: currentUser } = useAuthStore();
  const fetchConversations = useChatStore((s) => s.fetchConversations);

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

  // Responding
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // UserChatDialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userChatOpen, setUserChatOpen] = useState(false);

  useEffect(() => {
    friendService
      .getPendingRequests()
      .then(setPendingRequests)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "pending") fetchPending();
    if (activeTab === "friends") fetchFriends();
  }, [activeTab]);

  const fetchPending = async () => {
    setIsLoadingPending(true);
    try {
      setPendingRequests(await friendService.getPendingRequests());
    } catch {
      toast.error("Lỗi khi tải lời mời");
    } finally {
      setIsLoadingPending(false);
    }
  };

  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const data = await friendService.getFriends();
      setFriends(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Lỗi khi tải danh sách bạn bè");
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      setSearchResults(await friendService.searchUsers(searchQuery));
    } catch {
      toast.error("Lỗi khi tìm kiếm");
    } finally {
      setIsSearching(false);
    }
  };

  const respondRequest = async (
    friendshipId: string,
    status: "accepted" | "rejected",
  ) => {
    setRespondingId(friendshipId);
    try {
      await friendService.respondToRequest(friendshipId, status);
      toast.success(
        status === "accepted" ? "Đã chấp nhận kết bạn!" : "Đã từ chối",
      );
      fetchPending();
      if (status === "accepted") fetchConversations();
    } catch {
      toast.error("Lỗi khi xử lý yêu cầu");
    } finally {
      setRespondingId(null);
    }
  };

  const pendingCount = pendingRequests.length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "friends", label: "Bạn bè" },
    { id: "search", label: "Tìm bạn" },
    { id: "pending", label: "Lời mời" },
  ];

  return (
    <div className='flex flex-col h-full bg-background'>
      {/* ── Header ───────────────────────────────── */}
      <div className='px-4 pt-4 pb-0 border-b shrink-0 border-border/50'>
        <h2 className='mb-3 text-lg font-black text-foreground'>Bạn Bè</h2>

        {/* Tabs */}
        <div className='flex'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 pb-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-[#2dd4bf]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.id === "pending" && pendingCount > 0 && (
                <span className='ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold'>
                  {pendingCount}
                </span>
              )}
              {tab.id === "friends" && friends.length > 0 && (
                <span className='ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf] text-[9px] font-bold'>
                  {friends.length}
                </span>
              )}
              {activeTab === tab.id && (
                <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] rounded-full' />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────── */}
      <div className='flex-1 overflow-y-auto'>
        {/* Search tab */}
        {activeTab === "search" && (
          <div className='flex flex-col h-full gap-3 p-3'>
            <form onSubmit={handleSearch} className='flex gap-2 shrink-0'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Tên, username hoặc user ID...'
                  className='w-full bg-muted/50 border rounded-xl py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/30 focus:border-[#2dd4bf]/50 transition-all'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type='submit'
                disabled={isSearching}
                className='px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white hover:opacity-90 disabled:opacity-50 shrink-0'
              >
                {isSearching ? "..." : "Tìm"}
              </button>
            </form>

            <div className='flex-1 space-y-1.5 overflow-y-auto'>
              {searchResults.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full gap-2 py-12 text-muted-foreground/40'>
                  <Search className='w-8 h-8' />
                  <p className='text-sm'>Nhập tên hoặc ID để tìm kiếm</p>
                </div>
              ) : (
                searchResults
                  .filter((u) => u._id !== currentUser?._id)
                  .map((u) => (
                    <div
                      key={u._id}
                      onClick={() => {
                        setSelectedUser(u);
                        setUserChatOpen(true);
                      }}
                      className='flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card hover:border-[#2dd4bf]/30 hover:shadow-sm transition-all cursor-pointer'
                    >
                      <div className='flex items-center gap-2.5 min-w-0'>
                        <Avatar className='w-10 h-10 shrink-0'>
                          <AvatarImage src={u.avatarUrl} />
                          <AvatarFallback className='bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold text-sm'>
                            {u.displayName?.charAt(0) ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                          <p className='font-semibold text-[15px] leading-tight truncate'>
                            {u.displayName}
                          </p>
                          <p className='text-sm truncate text-muted-foreground'>
                            @{u.username}
                          </p>
                        </div>
                      </div>
                      <div className='h-7 w-7 rounded-full bg-[#2dd4bf]/10 text-[#2dd4bf] flex items-center justify-center shrink-0'>
                        <UserPlus className='h-3.5 w-3.5' />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Pending tab */}
        {activeTab === "pending" && (
          <div className='p-3'>
            {isLoadingPending ? (
              <div className='flex items-center justify-center py-12 text-sm text-muted-foreground animate-pulse'>
                Đang tải...
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className='flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground/40'>
                <Clock className='w-8 h-8' />
                <p className='text-sm'>Không có lời mời nào đang chờ</p>
              </div>
            ) : (
              <div className='space-y-1.5'>
                {pendingRequests.map((req) => {
                  const requester =
                    typeof req.requesterId === "object" &&
                    "_id" in req.requesterId
                      ? (req.requesterId as User)
                      : null;
                  if (!requester) return null;

                  return (
                    <div
                      key={req._id}
                      className='flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 bg-card'
                    >
                      <Avatar className='h-9 w-9 shrink-0'>
                        <AvatarImage src={requester.avatarUrl} />
                        <AvatarFallback className='bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold text-sm'>
                          {requester.username?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-[15px] truncate'>
                          {requester.username}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Muốn kết bạn với bạn
                        </p>
                      </div>
                      <div className='flex items-center gap-1 shrink-0'>
                        <button
                          onClick={() => respondRequest(req._id, "accepted")}
                          disabled={respondingId === req._id}
                          className='flex items-center justify-center text-green-600 transition-colors rounded-full h-7 w-7 bg-green-500/10 hover:bg-green-500 hover:text-white disabled:opacity-40'
                        >
                          {respondingId === req._id ? (
                            <span className='w-3 h-3 border-2 border-green-600 rounded-full border-t-transparent animate-spin' />
                          ) : (
                            <Check className='h-3.5 w-3.5' />
                          )}
                        </button>
                        <button
                          onClick={() => respondRequest(req._id, "rejected")}
                          disabled={respondingId === req._id}
                          className='flex items-center justify-center text-red-500 transition-colors rounded-full h-7 w-7 bg-red-500/10 hover:bg-red-500 hover:text-white disabled:opacity-40'
                        >
                          <X className='h-3.5 w-3.5' />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Friends tab */}
        {activeTab === "friends" && (
          <div className='p-3'>
            {isLoadingFriends ? (
              <div className='flex items-center justify-center py-12 text-sm text-muted-foreground animate-pulse'>
                Đang tải...
              </div>
            ) : friends.length === 0 ? (
              <div className='flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground/40'>
                <Users className='w-8 h-8' />
                <p className='text-sm'>Bạn chưa có bạn bè nào</p>
              </div>
            ) : (
              <div className='space-y-1.5'>
                {friends
                  .filter((f) => f._id !== currentUser?._id)
                  .map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => {
                        setSelectedUser(friend);
                        setUserChatOpen(true);
                      }}
                      className='flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 bg-card hover:border-[#2dd4bf]/30 hover:shadow-sm transition-all cursor-pointer'
                    >
                      <Avatar className='h-9 w-9 shrink-0'>
                        <AvatarImage src={friend.avatarUrl} />
                        <AvatarFallback className='bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold text-sm'>
                          {friend.displayName?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-[15px] leading-tight truncate'>
                          {friend.displayName}
                        </p>
                        <p className='text-sm truncate text-muted-foreground'>
                          @{friend.username}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* UserChatDialog */}
      <UserChatDialog
        user={selectedUser}
        open={userChatOpen}
        onOpenChange={setUserChatOpen}
      />
    </div>
  );
};

export default FriendsPanel;
