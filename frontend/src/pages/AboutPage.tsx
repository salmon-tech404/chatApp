// src/pages/AboutPage.tsx
//
// Trang "Về chúng tôi" — 3 sections chính:
//   1. Hero         – giới thiệu tổng quan
//   2. Stats        – số liệu thống kê
//   3. Mission      – sứ mệnh (quote + highlights)
//   4. Values       – giá trị cốt lõi (ValueCard grid)
//   5. CTA Banner   – kêu gọi hành động cuối trang

import { useNavigate } from "react-router";
import {
  ArrowRight,
  // MessageCircle,
  Shield,
  Zap,
  Heart,
  Globe,
  // Users,
  // Lock,
  Sparkles,
  Rocket,
} from "lucide-react";

import PageWrapper from "@/components/layout/PageWrapper";
import NavBar from "@/components/layout/NavBar";
import GradientButton from "@/components/common/GradientButton";
import SectionBadge from "@/components/common/SectionBadge";
import SectionHeader from "@/components/common/SectionHeader";
import StatCard from "@/components/common/StatCard";
import ValueCard from "@/components/common/ValueCard";

import styles from "@/styles/about.module.css";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  {
    value: "10K+",
    label: "Người dùng tin dùng",
    description: "Và đang tăng mỗi ngày",
    icon: "👥",
  },
  {
    value: "99.9%",
    label: "Uptime đảm bảo",
    description: "Không gián đoạn, luôn sẵn sàng",
    icon: "⚡",
  },
  {
    value: "< 50ms",
    label: "Độ trễ tin nhắn",
    description: "Thời gian thực thực sự",
    icon: "🚀",
  },
  {
    value: "256-bit",
    label: "Mã hóa end-to-end",
    description: "Bảo mật cấp doanh nghiệp",
    icon: "🔒",
  },
];

const VALUES = [
  {
    icon: <Heart size={22} color='#f472b6' />,
    title: "Con người là trung tâm",
    description:
      "Mọi tính năng chúng tôi xây dựng đều bắt đầu từ câu hỏi: điều này có thực sự giúp ích cho người dùng không?",
    accentColor: "rgba(244, 114, 182, 0.10)",
  },
  {
    icon: <Shield size={22} color='#2dd4bf' />,
    title: "Bảo mật là cốt lõi",
    description:
      "Tin nhắn của bạn là của bạn. Chúng tôi không đọc, không bán, không chia sẻ dữ liệu cá nhân.",
    accentColor: "rgba(45, 212, 191, 0.10)",
  },
  {
    icon: <Zap size={22} color='#fbbf24' />,
    title: "Hiệu suất tối đa",
    description:
      "Mỗi mili-giây đều quan trọng. Chúng tôi liên tục tối ưu để trải nghiệm luôn mượt mà nhất.",
    accentColor: "rgba(251, 191, 36, 0.10)",
  },
  {
    icon: <Globe size={22} color='#818cf8' />,
    title: "Kết nối không giới hạn",
    description:
      "Ngôn ngữ, khoảng cách, múi giờ — không gì có thể ngăn bạn kết nối với những người quan trọng.",
    accentColor: "rgba(129, 140, 248, 0.10)",
  },
  {
    icon: <Sparkles size={22} color='#34d399' />,
    title: "Cải tiến liên tục",
    description:
      "Chúng tôi lắng nghe phản hồi và cập nhật tính năng mới để sản phẩm tốt hơn mỗi ngày.",
    accentColor: "rgba(52, 211, 153, 0.10)",
  },
  {
    icon: <Rocket size={22} color='#fb923c' />,
    title: "Tối giản để hiệu quả hơn",
    description:
      "Giao diện tối giản, dễ dùng ngay từ lần đầu. Không cần hướng dẫn, không cần học phức tạp.",
    accentColor: "rgba(251, 146, 60, 0.10)",
  },
];

const MISSION_TAGS = [
  "Tin nhắn tức thì",
  "Mã hóa đầu cuối",
  "Đa nền tảng",
  "Không quảng cáo",
  "Mã nguồn minh bạch",
  "Hỗ trợ 24/7",
  "Nhóm chat không giới hạn",
  "Chia sẻ file dễ dàng",
];

