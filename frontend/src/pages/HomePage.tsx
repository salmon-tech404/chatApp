import { useNavigate }  from "react-router";
import { ArrowRight, MessageCircle, Shield, Zap, Users } from "lucide-react";

import PageWrapper     from "@/components/layout/PageWrapper";
import AppLogo         from "@/components/common/AppLogo";
import GradientButton  from "@/components/common/GradientButton";

import styles from "@/styles/home.module.css";

// ─── Mock chat messages for the preview card ──────────────────────────────────
const PREVIEW_MESSAGES = [
  { id: 1, text: "Hey, dự án mới tiến độ thế nào rồi? 🚀", mine: false, time: "09:30" },
  { id: 2, text: "Đang hoàn thiện phần auth, sắp xong rồi!", mine: true,  time: "09:31" },
  { id: 3, text: "Tuyệt vời! Design trông rất đẹp 🔥",        mine: false, time: "09:32" },
];

const FEATURES = [
  { icon: Zap,            title: "Thời gian thực",   desc: "Tin nhắn tức thì < 50ms" },
  { icon: Shield,         title: "Bảo mật tuyệt đối", desc: "Mã hóa end-to-end"       },
  { icon: Users,          title: "10K+ người dùng",  desc: "Cộng đồng đang phát triển" },
  { icon: MessageCircle,  title: "99.9% Uptime",     desc: "Luôn sẵn sàng 24/7"       },
];

const NAV_LINKS = ["Tính năng", "Về chúng tôi", "Liên hệ"];

// ─── Sub-components ───────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <AppLogo asLink />

      <div className={styles.navLinks}>
        {NAV_LINKS.map((link) => (
          <button key={link} className={styles.navLink}>
            {link}
          </button>
        ))}
      </div>

      <div className={styles.navActions}>
        <GradientButton variant="ghost" size="sm" onClick={() => navigate("/login")}>
          Đăng nhập
        </GradientButton>
        <GradientButton variant="outline" size="sm" onClick={() => navigate("/signup")}>
          Đăng ký
        </GradientButton>
      </div>
    </nav>
  );
}

function MockupAvatar() {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, color: "#fff",
      fontFamily: "var(--font-display)",
    }}>
      NL
    </div>
  );
}

function ChatMockup() {
  return (
    <div className={styles.mockup}>
      <div className={styles.mockupCard}>
        {/* Header */}
        <div className={styles.mockupHeader}>
          <MockupAvatar />
          <div className={styles.mockupHeaderInfo}>
            <div className={styles.mockupHeaderName}>Nguyễn Linh</div>
            <div className={styles.mockupHeaderStatus}>● Đang hoạt động</div>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.mockupBody}>
          {PREVIEW_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.mockupMsg} ${msg.mine ? styles.mockupMsgMine : ""}`}
            >
              {!msg.mine && <MockupAvatar />}
              <div className={`${styles.mockupBubble} ${msg.mine ? styles.mockupBubbleMine : ""}`}>
                {msg.text}
              </div>
              <span className={styles.mockupTime}>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.mockupFooter}>
          <div className={styles.mockupInput}>Nhập tin nhắn...</div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      {/* Left — copy */}
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          <span className={styles.heroBadgeText}>Nhắn tin thời gian thực</span>
        </div>

        <h1 className={styles.heroTitle}>
          Kết nối mọi{" "}
          <span className="gradient-text">người thân yêu</span>
          <br />
          mọi lúc mọi nơi
        </h1>

        <p className={styles.heroSubtitle}>
          Trò chuyện, chia sẻ khoảnh khắc và duy trì kết nối với bạn bè,
          gia đình dễ dàng hơn bao giờ hết với ChatApp.
        </p>

        <div className={styles.heroCta}>
          <GradientButton
            size="lg"
            icon={<ArrowRight size={18} />}
            onClick={() => navigate("/signup")}
          >
            Bắt đầu miễn phí
          </GradientButton>

          <GradientButton
            variant="ghost"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </GradientButton>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { num: "10K+",   label: "Người dùng"  },
            { num: "99.9%",  label: "Uptime"       },
            { num: "< 50ms", label: "Độ trễ"       },
          ].map(({ num, label }) => (
            <div key={label} className={styles.statItem}>
              <div className={styles.statNumber}>{num}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — mockup */}
      <ChatMockup />
    </section>
  );
}

function FeaturesStrip() {
  return (
    <div className={styles.features}>
      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Icon size={17} color="var(--color-brand-teal)" />
          </div>
          <div>
            <div className={styles.featureTitle}>{title}</div>
            <div className={styles.featureDesc}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <PageWrapper>
      <Navbar />
      <HeroSection />
      <FeaturesStrip />
    </PageWrapper>
  );
}
