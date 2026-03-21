// src/pages/ContactPage.tsx
//
// Trang "Liên hệ" — các section chính:
//   1. Hero         – giới thiệu ngắn
//   2. Main         – Form liên hệ + Info panel (2 cột)
//   3. FAQ          – câu hỏi thường gặp
//   4. CTA Banner   – kêu gọi hành động

import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Github,
  Twitter,
  ArrowRight,
  Send,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import PageWrapper from "@/components/layout/PageWrapper";
import NavBar from "@/components/layout/NavBar";
import GradientButton from "@/components/common/GradientButton";
import SectionBadge from "@/components/common/SectionBadge";
import SectionHeader from "@/components/common/SectionHeader";

import styles from "@/styles/contact.module.css";

// ─── Types & Data ──────────────────────────────────────────────────────────────

const TOPICS = [
  "Hỗ trợ kỹ thuật",
  "Báo lỗi",
  "Tính năng mới",
  "Hợp tác kinh doanh",
  "Góp ý sản phẩm",
  "Khác",
];

const CONTACT_METHODS = [
  {
    icon: <Mail size={20} color="#2dd4bf" />,
    label: "Email",
    value: "support@haloapp.vn",
    accent: "rgba(45, 212, 191, 0.12)",
    href: "mailto:support@haloapp.vn",
  },
  {
    icon: <Phone size={20} color="#818cf8" />,
    label: "Điện thoại",
    value: "+84 (0) 123 456 789",
    accent: "rgba(129, 140, 248, 0.12)",
    href: "tel:+840123456789",
  },
  {
    icon: <MapPin size={20} color="#fb923c" />,
    label: "Địa chỉ",
    value: "TP. Hồ Chí Minh, Việt Nam",
    accent: "rgba(251, 146, 60, 0.12)",
    href: "#",
  },
  {
    icon: <MessageCircle size={20} color="#34d399" />,
    label: "Live Chat",
    value: "Hỗ trợ trong ứng dụng",
    accent: "rgba(52, 211, 153, 0.12)",
    href: "#",
  },
];

const SOCIAL_LINKS = [
  { icon: <Github size={18} />, label: "GitHub", href: "#" },
  { icon: <Twitter size={18} />, label: "Twitter", href: "#" },
  { icon: <MessageCircle size={18} />, label: "Discord", href: "#" },
];

const HOURS = [
  { day: "Thứ 2 – Thứ 6", time: "08:00 – 22:00" },
  { day: "Thứ 7", time: "09:00 – 18:00" },
  { day: "Chủ nhật", time: "10:00 – 16:00" },
];

const FAQS = [
  {
    q: "Tôi mất bao lâu để nhận được phản hồi?",
    a: "Chúng tôi cố gắng phản hồi trong vòng 2–4 giờ trong giờ làm việc. Với các yêu cầu khẩn cấp, thường trong 30 phút.",
  },
  {
    q: "Làm sao để báo cáo lỗi bảo mật?",
    a: "Vui lòng gửi email trực tiếp đến security@haloapp.vn. Chúng tôi không xử lý vấn đề bảo mật qua form liên hệ thông thường.",
  },
  {
    q: "Tôi có thể yêu cầu tính năng mới không?",
    a: "Hoàn toàn được! Chọn chủ đề \"Tính năng mới\" trong form và mô tả chi tiết. Chúng tôi đọc mọi đề xuất từ người dùng.",
  },
  {
    q: "Halo có gói hỗ trợ doanh nghiệp không?",
    a: "Có, chúng tôi có gói Business & Enterprise với hỗ trợ 24/7 và SLA cam kết. Liên hệ để được tư vấn miễn phí.",
  },
  {
    q: "Dữ liệu của tôi có được bảo mật không?",
    a: "Tuyệt đối. Chúng tôi sử dụng mã hóa end-to-end AES-256 và không lưu trữ nội dung tin nhắn trên máy chủ.",
  },
  {
    q: "Làm sao để hủy tài khoản?",
    a: "Bạn có thể xóa tài khoản trực tiếp trong phần Cài đặt > Tài khoản > Xóa tài khoản. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.",
  },
];

// ─── Form Schema ───────────────────────────────────────────────────────────────

const contactSchema = z.object({
  firstname: z.string().min(1, "Vui lòng nhập họ"),
  lastname: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  phone: z.string().optional(),
  message: z.string().min(10, "Nội dung cần ít nhất 10 ký tự"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Sub-sections ──────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.heroBadge}>
        <SectionBadge label="Liên hệ & Hỗ trợ" pulseDot />
      </div>
      <h1 className={styles.heroTitle}>
        Chúng tôi luôn{" "}
        <span className="gradient-text">lắng nghe bạn</span>
      </h1>
      <p className={styles.heroSubtitle}>
        Dù là góp ý, báo lỗi hay hợp tác — đội ngũ Halo sẵn sàng phản hồi
        bạn nhanh nhất có thể.
      </p>
    </section>
  );
}

