import { MessageCirclePlus } from "lucide-react";

const CreateNewChat = () => {
  return (
    <button className="w-full flex items-center justify-start gap-3 p-3 rounded-2xl bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer group mb-2 border border-primary/5">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform shrink-0">
        <MessageCirclePlus className="h-5 w-5" />
      </div>
      <span className="font-semibold text-sm text-foreground">Gửi Tin Nhắn Mới</span>
    </button>
  );
};

export default CreateNewChat;
