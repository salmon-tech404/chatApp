import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Users, Check } from "lucide-react";
import friendService from "@/services/friendService";
import chatService from "@/services/chatService";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import type { Friend } from "@/types/user";

const NewGroupChatModel = () => {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    if (open) {
      fetchFriends();
      // Reset form
      setGroupName("");
      setSelectedFriends([]);
    }
  }, [open]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const data = await friendService.getFriends();
      setFriends(data);
    } catch (error) {
      toast.error("Không thể tải danh sách bạn bè");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Vui lòng nhập tên nhóm!");
      return;
    }
    
    // Yêu cầu chọn ít nhất 2 bạn bè để tạo nhóm 
    if (selectedFriends.length < 2) {
      toast.error("Chọn ít nhất 2 người bạn để tạo nhóm nhé!");
      return;
    }

    setIsSubmitting(true);
    try {
      await chatService.createConversation(
        "group-dummy-id", // Backend conversationController handle logic có xíu không chuẩn nếu null, thay vì null cứ gởi string ảo vì `type=group` là quan trọng
        "group",
        groupName.trim(),
        selectedFriends
      );
      toast.success("Tạo nhóm thành công!");
      fetchConversations(); // Tải lại danh sách Chat Sidebar
      setOpen(false); // Đóng model
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo nhóm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         {/* Button bọc ngoài trigger */}
         <div className="w-full h-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-center rounded-xl">
            <Users className="h-4 w-4" />
         </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-background rounded-2xl overflow-hidden border-border/50">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Tạo Nhóm Mới
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Tên Nhóm Khác Bọt</label>
            <input 
              type="text" 
              placeholder="VD: Hội chém gió, Gia đình..." 
              className="w-full bg-muted/50 border rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Mời Bạn Bè <span className="text-muted-foreground font-normal">({selectedFriends.length} đã chọn)</span>
            </label>
            
            <div className="h-[200px] overflow-y-auto space-y-2 pr-2 border rounded-xl p-2 bg-muted/20">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                  Đang tải...
                </div>
              ) : friends.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <p className="text-sm">Bạn chưa kết bạn với ai cả 😢</p>
                </div>
              ) : (
                friends.map(friend => {
                  const isSelected = selectedFriends.includes(friend._id);
                  return (
                    <div 
                      key={friend._id} 
                      onClick={() => toggleFriendSelection(friend._id)}
                      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors border ${
                        isSelected 
                          ? "bg-primary/10 border-primary/30" 
                          : "bg-background border-transparent hover:border-border"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                      }`}>
                         {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatarUrl} />
                        <AvatarFallback>{friend.displayName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="font-semibold text-sm truncate">{friend.displayName}</span>
                        <span className="text-[11px] text-muted-foreground truncate">{friend.username}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <button 
             onClick={() => setOpen(false)}
             className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
          >
            Huỷ
          </button>
          <button 
             disabled={isSubmitting || selectedFriends.length < 2 || !groupName.trim()}
             onClick={handleCreateGroup}
             className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang tạo..." : "Xác nhận tạo"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModel;
