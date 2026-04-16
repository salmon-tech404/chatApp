import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserPlus, Check, X, Clock } from "lucide-react";
import friendService from "@/services/friendService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, FriendRequest } from "@/types/user";
import { useChatStore } from "@/store/useChatStore";

const AddFriendModel = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "pending">("search");
  
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Pending state
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  useEffect(() => {
    if (open && activeTab === "pending") {
      fetchPendingRequests();
    }
  }, [open, activeTab]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await friendService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm người dùng");
    } finally {
      setIsSearching(false);
    }
  };

  const fetchPendingRequests = async () => {
    setIsLoadingPending(true);
    try {
      const reqs = await friendService.getPendingRequests();
      setPendingRequests(reqs);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lời mời");
    } finally {
      setIsLoadingPending(false);
    }
  };

  const sendRequest = async (userId: string) => {
    try {
      await friendService.sendFriendRequest(userId);
      toast.success("Đã gửi lời mời kết bạn!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi lời mời");
    }
  };

  const respondRequest = async (friendshipId: string, status: "accepted" | "rejected") => {
    try {
      await friendService.respondToRequest(friendshipId, status);
      toast.success(status === "accepted" ? "Đã chấp nhận kết bạn!" : "Đã từ chối kết bạn");
      
      // Cập nhật lại list
      fetchPendingRequests();
      if (status === "accepted") {
         fetchConversations();
      }
    } catch (error) {
       toast.error("Lỗi khi xử lý yêu cầu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         {/* Button bọc ngoài trigger */}
         <div className="w-full h-full flex items-center justify-between text-sidebar-foreground p-2 rounded-2xl bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors">
            <span className="font-semibold text-sm">Thêm Bạn Mới</span>
            <UserPlus className="h-4 w-4" />
         </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background rounded-2xl overflow-hidden border-border/50">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold">Quản Lý Bạn Bè</DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "search" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("search")}
          >
            Tìm Trực Tuyến
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === "pending" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("pending")}
          >
            Lời Mời Chờ
            {pendingRequests.length > 0 && activeTab !== "pending" && (
                <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    !
                </span>
            )}
          </button>
        </div>

        {/* Tab Content: Search */}
        {activeTab === "search" && (
          <div className="p-6 h-[300px] flex flex-col">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Nhập tên hoặc email..." 
                  className="w-full bg-muted/50 border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {isSearching ? "Tìm..." : "Tìm"}
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {searchResults.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Search className="h-10 w-10 mb-2" />
                  <p className="text-sm">Chưa có kết quả nào</p>
                </div>
              ) : (
                searchResults.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.displayName}</span>
                        <span className="text-xs text-muted-foreground">{user.username}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => sendRequest(user._id)}
                      className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Gửi lời mời kết bạn"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Pending */}
        {activeTab === "pending" && (
          <div className="p-6 h-[300px] flex flex-col">
            {isLoadingPending ? (
              <div className="h-full flex items-center justify-center">
                 <p className="text-sm text-muted-foreground animate-pulse">Đang tải...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Clock className="h-10 w-10 mb-2" />
                <p className="text-sm">Không có lời mời nào đang chờ</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {pendingRequests.map(req => {
                   // recipientId chính là user ở trong mảng object nếu populate
                   // Ở API backend, req.requesterId thường là đối tượng User
                   const requester = typeof req.requesterId === 'object' ? req.requesterId : null;
                   
                   if (!requester || !('_id' in requester)) return null;

                   return (
                    <div key={req._id} className="flex flex-col p-3 rounded-xl border border-border/50 bg-card gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                             {/* @ts-ignore */}
                            {(requester.username || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                           {/* @ts-ignore */}
                          <span className="font-semibold text-sm">{requester.username}</span>
                          <span className="text-xs text-muted-foreground">Muốn kết bạn với bạn</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => respondRequest(req._id, "accepted")}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-500 hover:text-white transition-colors"
                        >
                          <Check className="h-4 w-4" /> Chấp nhận
                        </button>
                        <button 
                          onClick={() => respondRequest(req._id, "rejected")}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X className="h-4 w-4" /> Từ chối
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModel;
