import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MessageSquare,
  Users,
  Settings,
  Sun,
  Moon,
  User,
  Globe,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import AccountInfoDialog from "@/components/settings/AccountInfoDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

export type NavPanel = "chat" | "friends";

interface NavRailProps {
  activePanel: NavPanel;
  onPanelChange: (panel: NavPanel) => void;
}

const NavRail = ({ activePanel, onPanelChange }: NavRailProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountInfoOpen, setAccountInfoOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { id: "chat" as NavPanel, icon: MessageSquare, label: "Tin nhắn" },
    { id: "friends" as NavPanel, icon: Users, label: "Bạn bè" },
  ];

  const initials = user?.displayName?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
    {/* ── Desktop Nav Rail ─────────────────────────────────── */}
    <div className='hidden md:flex flex-col items-center w-16 h-full bg-[#1a2740] shrink-0 py-3 gap-1 z-20'>
      {/* ── Home logo ────────────────────────────────────── */}
      <button
        onClick={() => navigate("/")}
        title='Trang chủ'
        className='relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] shadow-lg shadow-[#2dd4bf]/30 mb-3 shrink-0 hover:opacity-80 transition-opacity group'
      >
        <Home className='w-5 h-5 text-white' />
        <span className='pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50'>
          Trang chủ
        </span>
      </button>

      {/* ── Nav items ────────────────────────────────────── */}
      <nav className='flex flex-col items-center flex-1 gap-1'>
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activePanel === id;
          return (
            <button
              key={id}
              onClick={() => onPanelChange(id)}
              title={label}
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-150 group ${
                isActive
                  ? "bg-[#2dd4bf]/20 text-[#2dd4bf]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/8"
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className='absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#2dd4bf]' />
              )}
              <Icon className='w-5 h-5' />

              {/* Tooltip */}
              <span className='pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50'>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Settings ─────────────────────────────── */}
      <div ref={settingsRef} className='relative mb-2'>
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          title='Cài đặt'
          className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all group ${
            settingsOpen
              ? "bg-white/15 text-white"
              : "text-white/40 hover:text-white/80 hover:bg-white/8"
          }`}
        >
          <Settings
            className={`h-5 w-5 transition-transform duration-300 ${settingsOpen ? "rotate-45" : ""}`}
          />
          {!settingsOpen && (
            <span className='pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50'>
              Cài đặt
            </span>
          )}
        </button>

        {/* Settings popover */}
        {settingsOpen && (
          <div className='absolute bottom-0 left-[calc(100%+8px)] w-56 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50'>
            <div className='px-4 py-3 border-b border-border/50'>
              <p className='text-xs font-bold tracking-widest uppercase text-muted-foreground'>
                Cài đặt
              </p>
            </div>

            {/* Dark / Light toggle */}
            <button
              onClick={toggleTheme}
              className='flex items-center justify-between w-full px-4 py-3 transition-colors hover:bg-muted/60'
            >
              <div className='flex items-center gap-3'>
                {isDarkMode ? (
                  <Moon className='h-4 w-4 text-[#2dd4bf]' />
                ) : (
                  <Sun className='w-4 h-4 text-amber-400' />
                )}
                <span className='text-sm font-medium'>
                  {isDarkMode ? "Chế độ tối" : "Chế độ sáng"}
                </span>
              </div>
              {/* Toggle pill */}
              <div
                className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isDarkMode ? "bg-[#2dd4bf]" : "bg-muted-foreground/30"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isDarkMode ? "translate-x-4" : "translate-x-0"}`}
                />
              </div>
            </button>

            {/* Thông tin tài khoản */}
            <button
              onClick={() => { setSettingsOpen(false); setAccountInfoOpen(true); }}
              className='flex items-center w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60'
            >
              <User className='w-4 h-4 text-muted-foreground shrink-0' />
              <span className='text-sm font-medium'>Thông tin tài khoản</span>
              <ChevronRight className='h-3.5 w-3.5 text-muted-foreground ml-auto' />
            </button>

            {/* Cài Đặt */}
            <button className='flex items-center w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60'>
              <Settings className='w-4 h-4 text-muted-foreground shrink-0' />
              <span className='text-sm font-medium'>Cài Đặt</span>
              <ChevronRight className='h-3.5 w-3.5 text-muted-foreground ml-auto' />
            </button>

            {/* Ngôn Ngữ */}
            <button className='flex items-center w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60'>
              <Globe className='w-4 h-4 text-muted-foreground shrink-0' />
              <span className='text-sm font-medium'>Ngôn Ngữ</span>
              <ChevronRight className='h-3.5 w-3.5 text-muted-foreground ml-auto' />
            </button>

            <div className='border-t border-border/50' />

            {/* Thoát */}
            <button
              onClick={() => {
                setSettingsOpen(false);
                signOut();
              }}
              className='flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors hover:bg-red-500/10'
            >
              <LogOut className='w-4 h-4 shrink-0' />
              <span className='text-sm font-medium'>Thoát</span>
            </button>
          </div>
        )}
      </div>

      {/* ── User avatar ──────────────────────────── */}
      <button
        title={user?.displayName ?? "Tài khoản"}
        className='relative group shrink-0'
      >
        <Avatar className='h-9 w-9 ring-2 ring-[#2dd4bf]/30 ring-offset-1 ring-offset-[#1a2740]'>
          <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
          <AvatarFallback className='bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] text-white font-bold text-sm'>
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Online dot */}
        <span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#1a2740]' />

        {/* Tooltip */}
        <div className='pointer-events-none absolute left-[calc(100%+10px)] bottom-0 w-44 bg-foreground text-background text-xs rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50'>
          <p className='font-bold truncate'>{user?.displayName}</p>
          <p className='truncate text-background/60'>@{user?.username}</p>
        </div>
      </button>
    </div>

    {/* ── Mobile Bottom Tab Bar ────────────────────────────── */}
    <div className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1a2740] border-t border-white/10 flex items-center justify-around px-4 z-30'>
      {navItems.map(({ id, icon: Icon, label }) => {
        const isActive = activePanel === id;
        return (
          <button
            key={id}
            onClick={() => onPanelChange(id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              isActive ? "text-[#2dd4bf]" : "text-white/40"
            }`}
          >
            <Icon className='w-5 h-5' />
            <span className='text-[10px] font-semibold'>{label}</span>
          </button>
        );
      })}

      {/* Settings */}
      <div ref={settingsRef} className='relative'>
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
            settingsOpen ? "text-white" : "text-white/40"
          }`}
        >
          <Settings className={`w-5 h-5 transition-transform duration-300 ${settingsOpen ? "rotate-45" : ""}`} />
          <span className='text-[10px] font-semibold'>Cài đặt</span>
        </button>

        {settingsOpen && (
          <div className='absolute bottom-[calc(100%+8px)] right-0 w-56 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50'>
            <div className='px-4 py-3 border-b border-border/50'>
              <p className='text-xs font-bold tracking-widest uppercase text-muted-foreground'>Cài đặt</p>
            </div>
            <button onClick={toggleTheme} className='flex items-center justify-between w-full px-4 py-3 transition-colors hover:bg-muted/60'>
              <div className='flex items-center gap-3'>
                {isDarkMode ? <Moon className='h-4 w-4 text-[#2dd4bf]' /> : <Sun className='w-4 h-4 text-amber-400' />}
                <span className='text-sm font-medium'>{isDarkMode ? "Chế độ tối" : "Chế độ sáng"}</span>
              </div>
              <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isDarkMode ? "bg-[#2dd4bf]" : "bg-muted-foreground/30"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isDarkMode ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </button>
            <button onClick={() => { setSettingsOpen(false); setAccountInfoOpen(true); }} className='flex items-center w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60'>
              <User className='w-4 h-4 text-muted-foreground shrink-0' />
              <span className='text-sm font-medium'>Thông tin tài khoản</span>
              <ChevronRight className='h-3.5 w-3.5 text-muted-foreground ml-auto' />
            </button>
            <div className='border-t border-border/50' />
            <button onClick={() => { setSettingsOpen(false); signOut(); }} className='flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors hover:bg-red-500/10'>
              <LogOut className='w-4 h-4 shrink-0' />
              <span className='text-sm font-medium'>Thoát</span>
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <button
        onClick={() => setAccountInfoOpen(true)}
        className='flex flex-col items-center gap-0.5 px-2 py-1'
      >
        <div className='relative'>
          <Avatar className='h-7 w-7 ring-2 ring-[#2dd4bf]/30'>
            <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
            <AvatarFallback className='bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] text-white font-bold text-xs'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className='absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-[#1a2740]' />
        </div>
        <span className='text-[10px] font-semibold text-white/40'>Tôi</span>
      </button>
    </div>

    <AccountInfoDialog open={accountInfoOpen} onOpenChange={setAccountInfoOpen} />
    </>
  );
};

export default NavRail;
