import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Pencil, Check, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import userService from "@/services/userService";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const GENDER_OPTIONS: { value: "" | "male" | "female" | "other"; label: string }[] = [
  { value: "", label: "Không chọn" },
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const MONTHS = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** Parse "YYYY-MM-DD" or ISO string → { day, month, year } */
const parseBirthday = (val: string | null | undefined) => {
  if (!val) return { day: "", month: "", year: "" };
  const d = new Date(val);
  if (isNaN(d.getTime())) return { day: "", month: "", year: "" };
  return {
    day: String(d.getUTCDate()),
    month: String(d.getUTCMonth() + 1),
    year: String(d.getUTCFullYear()),
  };
};

/** Build "YYYY-MM-DD" from parts, or "" if incomplete */
const buildBirthday = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return "";
  const d = parseInt(day), m = parseInt(month), y = parseInt(year);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

const errMsg = (err: unknown, fallback: string) =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

// ─────────────────────────────────────────────────────────────────────────────

const AccountInfoDialog = ({ open, onOpenChange }: Props) => {
  const { user, updateUser } = useAuthStore();

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female" | "other">("");
  const [bDay, setBDay] = useState("");
  const [bMonth, setBMonth] = useState("");
  const [bYear, setBYear] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Cover
  const [coverUploading, setCoverUploading] = useState(false);
  const [repositioning, setRepositioning] = useState(false);
  const [offsetY, setOffsetY] = useState(50);
  const [savedOffsetY, setSavedOffsetY] = useState(50);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartOffset = useRef(50);

  // Sync store → form on open, then fetch fresh profile from server
  useEffect(() => {
    if (!open || !user) return;
    setDisplayName(user.displayName ?? "");
    setBio(user.bio ?? "");
    setGender((user.gender as typeof gender) ?? "");
    const bd = parseBirthday(user.birthday);
    setBDay(bd.day); setBMonth(bd.month); setBYear(bd.year);
    setPhone(user.phone ?? "");
    const oy = user.coverOffsetY ?? 50;
    setOffsetY(oy); setSavedOffsetY(oy);
    setEditingName(false); setRepositioning(false);

    // Fetch fresh data from server to override stale cache
    userService.getProfile().then((fresh) => {
      updateUser(fresh);
      setDisplayName(fresh.displayName ?? "");
      setBio(fresh.bio ?? "");
      setGender((fresh.gender as typeof gender) ?? "");
      const bd2 = parseBirthday(fresh.birthday);
      setBDay(bd2.day); setBMonth(bd2.month); setBYear(bd2.year);
      setPhone(fresh.phone ?? "");
      const oy2 = fresh.coverOffsetY ?? 50;
      setOffsetY(oy2); setSavedOffsetY(oy2);
    }).catch(() => {});
  }, [open]);

  // ── Avatar upload ──────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Ảnh tối đa 5MB"); return; }
    setAvatarUploading(true);
    try {
      const updated = await userService.uploadAvatar(await toBase64(file));
      updateUser(updated);
      toast.success("Đã cập nhật ảnh đại diện");
    } catch (err) {
      toast.error(errMsg(err, "Lỗi khi tải ảnh lên"));
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  // ── Cover upload ───────────────────────────────────────────────
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Ảnh bìa tối đa 8MB"); return; }
    setCoverUploading(true);
    try {
      const updated = await userService.uploadCover(await toBase64(file), offsetY);
      updateUser(updated);
      const oy = updated.coverOffsetY ?? 50;
      setOffsetY(oy); setSavedOffsetY(oy);
      toast.success("Đã cập nhật ảnh bìa");
    } catch (err) {
      toast.error(errMsg(err, "Lỗi khi tải ảnh bìa lên"));
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  };

  // ── Cover drag-to-reposition ───────────────────────────────────
  const onDragStart = useCallback((clientY: number) => {
    dragStartY.current = clientY;
    dragStartOffset.current = offsetY;
  }, [offsetY]);

  const onDragMove = useCallback((clientY: number) => {
    if (dragStartY.current === null || !coverRef.current) return;
    const delta = dragStartY.current - clientY;
    const pct = (delta / coverRef.current.clientHeight) * 100;
    setOffsetY(Math.min(100, Math.max(0, dragStartOffset.current + pct)));
  }, []);

  const onDragEnd = useCallback(() => { dragStartY.current = null; }, []);

  const handleMouseDown = (e: React.MouseEvent) => { if (repositioning) { e.preventDefault(); onDragStart(e.clientY); } };
  const handleMouseMove = (e: React.MouseEvent) => { if (repositioning && dragStartY.current !== null) onDragMove(e.clientY); };
  const handleMouseUp   = () => { if (repositioning) onDragEnd(); };
  const handleTouchStart = (e: React.TouchEvent) => { if (repositioning) onDragStart(e.touches[0].clientY); };
  const handleTouchMove  = (e: React.TouchEvent) => { if (repositioning && dragStartY.current !== null) { e.preventDefault(); onDragMove(e.touches[0].clientY); } };
  const handleTouchEnd   = () => { if (repositioning) onDragEnd(); };

  const saveOffset = async () => {
    try {
      const updated = await userService.updateCoverOffset(offsetY);
      updateUser(updated); setSavedOffsetY(offsetY);
      toast.success("Đã lưu vị trí ảnh bìa");
    } catch (err) {
      toast.error(errMsg(err, "Lỗi khi lưu vị trí"));
    }
    setRepositioning(false);
  };

  const cancelReposition = () => { setOffsetY(savedOffsetY); setRepositioning(false); };

  // ── Profile update ─────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        displayName: displayName.trim() || undefined,
        bio,
        gender: gender || null,
        birthday: buildBirthday(bDay, bMonth, bYear) || null,
        phone,
      });
      updateUser(updated);
      setEditingName(false);
      toast.success("Đã cập nhật thông tin");
    } catch (err) {
      toast.error(errMsg(err, "Lỗi khi cập nhật thông tin"));
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user?.displayName?.charAt(0).toUpperCase() ?? "U";

  // ─────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
          className="p-0 gap-0 max-w-[520px] overflow-hidden rounded-2xl"
          style={{ left: "calc(50% + 172px)" }}
        >
        <DialogHeader className="sr-only">
          <DialogTitle>Thông tin tài khoản</DialogTitle>
        </DialogHeader>

        {/* ── Cover ─────────────────────────────────────────── */}
        <div
          ref={coverRef}
          className={`relative h-44 bg-gradient-to-br from-[#2dd4bf]/30 to-[#0ea5e9]/30 overflow-hidden select-none ${repositioning ? "cursor-grab active:cursor-grabbing" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {user?.coverPhotoUrl ? (
            <img
              src={user.coverPhotoUrl}
              alt="Ảnh bìa"
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `center ${offsetY}%` }}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <Camera className="h-10 w-10" />
            </div>
          )}

          {!repositioning ? (
            <div className="absolute inset-0 flex items-end justify-end p-2.5 gap-2">
              {user?.coverPhotoUrl && (
                <button
                  onClick={() => setRepositioning(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 text-white text-xs font-semibold hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                  <Pencil className="h-3 w-3" /> Điều chỉnh vị trí
                </button>
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 text-white text-xs font-semibold hover:bg-black/70 disabled:opacity-50 transition-colors backdrop-blur-sm"
              >
                <Camera className="h-3 w-3" />
                {coverUploading ? "Đang tải..." : user?.coverPhotoUrl ? "Thay đổi" : "Thêm ảnh bìa"}
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
              <p className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Kéo lên / xuống để điều chỉnh
              </p>
              <div className="flex gap-2">
                <button onClick={saveOffset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2dd4bf] text-white text-xs font-semibold hover:bg-[#2dd4bf]/90">
                  <Check className="h-3 w-3" /> Lưu
                </button>
                <button onClick={cancelReposition} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-semibold hover:bg-white/30">
                  <X className="h-3 w-3" /> Hủy
                </button>
              </div>
            </div>
          )}
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>

        {/* ── Avatar row ──────────────────────────────────────── */}
        <div className="px-5 -mt-10">
          <div className="relative inline-block">
            <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] text-white text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0.5 right-0.5 h-7 w-7 rounded-full bg-[#1a2740] border-2 border-background flex items-center justify-center hover:bg-[#243557] transition-colors disabled:opacity-50"
            >
              {avatarUploading
                ? <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera className="h-3.5 w-3.5 text-white" />}
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className="overflow-y-auto max-h-[55vh] px-5 pt-3 pb-5 space-y-4">

          {/* Display name */}
          <div className="flex items-center gap-2">
            {editingName ? (
              <input
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={() => { if (!displayName.trim()) setDisplayName(user?.displayName ?? ""); setEditingName(false); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingName(false);
                  if (e.key === "Escape") { setDisplayName(user?.displayName ?? ""); setEditingName(false); }
                }}
                className="text-xl font-black bg-transparent border-b-2 border-[#2dd4bf] outline-none text-foreground w-full"
              />
            ) : (
              <>
                <h3 className="text-xl font-black text-foreground">{displayName || user?.displayName}</h3>
                <button onClick={() => setEditingName(true)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </>
            )}
          </div>

          {/* Personal info card */}
          <div className="border border-border/50 rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-muted/30 border-b border-border/50">
              <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Thông tin cá nhân</p>
            </div>

            <div className="divide-y divide-border/40">

              {/* Bio */}
              <div className="px-4 py-3">
                <label className="block text-xs text-muted-foreground mb-1.5">Bio</label>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder="Giới thiệu bản thân..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-transparent text-sm resize-none outline-none text-foreground placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Gender — modern styled select */}
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <label className="text-sm text-muted-foreground shrink-0">Giới tính</label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as typeof gender)}
                    className="appearance-none bg-muted/60 border border-border/60 rounded-xl pl-3 pr-8 py-1.5 text-sm font-medium text-foreground outline-none cursor-pointer hover:border-[#2dd4bf]/50 focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/15 transition-all"
                  >
                    {GENDER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} className="bg-background">{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Birthday — 3 modern selects */}
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground mb-2">Ngày sinh</p>
                <div className="flex gap-2">
                  {[
                    { value: bDay,   onChange: (v: string) => setBDay(v),   placeholder: "Ngày",  options: DAYS.map((d) => ({ v: String(d), l: String(d) })),                              flex: "flex-[0.8]" },
                    { value: bMonth, onChange: (v: string) => setBMonth(v), placeholder: "Tháng", options: MONTHS.map((m, i) => ({ v: String(i + 1), l: m })),                            flex: "flex-[1.3]" },
                    { value: bYear,  onChange: (v: string) => setBYear(v),  placeholder: "Năm",   options: YEARS.map((y) => ({ v: String(y), l: String(y) })),                             flex: "flex-1" },
                  ].map((field) => (
                    <div key={field.placeholder} className={`relative ${field.flex}`}>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full appearance-none bg-muted/60 border border-border/60 rounded-xl pl-3 pr-7 py-1.5 text-sm font-medium text-foreground outline-none cursor-pointer hover:border-[#2dd4bf]/50 focus:border-[#2dd4bf] focus:ring-2 focus:ring-[#2dd4bf]/15 transition-all"
                      >
                        <option value="" className="bg-background text-muted-foreground">{field.placeholder}</option>
                        {field.options.map((o) => <option key={o.v} value={o.v} className="bg-background">{o.l}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <label className="text-sm text-muted-foreground shrink-0">Điện thoại</label>
                <input
                  type="tel"
                  placeholder="Chưa cập nhật"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent text-sm text-foreground text-right outline-none placeholder:text-muted-foreground/40 min-w-0 flex-1"
                />
              </div>

            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {isSaving
              ? <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</>
              : <><Pencil className="h-4 w-4" /> Cập nhật</>}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountInfoDialog;
