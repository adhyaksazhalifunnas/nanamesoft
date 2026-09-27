/**
 * site.ts — identity, links, and SEO defaults (PRD §8.6).
 *
 * Validated by SiteConfigSchema at build time. Anything still marked `TODO:`
 * is reported by `pnpm validate` and must be resolved before launch.
 */
import type { SiteConfig } from "@/lib/schemas";

export const site = {
  brand: "NanameSoft",
  name: "Adhyaksa Zhalifunnas",
  shortName: "Adhyaksa",

  /**
   * AC-01.2: specific enough that a recruiter can place you in one read —
   * the role, the languages, and the kind of system.
   */
  headline:
    "Full-stack & AI engineer — Python, JavaScript and computer vision, from trained model to shipped web app",

  valueProp:
    "I train object-detection models and build the web apps around them: a thesis comparing YOLO and R-CNN on batik, and a fish-freshness detector served from Azure Functions.",

  availability: {
    status: "open",
    detail: "Open to full-stack, AI and ML engineering roles — available now",
    location: "Semarang, Yogyakarta or Jakarta · open to relocation",
  },

  email: "adhyaksazhalifunnas@gmail.com",

  // TODO: add once the PDF exists — { path: "/resume.pdf", updated: "YYYY-MM-DD" }.
  // While null, every résumé link on the site is hidden rather than pointing at a 404.
  resume: null,

  socials: [
    {
      platform: "github",
      url: "https://github.com/adhyaksazhalifunnas",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/adhyaksa-zhalifunnas-4139a1157/",
      label: "LinkedIn",
    },
    {
      platform: "instagram",
      url: "https://www.instagram.com/adhyak_zha",
      label: "Instagram",
    },
  ],

  githubUsername: "adhyaksazhalifunnas",

  /**
   * AC-08.1: 150–350 words, first person, specific, and free of every phrase
   * in the banned list (PRD §12.6). One array entry per paragraph.
   */
  about: [
    "I'm Adhyaksa, a full-stack and AI engineer. I finished a Bachelor of Engineering in Information Technology at Universitas Gadjah Mada in February 2026, and most of what I build sits where a trained model meets the software people actually use.",
    "My thesis compared YOLO and R-CNN for detecting anomalies in hand-drawn batik tulis tekno from Batik Butimo, and analysed where each model's detections held up and where they did not.",
    "Before that I led two team projects from first sketch to working system. FresCis, my senior project, tells you whether a fish is fresh from a photo of its eye; I led a team of three across the Figma design, a Next.js frontend and a Python backend on Azure Functions. For my capstone I led the team behind an IoT vending-machine prototype that reads an electronic ID card over RFID, checks LPG-subsidy eligibility against a database, dispenses a cylinder, and watches for gas leaks.",
    "Outside the classroom, I spent four months as a frontend intern at PT Graphie Global Interaktif building NFT minting and marketplace frontends on Solidity smart contracts. A course in ethical hacking had me attacking lab systems with Nmap, Metasploit and Bettercap before writing the mitigations.",
    "I'm looking for full-stack, AI or machine-learning engineering roles, based between Semarang, Yogyakarta and Jakarta and open to relocating.",
  ],

  seo: {
    // TODO: switch to the custom domain once it is registered, then redeploy.
    siteUrl: "https://nanamesoft.vercel.app",
    defaultTitle: "Adhyaksa Zhalifunnas — Full-stack & AI Engineer",
    defaultDescription:
      "Adhyaksa Zhalifunnas builds computer-vision models and the web apps that ship them. Case studies on YOLO, R-CNN, Next.js and Azure.",
    locale: "en_US",
  },

  analytics: {
    provider: "none",
  },

  /**
   * The recruiter-facing layer in Bahasa Indonesia and Japanese (PRD §12.3).
   * Case-study bodies stay English on purpose — see src/i18n/config.ts.
   * Anything omitted here simply renders in English.
   */
  translations: {
    id: {
      headline:
        "Full-stack & AI engineer — Python, JavaScript, dan computer vision; dari model terlatih sampai aplikasi web yang jalan",
      valueProp:
        "Saya melatih model deteksi objek dan membangun aplikasi web di sekelilingnya: skripsi yang membandingkan YOLO dengan Mask R-CNN pada batik, dan pendeteksi kesegaran ikan yang disajikan lewat Azure Functions.",
      availabilityDetail:
        "Terbuka untuk posisi full-stack, AI, dan machine learning — bisa mulai sekarang",
      availabilityLocation: "Semarang, Yogyakarta, atau Jakarta · terbuka untuk relokasi",
      seoDefaultTitle: "Adhyaksa Zhalifunnas — Full-stack & AI Engineer",
      seoDefaultDescription:
        "Adhyaksa Zhalifunnas membangun model computer vision dan aplikasi web yang menjalankannya. Studi kasus tentang YOLO, R-CNN, Next.js, dan Azure.",
      about: [
        "Saya Adhyaksa, full-stack dan AI engineer. Saya menyelesaikan Sarjana Teknik, program studi Teknologi Informasi di Universitas Gadjah Mada pada Februari 2026, dan sebagian besar yang saya bangun berada di titik pertemuan antara model terlatih dan perangkat lunak yang benar-benar dipakai orang.",
        "Skripsi saya membandingkan YOLO dengan Mask R-CNN untuk mendeteksi anomali pada batik tulis tekno dari Batik Butimo, lalu menganalisis di mana hasil deteksi tiap model bertahan dan di mana tidak.",
        "Sebelum itu saya memimpin dua proyek tim dari sketsa pertama sampai sistemnya berjalan. FresCis, senior project saya, memberi tahu apakah seekor ikan masih segar dari foto matanya; saya memimpin tim bertiga mulai dari desain Figma, frontend Next.js, sampai backend Python di Azure Functions. Untuk capstone, saya memimpin tim yang membuat prototipe IoT vending machine yang membaca e-KTP lewat RFID, memeriksa kelayakan subsidi LPG di basis data, mengeluarkan tabung, dan mengawasi kebocoran gas.",
        "Di luar kampus, saya empat bulan magang sebagai frontend developer di PT Graphie Global Interaktif, membangun frontend NFT minting dan marketplace di atas smart contract Solidity. Mata kuliah ethical hacking membuat saya menyerang sistem di lab dengan Nmap, Metasploit, dan Bettercap sebelum menulis mitigasinya.",
        "Saya sedang mencari posisi full-stack, AI, atau machine learning engineering, berbasis di antara Semarang, Yogyakarta, dan Jakarta, dan terbuka untuk relokasi.",
      ],
    },
    ja: {
      headline:
        "フルスタック／AIエンジニア — Python、JavaScript、コンピュータビジョン。学習済みモデルから、動くWebアプリまで",
      valueProp:
        "物体検出モデルを学習させ、それを使うWebアプリまで作ります。卒業研究ではバティックの欠陥検出でYOLOとMask R-CNNを比較し、Azure Functions上で動く魚の鮮度判定アプリも開発しました。",
      availabilityDetail:
        "フルスタック・AI・機械学習エンジニアの職を探しています（即日可）",
      availabilityLocation: "スマラン／ジョグジャカルタ／ジャカルタ・転居可",
      seoDefaultTitle: "Adhyaksa Zhalifunnas — フルスタック／AIエンジニア",
      seoDefaultDescription:
        "Adhyaksa Zhalifunnas は、コンピュータビジョンのモデルと、それを届けるWebアプリの両方を作ります。YOLO、R-CNN、Next.js、Azure のケーススタディ。",
      about: [
        "Adhyaksa と申します。フルスタック／AIエンジニアです。2026年2月にガジャマダ大学 情報工学科を卒業（工学士）しました。作ってきたものの多くは、学習済みモデルと、実際に人が使うソフトウェアが出会う場所にあります。",
        "卒業研究では、Batik Butimo のバティック・トゥリス・テクノに含まれる欠陥の検出について、YOLO と Mask R-CNN を比較し、それぞれの検出がどこで通用し、どこで通用しないかを分析しました。",
        "それ以前には、2つのチームプロジェクトを最初のスケッチから動くシステムまで主導しました。卒業制作の FresCis は、魚の目の写真から鮮度を判定するWebアプリです。3人チームのリーダーとして、Figma での設計、Next.js のフロントエンド、Azure Functions 上の Python バックエンドまでを担当しました。キャップストーンでは、e-KTP を RFID で読み取り、LPG 補助金の対象かをデータベースで照合し、ボンベを払い出し、ガス漏れを監視する IoT 自動販売機の試作をチームで主導しました。",
        "学外では、PT Graphie Global Interaktif でフロントエンドエンジニアとして4か月間インターンをし、Solidity のスマートコントラクト上に NFT のミントとマーケットプレイスのフロントエンドを構築しました。エシカルハッキングの講義では、Nmap・Metasploit・Bettercap で演習環境を攻撃したうえで、その緩和策を書きました。",
        "現在は、フルスタック・AI・機械学習エンジニアの職を探しています。スマラン、ジョグジャカルタ、ジャカルタを拠点とし、転居も可能です。",
      ],
    },
  },
} as const satisfies SiteConfig;

export default site;
