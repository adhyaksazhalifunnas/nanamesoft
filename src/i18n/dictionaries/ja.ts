/**
 * 日本語.
 *
 * Written for a Japanese-speaking recruiter or engineer reading the chrome and
 * the summary layer. The case-study bodies stay in English on purpose — see
 * the note in src/i18n/config.ts.
 *
 * `satisfies Dictionary` guarantees this file carries every key the English
 * one does, with the same shapes.
 */
import type { Dictionary } from "./en";

export const ja = {
  common: {
    present: "現在",
  },

  nav: {
    primary: "メインナビゲーション",
    projects: "プロジェクト",
    experience: "経歴",
    about: "プロフィール",
    contact: "お問い合わせ",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    skipToContent: "本文へスキップ",
  },

  language: {
    label: "言語",
    current: "現在の言語",
  },

  theme: {
    system: "システムのテーマに合わせる",
    light: "ライトテーマ",
    dark: "ダークテーマ",
  },

  home: {
    heroCta: "ケーススタディを読む",
    workEyebrow: "主な制作物",
    workTitle: "スクリーンショットではなく、ケーススタディを",
    workLede:
      "それぞれに、課題、制約、選んだ判断と見送った選択肢、そして結果の数値をまとめています。",
    skillsEyebrow: "できること",
    skillsTitle: "使っている技術と、その年数",
    skillsLede:
      "習熟度は割合ではなく、定義を明示した4段階で示しています。割合は誰にも根拠を説明できないからです。",
    allProjects: (count: number) => `ケーススタディ全${count}件`,
    basedIn: (location: string) => `拠点：${location}`,
  },

  projects: {
    eyebrow: "主な制作物",
    title: "プロジェクト",
    lede: "公開したすべてではなく、意図して選んだ4〜6件です。どれも、同僚にホワイトボードの前で説明するつもりで書いています。",
    empty:
      "公開済みのケーススタディはまだありません。各ファイルは content/projects/ にあり、status を published にすると表示されます。",
    metaDescription: (count: number) =>
      `技術ケーススタディ${count}件。課題、制約、採用した判断と見送った選択肢、そして測定した結果をまとめています。`,
  },

  caseStudy: {
    draftNotice:
      "下書き — このケーススタディは未完成で、一覧にも検索エンジンにも表示されません。",
    readingTime: (minutes: number) => `読了${minutes}分`,
    stack: "使用技術：",
    constraints: "制約",
    constraintsLede:
      "変えられなかった条件です。これがなければ、以下の判断はどれも難しく見えません。",
    decisions: "判断",
    decisionsLede: "何を選び、何を見送り、その選択に何を支払ったか。",
    decisionColumn: "論点",
    chosenColumn: "採用",
    rejectedColumn: "見送り",
    tradeoffColumn: "受け入れた代償",
    decisionTableCaption:
      "設計上の判断、採用した選択肢、見送った代替案、そしてそれぞれで受け入れた代償",
    why: (decision: string) => `理由 — ${decision}`,
    outcome: "結果",
    outcomeLede:
      "以下の数値にはすべて測定方法を併記しています。方法のない指標は、根拠のない主張です。",
    metricColumn: "指標",
    beforeColumn: "変更前",
    afterColumn: "変更後",
    methodColumn: "測定方法",
    metricsTableCaption: "測定結果。基準値、結果、そしてそれぞれの測定方法",
    limitations: "限界と、今ならこうする点",
    sourceLinks: "コードを直接見る",
    onThisPage: "目次",
    previous: "前へ",
    next: "次へ",
    moreCaseStudies: "ほかのケーススタディ",
    getInTouch: "お問い合わせ",
    bodyInEnglish:
      "以下のケーススタディ本文は英語です。深く読むエンジニアに向けて書いたもので、誰も検証できない翻訳を載せるより原文のほうが確かだと判断しました。",
  },

  evidence: {
    heading: "リポジトリの記録",
    stale:
      "前回の同期でこのリポジトリを読み取れませんでした。以下は最後に取得できた値です。",
    commits: "コミット数",
    repositoryAge: "リポジトリの経過期間",
    firstCommit: "最初のコミット",
    lastPush: "最終プッシュ",
    contributors: "コントリビューター",
    stars: "スター",
    forks: "フォーク",
    license: "ライセンス",
    latestRelease: "最新リリース",
    openInNewTab: "（新しいタブで開きます）",
    onGitHub: (repo: string) => `GitHub の ${repo}`,
    liveSite: "公開サイト",
    dataAsOf: "リポジトリ情報の取得日：",
    fetchedAtBuild: "ページ読み込み時ではなく、ビルド時に取得しています。",
  },

  skills: {
    since: (from: number, to: number | null) =>
      to ? `${from}〜${to}年` : `${from}年から`,
    evidence: "根拠：",
    levelsHeading: "各段階の意味",
    levels: {
      learning: "学習中",
      working: "実務可能",
      proficient: "熟達",
      deep: "深い理解",
    },
    levelDefinitions: {
      learning: "実際に作ってはいるが、まだ頻繁にドキュメントを参照する段階。",
      working: "機能を自力で実装できる。珍しい問題では助けが必要。",
      proficient:
        "コンポーネントを設計して担当でき、典型的な失敗パターンを理解している。",
      deep: "本番障害の最中でもデバッグでき、内部の仕組みを説明でき、人に教えられる。",
    },
    categories: {
      language: "言語",
      framework: "フレームワーク",
      data: "データ",
      infrastructure: "インフラ",
      tooling: "ツール",
      practice: "実践",
    },
  },

  about: {
    eyebrow: "経歴",
    title: "プロフィール",
    metaDescription: (name: string) =>
      `${name} の経歴、情報工学の学修内容、そして技術的な課題への取り組み方。`,
    educationEyebrow: "情報工学の学修歴",
    programme: "課程",
    dates: "在籍期間",
    location: "所在地",
    gpa: "GPA",
    focus: "専門領域",
    expected: (date: string) => `${date} 修了見込み`,
    coursework: "履修科目と、そこで生まれたもの",
    thesis: "卒業論文",
    honours: "受賞",
    activities: "課外活動",
    repository: "リポジトリ",
  },

  experience: {
    eyebrow: "これまでの歩み",
    title: "経歴",
    lede: "空白期間も含めて、日付はありのままです。各項目には、その仕事が何であったかではなく、それによって何が変わったかを書いています。",
    empty: "まだ項目がありません。content/experience.ts に追加してください。",
    metaDescription: (name: string) =>
      `${name} の職務、プロジェクト、成果 — 担当した範囲、それによって変わったこと、使用した技術。`,
    undisclosed: "非公開の組織",
    readCaseStudy: (slug: string) => `${slug} のケーススタディを読む`,
    types: {
      "full-time": "正社員",
      "part-time": "パートタイム",
      internship: "インターン",
      contract: "契約",
      freelance: "フリーランス",
      "open-source": "オープンソース",
      volunteer: "ボランティア",
      academic: "学術",
    },
    modes: {
      "on-site": "出社",
      hybrid: "ハイブリッド",
      remote: "リモート",
    },
  },

  scope: {
    roles: {
      solo: "個人",
      lead: "チームリーダー",
      contributor: "コントリビューター",
      "team-member": "チームメンバー",
    },
    contexts: {
      personal: "個人開発",
      academic: "学術",
      freelance: "フリーランス",
      employment: "業務",
      "open-source": "オープンソース",
    },
    people: (count: number) => `${count}名`,
  },

  contact: {
    eyebrow: "ご連絡ください",
    title: (shortName: string) => `${shortName} へのメッセージ`,
    metaDescription: (name: string, detail: string) =>
      `${name} へのご連絡は、メールまたはお問い合わせフォームから。${detail}`,
    sendMessage: "メッセージを送る",
    orDirectly: "直接ご連絡いただく場合",
    notObfuscated:
      "メールアドレスは伏せ字にせず、そのまま記載しています。伏せ字は収集業者よりも採用担当者の手間を増やすだけだからです。",
    resume: "履歴書",
    resumeMeta: (date: string) => `PDF・${date} 更新`,
    privacyNote:
      "このフォームは何も保存しません。メッセージは私の受信箱に届くだけで、控えも Cookie も、あなたの行動記録も残りません。",
    form: {
      name: "お名前",
      email: "メールアドレス",
      organisation: "所属",
      optional: "（任意）",
      source: "どこでこのサイトを知りましたか？",
      sourcePreferNot: "回答しない",
      message: "メッセージ",
      characters: "2,000文字中 {count}文字",
      submit: "メッセージを送信",
      submitting: "送信中…",
      fixFields: "下に示した項目をご確認ください。",
      emailInstead: "代わりにメールで送る",
      offline:
        "送信できませんでした。オフラインの可能性があります。入力内容はこのまま残っていますので、{email} 宛にメールでもお送りいただけます。",
      successFallback: "返信がない場合は、{email} 宛に直接メールをお送りください。",
      honeypotLabel: "会社のウェブサイト",
      sources: {
        linkedin: "LinkedIn",
        github: "GitHub",
        referral: "人からの紹介",
        search: "検索エンジン",
        other: "その他",
      },
    },
  },

  footer: {
    pages: "ページ",
    elsewhere: "ほかの場所",
    resumeMeta: (date: string) => `（PDF・${date} 更新）`,
    colophon:
      "Next.js で構築。リポジトリ情報は GitHub API から取得し、ビルド時にキャッシュしています。",
  },

  notFound: {
    code: "404",
    title: "このページは存在しません",
    body: "リンクが古いか、リンク先のケーススタディがまだ下書きの可能性があります。",
    seeProjects: "ケーススタディを見る",
    backHome: "ホームに戻る",
  },

  error: {
    code: "エラー",
    title: "このページで問題が発生しました",
    body: "こちらの不具合です。多くの場合、再読み込みで解決します。",
    tryAgain: "再試行",
  },
} satisfies Dictionary;

export default ja;