// ─── Sub-sections ──────────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden='true' />

      <div className={styles.heroBadge}>
        <SectionBadge label='Về ChatApp' pulseDot />
      </div>

      <h1 className={styles.heroTitle}>
        Tái định nghĩa <span className='gradient-text'>chuẩn mực</span> <br />
        kết nối thời đại mới
      </h1>

      <p className={styles.heroSubtitle}>
        <span className='gradient-text'>Halo</span> không chỉ đơn thuần là một
        công cụ liên lạc. Chúng tôi hướng đến việc xây dựng một hệ sinh thái trò
        chuyện tinh gọn, nơi tính bảo mật cao đi cùng với trải nghiệm sử dụng
        mượt mà và dễ chịu.
      </p>

      <div className={styles.heroCta}>
        <GradientButton
          size='lg'
          icon={<ArrowRight size={18} />}
          onClick={() => navigate("/signup")}
        >
          Bắt đầu miễn phí
        </GradientButton>
        <GradientButton
          variant='ghost'
          size='lg'
          onClick={() => navigate("/contact")}
        >
          Liên hệ chúng tôi
        </GradientButton>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsHeader}>
        <SectionHeader
          badge='Con số thực tế'
          title='Những con số'
          highlightedTitle='nói lên tất cả'
          subtitle='Không phải lời hứa suông, đây là những gì chúng tôi đã và đang duy trì mỗi ngày.'
          align='center'
        />
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className={styles.missionSection}>
      <div className={styles.missionHeader}>
        <SectionHeader
          badge='Sứ mệnh'
          title='Tập trung vào sự'
          highlightedTitle='chuyên nghiệp và uy tín'
          align='left'
        />
      </div>

      <div className={styles.missionLayout}>
        {/* Left: statement */}
        <div className={styles.missionStatement}>
          <blockquote className={styles.missionQuote}>
            "Chúng tôi tin rằng mọi cá nhân và tổ chức đều xứng đáng có một môi
            trường giao tiếp chuyên nghiệp, nơi quyền riêng tư được xem là nền
            tảng cốt lõi chứ không phải một tính năng bổ sung"
          </blockquote>
          <p className={styles.missionBody}>
            Halo được tạo ra với mục tiêu xóa bỏ những rào cản trong trao đổi
            thông tin, giúp công việc vận hành liền mạch hơn và bảo vệ tài sản
            trí tuệ của người dùng bằng hệ thống bảo mật nhiều lớp.
          </p>
          <p className={styles.missionBody}>
            Không chỉ dừng lại ở một nền tảng nhắn tin, chúng tôi mong muốn xây
            dựng sự tin cậy và an tâm cho người dùng trong kỷ nguyên số.
          </p>
        </div>

        {/* Right: feature tags */}
        <div className={styles.missionHighlights}>
          {MISSION_TAGS.map((tag) => (
            <div key={tag} className={styles.missionTag}>
              <span className={styles.missionTagDot} aria-hidden='true' />
              {tag}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className={styles.valuesSection}>
      <div className={styles.valuesHeader}>
        <SectionHeader
          badge='Giá trị cốt lõi'
          title='Những điều chúng tôi'
          highlightedTitle='không bao giờ thỏa hiệp'
          subtitle='Không phải thông điệp quảng cáo, mà là các nguyên tắc cốt lõi dẫn dắt mọi quyết định sản phẩm của chúng tôi.'
          align='center'
        />
      </div>

      <div className={styles.valuesGrid}>
        {VALUES.map((v) => (
          <ValueCard
            key={v.title}
            icon={v.icon}
            title={v.title}
            description={v.description}
            accentColor={v.accentColor}
          />
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  const navigate = useNavigate();

  return (
    <div className={styles.ctaBanner}>
      <div className={styles.ctaText}>
        <h3 className={styles.ctaTitle}>Sẵn sàng trải nghiệm sự khác biệt?</h3>
        <p className={styles.ctaSubtitle}>
          Tham gia cùng hơn 10.000 người dùng đang tin tưởng Halo mỗi ngày. Miễn
          phí, không cần thẻ tín dụng.
        </p>
      </div>

      <div className={styles.ctaActions}>
        <GradientButton
          size='md'
          icon={<ArrowRight size={16} />}
          onClick={() => navigate("/signup")}
        >
          Đăng ký ngay
        </GradientButton>
        <GradientButton
          variant='outline'
          size='md'
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </GradientButton>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <PageWrapper>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.container}>
          <HeroSection />
          <div className={styles.divider} aria-hidden='true' />
          <StatsSection />
          <MissionSection />
          <ValuesSection />
          <CtaBanner />
        </div>
      </div>
    </PageWrapper>
  );
}
