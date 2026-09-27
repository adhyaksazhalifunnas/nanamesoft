/**
 * Bahasa Indonesia.
 *
 * `satisfies Dictionary` is what guarantees this file has every key the
 * English one has, with the same shapes. A missing key does not fall back
 * silently — it fails the type check.
 */
import type { Dictionary } from "./en";

export const id = {
  common: {
    present: "Sekarang",
  },

  nav: {
    primary: "Utama",
    projects: "Proyek",
    experience: "Pengalaman",
    about: "Tentang",
    contact: "Kontak",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    skipToContent: "Lewati ke konten",
  },

  language: {
    label: "Bahasa",
    current: "Bahasa aktif",
  },

  theme: {
    system: "Ikuti tema sistem",
    light: "Tema terang",
    dark: "Tema gelap",
  },

  home: {
    heroCta: "Baca studi kasusnya",
    workEyebrow: "Karya pilihan",
    workTitle: "Studi kasus, bukan tangkapan layar",
    workLede:
      "Masing-masing memuat masalahnya, batasannya, keputusan yang saya ambil dan yang saya tolak, serta bagaimana angkanya setelah itu.",
    skillsEyebrow: "Kemampuan",
    skillsTitle: "Yang saya pakai, dan sejak kapan",
    skillsLede:
      "Tingkat penguasaan memakai skala empat tingkat dengan definisi yang ditulis terbuka, bukan persentase — karena persentase tidak bisa dipertanggungjawabkan siapa pun.",
    allProjects: (count: number) => `Semua ${count} studi kasus`,
    basedIn: (location: string) => `Berdomisili di ${location}`,
  },

  projects: {
    eyebrow: "Karya pilihan",
    title: "Proyek",
    lede: "Empat sampai enam proyek, dipilih dengan sengaja — bukan semua yang pernah saya push. Tiap satu ditulis seperti saya menjelaskannya ke sesama engineer di depan papan tulis.",
    empty:
      "Belum ada studi kasus yang diterbitkan. Semuanya ada di content/projects/ dan muncul di sini begitu status-nya diubah menjadi published.",
    metaDescription: (count: number) =>
      `${count} studi kasus teknis, masing-masing memuat masalahnya, batasannya, keputusan yang diambil dan ditolak, serta hasil yang terukur.`,
  },

  caseStudy: {
    draftNotice:
      "Draf — studi kasus ini belum selesai dan disembunyikan dari semua daftar maupun mesin pencari.",
    readingTime: (minutes: number) => `${minutes} menit baca`,
    stack: "Teknologi:",
    constraints: "Batasan",
    constraintsLede:
      "Hal-hal yang tidak bisa saya ubah. Tanpa ini, tidak ada keputusan di bawah yang terlihat sulit.",
    decisions: "Keputusan",
    decisionsLede:
      "Apa yang saya pilih, apa yang saya tolak, dan apa biaya dari tiap pilihan itu.",
    decisionColumn: "Keputusan",
    chosenColumn: "Dipilih",
    rejectedColumn: "Ditolak",
    tradeoffColumn: "Konsekuensi yang diterima",
    decisionTableCaption:
      "Keputusan desain, opsi yang dipilih, alternatif yang ditolak, dan konsekuensi yang diterima untuk masing-masing",
    why: (decision: string) => `Alasan — ${decision}`,
    outcome: "Hasil",
    outcomeLede:
      "Setiap angka di bawah menyebutkan cara pengukurannya. Metrik tanpa metode adalah klaim tanpa bukti.",
    metricColumn: "Metrik",
    beforeColumn: "Sebelum",
    afterColumn: "Sesudah",
    methodColumn: "Cara pengukuran",
    metricsTableCaption:
      "Hasil terukur, beserta nilai awal, nilai akhir, dan cara masing-masing diukur",
    limitations: "Kelemahan, dan apa yang akan saya lakukan berbeda",
    sourceLinks: "Langsung ke kodenya",
    onThisPage: "Di halaman ini",
    previous: "Sebelumnya",
    next: "Berikutnya",
    moreCaseStudies: "Studi kasus lainnya",
    getInTouch: "Hubungi saya",
    bodyInEnglish:
      "Isi lengkap studi kasus di bawah ini berbahasa Inggris — ditulis untuk engineer yang membaca sampai dalam, dan terjemahan yang tidak bisa diverifikasi siapa pun akan lebih buruk daripada aslinya.",
  },

  evidence: {
    heading: "Bukti dari repositori",
    stale:
      "Repositori ini tidak terbaca pada sinkronisasi terakhir. Angka di bawah adalah nilai terakhir yang diketahui.",
    commits: "Commit",
    repositoryAge: "Usia repositori",
    firstCommit: "Commit pertama",
    lastPush: "Push terakhir",
    contributors: "Kontributor",
    stars: "Bintang",
    forks: "Fork",
    license: "Lisensi",
    latestRelease: "Rilis terakhir",
    openInNewTab: "(terbuka di tab baru)",
    onGitHub: (repo: string) => `${repo} di GitHub`,
    liveSite: "Situs langsung",
    dataAsOf: "Data repositori per",
    fetchedAtBuild: "Diambil saat build, bukan saat halaman dimuat.",
  },

  skills: {
    since: (from: number, to: number | null) =>
      to ? `sejak ${from}–${to}` : `sejak ${from}`,
    evidence: "Bukti:",
    levelsHeading: "Arti tiap tingkat",
    levels: {
      learning: "Belajar",
      working: "Bisa bekerja",
      proficient: "Cakap",
      deep: "Mendalam",
    },
    levelDefinitions: {
      learning: "Sedang dipakai untuk membangun; masih sering membuka dokumentasi.",
      working:
        "Bisa membangun fitur sendiri; butuh bantuan untuk masalah yang tidak biasa.",
      proficient:
        "Bisa merancang dan memegang satu komponen; paham pola kegagalan yang umum.",
      deep: "Bisa men-debug di bawah tekanan, memahami cara kerjanya di dalam, dan mengajarkannya.",
    },
    categories: {
      language: "Bahasa",
      framework: "Framework",
      data: "Data",
      infrastructure: "Infrastruktur",
      tooling: "Perkakas",
      practice: "Praktik",
    },
  },

  about: {
    eyebrow: "Latar belakang",
    title: "Tentang",
    metaDescription: (name: string) =>
      `Latar belakang, pendidikan ilmu komputer dan mata kuliah ${name}, serta cara saya mendekati masalah rekayasa.`,
    educationEyebrow: "Latar belakang ilmu komputer",
    programme: "Program studi",
    dates: "Periode",
    location: "Lokasi",
    gpa: "IPK",
    focus: "Fokus",
    expected: (date: string) => `perkiraan ${date}`,
    coursework: "Mata kuliah, dan apa yang dihasilkannya",
    thesis: "Skripsi",
    honours: "Penghargaan",
    activities: "Kegiatan",
    repository: "Repositori",
  },

  experience: {
    eyebrow: "Perjalanan",
    title: "Pengalaman",
    lede: "Tanggalnya jujur, termasuk jedanya. Tiap entri menyebutkan apa yang berubah karena pekerjaan itu, bukan sekadar apa pekerjaannya.",
    empty: "Belum ada entri. Tambahkan di content/experience.ts.",
    metaDescription: (name: string) =>
      `Peran, proyek, dan hasil kerja ${name} — apa yang saya pegang, apa yang berubah karenanya, dan teknologi yang dipakai.`,
    undisclosed: "Organisasi yang tidak disebutkan",
    readCaseStudy: (slug: string) => `Baca studi kasus ${slug}`,
    types: {
      "full-time": "Penuh waktu",
      "part-time": "Paruh waktu",
      internship: "Magang",
      contract: "Kontrak",
      freelance: "Lepas",
      "open-source": "Sumber terbuka",
      volunteer: "Sukarela",
      academic: "Akademik",
    },
    modes: {
      "on-site": "Di kantor",
      hybrid: "Hibrida",
      remote: "Jarak jauh",
    },
  },

  scope: {
    roles: {
      solo: "Sendiri",
      lead: "Ketua tim",
      contributor: "Kontributor",
      "team-member": "Anggota tim",
    },
    contexts: {
      personal: "Pribadi",
      academic: "Akademik",
      freelance: "Lepas",
      employment: "Pekerjaan",
      "open-source": "Sumber terbuka",
    },
    people: (count: number) => `${count} orang`,
  },

  contact: {
    eyebrow: "Sapa saya",
    title: (shortName: string) => `Kirim pesan ke ${shortName}`,
    metaDescription: (name: string, detail: string) =>
      `Hubungi ${name} lewat email atau formulir kontak. ${detail}`,
    sendMessage: "Kirim pesan",
    orDirectly: "Atau hubungi langsung",
    notObfuscated:
      "Alamatnya ditulis apa adanya, tidak disamarkan. Penyamaran lebih merepotkan recruiter daripada menghalangi pengumpul alamat.",
    resume: "CV",
    resumeMeta: (date: string) => `PDF · diperbarui ${date}`,
    privacyNote:
      "Formulir ini tidak menyimpan apa pun. Pesan Anda dikirim ke kotak masuk saya, tanpa salinan, tanpa cookie, dan tanpa profil analitik tentang Anda.",
    form: {
      name: "Nama",
      email: "Email",
      organisation: "Organisasi",
      optional: "(opsional)",
      source: "Dari mana Anda menemukan saya?",
      sourcePreferNot: "Tidak ingin menyebutkan",
      message: "Pesan",
      characters: "{count} dari 2.000 karakter",
      submit: "Kirim pesan",
      submitting: "Mengirim…",
      fixFields: "Mohon perbaiki bagian yang ditandai di bawah.",
      emailInstead: "Kirim lewat email saja",
      offline:
        "Permintaan tidak terkirim — mungkin Anda sedang luring. Pesan Anda masih ada di sini, dan bisa dikirim lewat email ke {email}.",
      successFallback: "Kalau belum ada balasan, kirim email langsung ke {email}.",
      honeypotLabel: "Situs web perusahaan",
      sources: {
        linkedin: "LinkedIn",
        github: "GitHub",
        referral: "Direkomendasikan seseorang",
        search: "Mesin pencari",
        other: "Lainnya",
      },
    },
  },

  footer: {
    pages: "Halaman",
    elsewhere: "Di tempat lain",
    resumeMeta: (date: string) => `(PDF, diperbarui ${date})`,
    colophon:
      "Dibangun dengan Next.js. Data repositori dari GitHub API, di-cache saat build.",
  },

  notFound: {
    code: "404",
    title: "Halaman ini tidak ada",
    body: "Tautannya mungkin sudah usang, atau studi kasus yang dituju masih berstatus draf.",
    seeProjects: "Lihat studi kasusnya",
    backHome: "Kembali ke beranda",
  },

  error: {
    code: "Kesalahan",
    title: "Ada yang rusak di halaman ini",
    body: "Ini kesalahan saya, bukan Anda. Biasanya memuat ulang sudah cukup.",
    tryAgain: "Coba lagi",
  },
} satisfies Dictionary;

export default id;