function InfoPanel() {
  return (
    <div className={styles.infoPanel}>
      <div className={styles.infoHeader}>
        <h2 className={styles.infoTitle}>
          Nhiều cách để{" "}
          <span className="gradient-text">kết nối với chúng tôi</span>
        </h2>
        <p className={styles.infoSubtitle}>
          Chọn kênh phù hợp nhất với bạn. Mỗi yêu cầu đều được đội ngũ xử lý
          cẩn thận.
        </p>
      </div>

      {/* Contact methods */}
      <div className={styles.contactMethods}>
        {CONTACT_METHODS.map((method) => (
          <a
            key={method.label}
            href={method.href}
            className={styles.contactCard}
          >
            <div
              className={styles.contactCardIcon}
              style={{ background: method.accent }}
            >
              {method.icon}
            </div>
            <div className={styles.contactCardInfo}>
              <span className={styles.contactCardLabel}>{method.label}</span>
              <span className={styles.contactCardValue}>{method.value}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Social */}
      <div className={styles.socialSection}>
        <span className={styles.socialLabel}>Mạng xã hội</span>
        <div className={styles.socialLinks}>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className={styles.socialBtn}
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Hours */}
      <div className={styles.hoursCard}>
        <div className={styles.hoursTitle}>Giờ hỗ trợ</div>
        {HOURS.map((h) => (
          <div key={h.day} className={styles.hoursRow}>
            <span className={styles.hoursDay}>{h.day}</span>
            <span className={styles.hoursTime}>{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactForm() {
  const [selectedTopic, setSelectedTopic] = useState("Hỗ trợ kỹ thuật");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1200));
    setSubmitted(true);
    reset();
    toast.success("Tin nhắn đã được gửi thành công! 🎉");
  };

  if (submitted) {
    return (
      <div className={styles.formPanel}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>
            <CheckCircle size={30} color="#2dd4bf" />
          </div>
          <h3 className={styles.successTitle}>Đã gửi thành công!</h3>
          <p className={styles.successText}>
            Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2–4 giờ
            qua email của bạn.
          </p>
          <GradientButton
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
          >
            Gửi tin nhắn khác
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formPanel}>
      <h3 className={styles.formTitle}>Gửi tin nhắn</h3>
      <p className={styles.formSubtitle}>
        Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại sớm nhất có thể.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        {/* Name row */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Họ *</label>
            <input
              className={styles.formInput}
              placeholder="Nguyễn"
              {...register("firstname")}
            />
            {errors.firstname && (
              <span className={styles.formError}>
                {errors.firstname.message}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên *</label>
            <input
              className={styles.formInput}
              placeholder="Văn A"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className={styles.formError}>
                {errors.lastname.message}
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email *</label>
          <input
            className={styles.formInput}
            type="email"
            placeholder="example@email.com"
            {...register("email")}
          />
          {errors.email && (
            <span className={styles.formError}>{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Số điện thoại (tuỳ chọn)</label>
          <input
            className={styles.formInput}
            type="tel"
            placeholder="+84 xxx xxx xxx"
            {...register("phone")}
          />
        </div>

        {/* Topic */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Chủ đề</label>
          <div className={styles.topicGrid}>
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`${styles.topicBtn} ${
                  selectedTopic === topic ? styles.topicBtnActive : ""
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nội dung *</label>
          <textarea
            className={styles.formTextarea}
            placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
            {...register("message")}
          />
          {errors.message && (
            <span className={styles.formError}>{errors.message.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? (
            "Đang gửi..."
          ) : (
            <>
              Gửi tin nhắn <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function FaqSection() {
  return (
    <section className={styles.faqSection}>
      <div className={styles.faqHeader}>
        <SectionHeader
          badge="Câu hỏi thường gặp"
          title="Tìm câu trả lời"
          highlightedTitle="nhanh hơn"
          subtitle="Nhiều vấn đề phổ biến đã được chúng tôi giải đáp sẵn tại đây."
          align="center"
        />
      </div>
      <div className={styles.faqGrid}>
        {FAQS.map((faq) => (
          <div key={faq.q} className={styles.faqItem}>
            <h4 className={styles.faqQuestion}>{faq.q}</h4>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </div>
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
        <h3 className={styles.ctaTitle}>Chưa có tài khoản Halo?</h3>
        <p className={styles.ctaSubtitle}>
          Đăng ký miễn phí và trải nghiệm nền tảng nhắn tin bảo mật ngay hôm nay.
        </p>
      </div>
      <div className={styles.ctaActions}>
        <GradientButton
          size="md"
          icon={<ArrowRight size={16} />}
          onClick={() => navigate("/signup")}
        >
          Đăng ký ngay
        </GradientButton>
        <GradientButton
          variant="outline"
          size="md"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </GradientButton>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <PageWrapper>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.container}>
          <HeroSection />

          <section className={styles.mainSection}>
            <div className={styles.mainGrid}>
              <InfoPanel />
              <ContactForm />
            </div>
          </section>

          <FaqSection />
          <CtaBanner />
        </div>
      </div>
    </PageWrapper>
  );
}
