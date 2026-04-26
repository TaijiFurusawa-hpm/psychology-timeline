import { useState, useRef, useCallback } from "react";

const SCHOOLS: Record<string, { label: string; color: string; row: number }> = {
  psychoanalysis:  { label: "精神分析系",          color: "#94a3b8", row: 0 },
  behaviorism:     { label: "行動療法系",           color: "#f97316", row: 1 },
  assertive:       { label: "アサーティブ系",       color: "#fb923c", row: 2 },
  cognitive:       { label: "認知療法(第二波)",      color: "#c084fc", row: 3 },
  cbt:             { label: "CBT古典",              color: "#a78bfa", row: 4 },
  thirdwave:       { label: "CBT第三波",            color: "#e879f9", row: 5 },
  mindfulness:     { label: "マインドフルネス系",    color: "#67e8f9", row: 6 },
  ta:              { label: "交流分析(TA)",          color: "#f472b6", row: 7 },
  humanistic:      { label: "人間性心理学系",        color: "#38bdf8", row: 8 },
  nvc:             { label: "NVC系",               color: "#34d399", row: 9 },
  constructionism: { label: "社会構成主義",          color: "#fbbf24", row: 10 },
  narrative:       { label: "ナラティブ系",          color: "#818cf8", row: 11 },
  vocational:      { label: "職業指導/特性因子系",   color: "#ff6b6b", row: 12 },
  career_dev:      { label: "キャリア発達系",        color: "#ffa94d", row: 13 },
  social_learning: { label: "社会的学習理論系",      color: "#69db7c", row: 14 },
  org_career:      { label: "組織キャリア系",        color: "#4dabf7", row: 15 },
  decision:        { label: "意思決定系",            color: "#da77f2", row: 16 },
  lifespan:        { label: "発達/ライフスパン系",   color: "#facc15", row: 17 },
  happenstance:    { label: "偶発性理論",            color: "#6ee7b7", row: 18 },
  career:          { label: "キャリア構成系",        color: "#a5f3fc", row: 19 },
};

interface Person {
  id: string;
  name: string;
  en: string;
  year: number;
  died?: number;
  school: string;
  influences: string[];
  desc: string;
}

const PEOPLE: Person[] = [
  // ── 精神分析系 ──
  { id:"freud",      name:"フロイト",        en:"Freud",           year:1895, died:1939, school:"psychoanalysis",  influences:[],                    desc:"精神分析の創始者。無意識・自我・イド・超自我。行動療法・人間性心理学・TAはいずれも精神分析への反発から生まれた。エリス・バーン・ユングの思想的出発点。" },
  { id:"jung",       name:"ユング",          en:"Jung",            year:1930, died:1961, school:"psychoanalysis",  influences:["freud"],             desc:"分析心理学の創始者。フロイトの弟子だが1912〜13年に決別しリビドーを普遍的心的エネルギーに拡張。「人生の諸段階」（1930〜31, CW第8巻）で人生を太陽の弧に喩え前半（外的適応）と後半（内面・個性化）に二分。35〜40歳の中年の転換（Lebenswende）を提唱。集合的無意識・元型・個性化。エリクソンのライフサイクル論、スーパーのキャリア発達段階の先駆。" },
  { id:"erikson",    name:"エリクソン",      en:"Erikson",         year:1950, died:1994, school:"psychoanalysis",  influences:["freud","jung"],      desc:"心理社会的発達理論。フロイト・ユング双方から影響を受け、人生全体にわたる8段階発達モデルを構築。壮年期「生殖性vs停滞性」はユングの後半人生論と並行。バーンの直接の師。アイデンティティ概念でキャリア理論にも影響。" },

  // ── 行動療法系 ──
  { id:"pavlov",     name:"パブロフ",        en:"Pavlov",          year:1890, died:1936, school:"behaviorism",     influences:[],                    desc:"古典的条件づけ。サルターが直接援用したパブロフ主義の源泉。「条件反射」が行動療法全体の出発点。" },
  { id:"salter",     name:"サルター",        en:"Salter",          year:1949, died:1996, school:"behaviorism",     influences:["pavlov"],            desc:"条件反射療法（1949）。行動療法の創始者。「感情を出す＝excitation」が最初のI-statement的発想。アサーティブネスの祖先。エリスも自分の先行者と認めた。" },
  { id:"wolpe",      name:"ウォルピ",        en:"Wolpe",           year:1958, died:1997, school:"behaviorism",     influences:["salter"],            desc:"系統的脱感作（1958）。サルターの弟子。「アサーティブネスは不安の逆制止」として臨床確立。行動療法の国際的普及に貢献。" },

  // ── アサーティブ系 ──
  { id:"alberti",    name:"アルベルティ他",  en:"Alberti/Emmons",  year:1970,            school:"assertive",       influences:["wolpe"],             desc:"「Your Perfect Right」（1970）。アサーティブネスを一般向けに初体系化。人権・平等の観点から再定義。現代アサーティブの直接の源。" },

  // ── 認知療法(第二波) ──
  { id:"ellis",      name:"エリス",          en:"Ellis",           year:1955, died:2007, school:"cognitive",       influences:["salter","freud"],    desc:"REBT（1955）。行動主義と人間性心理学の間の第三の道。ABCモデル「信念を論駁せよ」。一次資料で1955年初頭の理論確立を明記。Rogersと公開討論。CBT第二波の先駆け。" },
  { id:"meichenbaum",name:"マイケンバウム",  en:"Meichenbaum",     year:1977,            school:"cognitive",       influences:["ellis"],             desc:"認知行動的変容・自己教示訓練（1977）。「内なる独り言を変えることで行動が変わる」。エリス・ベックとは独立した認知系の流れ。ストレス免疫訓練でも著名。" },

  // ── CBT古典 ──
  { id:"beck",       name:"ベック",          en:"Beck",            year:1963, died:2021, school:"cbt",             influences:["freud","ellis"],     desc:"認知療法/CBT（1963〜）。精神分析出身だが「自動思考・認知の歪み」に着目。1960年代にエリスと接触。うつ・不安への最大エビデンス基盤を持つ療法を確立。" },
  { id:"lazarus",    name:"ラザラス",        en:"Lazarus",         year:1976, died:2013, school:"cbt",             influences:["wolpe","ellis"],     desc:"マルチモーダル療法（1976）。ウォルピの弟子だが後に離れ独自路線へ。認知・行動・感情・感覚・イメージ・対人・薬物の7次元（BASIC-ID）で統合的にアセスメント。" },

  // ── CBT第三波 ──
  { id:"linehan",    name:"リネハン",        en:"Linehan",         year:1993,            school:"thirdwave",       influences:["beck"],              desc:"DBT＝弁証法的行動療法（1993）。境界性パーソナリティ障害向けに開発。「受容と変化」の弁証法的統合。感情調節・苦痛耐性・マインドフルネスのスキルを体系化。" },
  { id:"hayes",      name:"ヘイズ",          en:"Hayes",           year:1999,            school:"thirdwave",       influences:["beck","wolpe"],      desc:"ACT＝アクセプタンス&コミットメント療法（1999）。「思考の内容を変える」ではなく「思考への関係性を変える（脱フュージョン）」。価値に基づく行動。社会構成主義とも共鳴。" },

  // ── マインドフルネス系 ──
  { id:"kabatzinn",  name:"カバット＝ジン",  en:"Kabat-Zinn",      year:1979,            school:"mindfulness",     influences:[],                    desc:"MBSR＝マインドフルネスストレス低減法（1979）。仏教瞑想を世俗的・臨床的に体系化。MBCTの基盤。「今この瞬間への非評価的注意」。CBT第三波全体に影響。" },
  { id:"segal",      name:"シーガル他",      en:"Segal/Williams/Teasdale", year:1995,   school:"mindfulness",     influences:["beck","kabatzinn"],  desc:"MBCT＝マインドフルネス認知療法（1995〜2002）。ベックの認知療法＋カバット＝ジンのMBSRを融合。うつの再発防止が目的。「思考の内容ではなく、思考との関係を変える」。" },

  // ── 交流分析(TA) ──
  { id:"berne",      name:"バーン",          en:"Berne",           year:1957, died:1970, school:"ta",              influences:["freud","erikson"],  desc:"交流分析・TA（1957年論文、1961年著書、1964年「Games People Play」）。精神分析から出発しエリクソンに師事。「親・大人・子ども」の自我状態モデル。精神分析×人間性×認知の融合。" },

  // ── 人間性心理学系 ──
  { id:"maslow",     name:"マズロー",        en:"Maslow",          year:1954, died:1970, school:"humanistic",      influences:["freud"],             desc:"欲求階層説と自己実現理論（1942年発表、1954年著書『動機と人格』）。フロイト・アドラー・ユング・ホーナイ・ゴールドシュタインの部分的真実を統合。行動主義（第一の力）と精神分析（第二の力）を超える「第三の力」＝人間性心理学をロジャーズと共に確立。ローの職業心理学に直接影響。" },
  { id:"rogers",     name:"ロジャーズ",      en:"Rogers",          year:1940, died:1987, school:"humanistic",      influences:[],                    desc:"クライアント中心療法（1940年代〜）。共感・無条件の肯定的関心・一致性の3条件。1957年に人格変化の必要十分条件を記述。マズローと並ぶ人間性心理学（第三の力）の双頭。ゴードンとローゼンバーグの師。" },
  { id:"gordon",     name:"ゴードン",        en:"Gordon",          year:1962, died:2002, school:"humanistic",      influences:["rogers"],            desc:"PET親業訓練（1962年コース、著書1970）。ロジャーズの直弟子。I-messageとActive Listeningを体系化。NVCの最も近い先行モデル。" },
  { id:"ivey",       name:"アイビィ",        en:"Ivey",            year:1968,            school:"humanistic",      influences:["rogers"],            desc:"マイクロカウンセリング（1968年論文, Journal of Counseling Psychology）。ロジャーズの共感・傾聴を「かかわり行動」「基本的傾聴技法」など観察可能・訓練可能なマイクロ技法に分解・体系化。マイクロ技法の階層モデル。後に発達的カウンセリング療法（DCT）や多文化カウンセリングを開拓。世界のカウンセラー養成に決定的影響。UMass Amherst。" },
  { id:"miller",     name:"ミラー他",        en:"Miller/Rollnick", year:1983,            school:"humanistic",      influences:["rogers"],            desc:"動機づけ面接（MI, 1983年論文、1991年著書）。ロジャーズのパーソン・センタード・アプローチの基盤の上に構築。著者自身が謝辞でロジャーズへの直接の恩義を明記。指示的と追従的の間の「ガイディング・スタイル」。4プロセス＝Engaging・Focusing・Evoking・Planning。チェンジ・トーク（変化の言葉）を引き出す技法。依存症治療から教育・医療・コーチングへ広く応用。Miller: UNM / Rollnick: Cardiff大学。" },
  { id:"grove",      name:"グローヴ他",      en:"Grove/Lawley/Tompkins", year:1989, died:2008, school:"humanistic", influences:["rogers","jung"],     desc:"クリーン・ランゲージとシンボリック・モデリング（1980年代開発、1989年出版、Lawley & Tompkins著書2000年）。NZ出身セラピストGroveがトラウマ記憶治療で開発。クライアントのメタファーをそのまま用い、セラピストの解釈を一切入れない「クリーンな」質問技法。ロジャーズの非指示的アプローチの徹底的純化。ユングのシンボル理論、認知言語学（Lakoff & Johnson）、自己組織化システム理論、NLPを統合。5段階治療プロセス。" },
  { id:"gallwey",    name:"ガルウェイ",      en:"Gallwey",         year:1974,            school:"humanistic",      influences:["maslow"],            desc:"インナーゲーム（1974年『The Inner Game of Tennis』、2000年『The Inner Game of Work』）。高等教育を離れテニス指導の中で学習・コーチングの根本原理を発見。「頭の中の対戦相手こそ最強の敵」——パフォーマンスを阻む内的障壁への気づきを促す。学習者自身の自然な学習能力への深い信頼が基盤。AT&T・Apple・IBM等で20年以上ビジネスに適用。命令と統制に代わる方法論。ウィットモアのGROWモデルの直接的源泉。" },
  { id:"whitmore",   name:"ウィットモア",    en:"Whitmore",        year:1992, died:2017, school:"humanistic",      influences:["gallwey","maslow"],  desc:"GROWモデルとパフォーマンス・コーチング（1992年著書『Coaching for Performance』）。ガルウェイに師事しインナーゲームを英国に導入、ビジネスコーチングに体系化。GROW＝Goal・Reality・Options・Will。マズローの欲求階層と人間性心理学を理論基盤として明示。コーチングは「命令と統制の対極にある経営行動」。12か国語に翻訳、ビジネスコーチング方法論の定番書。" },

  // ── NVC系 ──
  { id:"rosenberg",  name:"ローゼンバーグ",  en:"Rosenberg",       year:1963, died:2015, school:"nvc",             influences:["rogers","gordon"],  desc:"NVC＝非暴力コミュニケーション（1960年代〜、著書1999）。ロジャーズの弟子。観察・感情・ニーズ・リクエストの4段階。「感情の背後にあるニーズへ」。普遍的ニーズの前提がガーゲンから批判される。" },

  // ── 社会構成主義 ──
  { id:"gergen",     name:"ガーゲン",        en:"Gergen",          year:1985,            school:"constructionism", influences:[],                    desc:"社会構成主義（American Psychologist, 1985年3月号）。Swarthmore College所属。「現実は言語と関係によって共同構成される」。Wittgenstein・Kuhn・Berger & Luckmannの影響。ニーズの普遍性を否定。ナラティブ・セラピーの理論的基盤。" },

  // ── ナラティブ系 ──
  { id:"white",      name:"ホワイト他",      en:"White/Epston",    year:1990,            school:"narrative",       influences:["gergen"],            desc:"ナラティブ・セラピー（1990, Dulwich Centre）。問題の外在化「問題と人を分離する」。クライアントが自分の物語の著者になる。フーコーの権力論を中核的に援用。社会構成主義の実践的展開。" },

  // ── 職業指導/特性因子系（NEW） ──
  { id:"parsons",    name:"パーソンズ",      en:"Parsons",         year:1908, died:1908, school:"vocational",      influences:[],                    desc:"職業指導の創始者。1908年ボストンに職業局を設立、翌1909年に死後出版『Choosing a Vocation』。自己分析・職業理解・合理的推論の3ステップ。特性因子論の源流。" },
  { id:"roe",        name:"ロー",            en:"Roe",             year:1956, died:1991, school:"vocational",      influences:["maslow"],            desc:"職業心理学（1956）。マズローの欲求階層説を取り入れ、幼児期の養育態度が職業選択を方向づけるとした早期決定論。8職業分野×6レベルの二次元分類を提唱。" },
  { id:"holland",    name:"ホランド",        en:"Holland",         year:1959, died:2008, school:"vocational",      influences:[],                    desc:"RIASEC類型論（1959年初出論文、1973年著書）。6つのパーソナリティ・タイプと環境の一致度でキャリア選択・満足・安定を予測。六角形モデル。VPI・SDSなど世界的に普及した検査群を開発。" },

  // ── キャリア発達系（NEW） ──
  { id:"ginzberg",   name:"ギンズバーグ",    en:"Ginzberg",        year:1951, died:1988, school:"career_dev",      influences:[],                    desc:"発達的職業選択理論（1951）。職業選択を発達過程として初めて体系化。空想期・試行期・現実期の3段階。1972年に生涯プロセスとして改訂。スーパーの先駆的存在。" },
  { id:"super",      name:"スーパー",        en:"Super",           year:1957, died:1994, school:"career_dev",      influences:["parsons","ginzberg","jung"],desc:"キャリア発達理論（1957）。Columbia大学。キャリアを自己概念の実現過程として定義。ユングの人生段階論を踏まえ、成長・探索・確立・維持・解放の5段階を提唱。1984年ライフ・キャリア・レインボー（ライフスパン＋ライフスペース）。サビカスの直接の先駆者。" },

  // ── 社会的学習理論系（NEW） ──
  { id:"bandura",    name:"バンデューラ",    en:"Bandura",         year:1971, died:2021, school:"social_learning", influences:[],                    desc:"社会的学習理論（1971）・自己効力感（1977）。観察学習・モデリング・自己調整の概念を確立。クランボルツのキャリア意思決定理論、レント他のSCCTの直接的基盤。" },
  { id:"lent",       name:"レント他",        en:"Lent/Brown/Hackett", year:1994,         school:"social_learning", influences:["bandura"],           desc:"SCCT＝社会認知的キャリア理論（1994）。バンデューラの自己効力感理論をキャリア領域に応用。自己効力感・結果期待・個人目標の3要素でキャリア興味・選択・遂行を説明。" },
  { id:"dweck",      name:"ドゥエック",      en:"Dweck",           year:1988,            school:"social_learning", influences:["bandura"],           desc:"マインドセット理論（1988年Dweck & Leggett論文、2006年著書『Mindset』）。Stanford大学。知能や能力に対する暗黙の信念（implicit theories）が動機づけ・行動・達成を左右する。固定マインドセット（能力は固定）vs 成長マインドセット（能力は努力で発達）。バンデューラの社会認知理論の系譜。教育・ビジネス・スポーツ領域に広く応用。" },

  // ── 組織キャリア系 ──
  { id:"lewin",      name:"レヴィン",        en:"Lewin",           year:1939, died:1947, school:"org_career",      influences:[],                    desc:"グループ・ダイナミクスとアクション・リサーチの創始者。リーダーシップ3類型（専制・民主・放任, 1939）。変革の3段階モデル（解凍→変化→再凍結）。場の理論。1945年MITにグループ・ダイナミクス研究センターを設立。組織開発（OD）・社会心理学の祖。マクレガー・シャインへ続くMIT組織心理学の知的基盤を築いた。" },
  { id:"mcgregor",   name:"マクレガー",      en:"McGregor",        year:1960, died:1964, school:"org_career",      influences:["lewin","maslow"],    desc:"Theory X / Theory Y（1960年『The Human Side of Enterprise』）。MIT Sloan経営大学院。レヴィンが築いたMITの組織研究基盤の上に、マズローの欲求階層説を経営に直接応用。X理論＝人は怠惰で管理が必要、Y理論＝人は本来自律的で成長を求める。Y理論はコーチング・サーバントリーダーシップの理論的先駆。シャインの直接の先行者。" },
  { id:"greenleaf",  name:"グリーンリーフ",  en:"Greenleaf",       year:1970, died:1990, school:"org_career",      influences:["rogers"],            desc:"サーバント・リーダーシップ（1970年エッセイ『The Servant as Leader』）。AT&Tで38年間勤務後に提唱。「リーダーはまず奉仕者であれ」。傾聴・共感・癒し・気づき・説得・概念化・先見性・執事役・人々の成長への関与・コミュニティ構築の10特性。ロジャーズ的な傾聴・共感・人間の成長への信頼がリーダーシップ論に昇華された形。" },
  { id:"schein",     name:"シャイン",        en:"Schein",          year:1978,            school:"org_career",      influences:["mcgregor"],          desc:"キャリア・アンカー理論（1978）・組織文化論。MIT Sloan経営大学院。マクレガーの同僚・後継者としてMITの組織心理学を発展。個人と組織の相互作用、3つのサイクル（生物学的・職業的・家族的）、8つのキャリア・アンカーを提唱。レヴィン→マクレガー→シャインのMIT系譜の集大成。" },
  { id:"hall",       name:"ホール",          en:"Hall",            year:1976,            school:"org_career",      influences:["schein"],            desc:"プロティアン・キャリア理論（1976）。ギリシャ神話の変幻自在の神プロテウスに由来。シャインに師事。組織ではなく個人がキャリアを主導。成功基準は主観的（心理的）成功。適応力と自己認識が中核コンピテンシー。" },
  { id:"arthur",     name:"アーサー",        en:"Arthur",          year:1996,            school:"org_career",      influences:["hall"],              desc:"バウンダリーレス・キャリア（1996, Rousseauと共編）。単一組織の枠を超えた多様なキャリア形態を記述。knowing-why・knowing-how・knowing-whomの3種コンピテンシー。グローバル化・企業再編を背景に台頭。" },

  // ── 意思決定系（NEW） ──
  { id:"gelatt",     name:"ジェラット",      en:"Gelatt",          year:1962,            school:"decision",        influences:[],                    desc:"連続的意思決定モデル（1962）。予測・価値・基準の3システムによる合理的意思決定。1989年に自ら修正し「積極的不確実性（Positive Uncertainty）」を提唱。不確実性を肯定的に活用するキャリア意思決定フレームワーク。" },

  // ── 発達/ライフスパン系 ──
  { id:"schlossberg",name:"シュロスバーグ",  en:"Schlossberg",     year:1981,            school:"lifespan",        influences:["erikson"],           desc:"トランジション理論（1981年論文、1989年著書『Overwhelmed』）。転機の3タイプと4S資源＝Self・Situation・Support・Strategies。発達心理学・ライフスパン系の独立した流れ。キャリア移行の資源棚卸しモデル。" },
  { id:"hansen",     name:"ハンセン",        en:"Hansen",          year:1997,            school:"lifespan",        influences:["super"],             desc:"統合的人生設計（Integrative Life Planning, 1997）。1980年代の「人生役割設計」を発展。仕事・学習・余暇・愛の4領域を統合する6つの重要人生課題を提示。スーパーのライフロール概念を拡張。" },

  // ── 偶発性理論 ──
  { id:"krumboltz",  name:"クランボルツ",    en:"Krumboltz",       year:1996, died:2019, school:"happenstance",    influences:["bandura"],           desc:"社会的学習理論に基づくキャリア意思決定理論（SLTCDM, 1979）→学習理論（LTCC, 1996）→偶発性学習理論（HLT, 2009）。バンデューラの社会的学習理論を礎に「偶然への開かれ」を説く。用語「Planned Happenstance」はMitchellが命名。" },

  // ── キャリア構成系 ──
  { id:"savickas",   name:"サビカス",        en:"Savickas",        year:2002,            school:"career",          influences:["super","gergen","white"], desc:"キャリア構成理論（CCT, 2002年初出・2013年改訂）。スーパーの理論を発展させ、社会構成主義・ナラティブ心理学と統合。「客観的キャリアは存在せず、語ることで構成される」。ライフテーマ・キャリアストーリー・インタビュー。" },
];

const MIN_Y = 1880, MAX_Y = 2025;
const W = 1200, ROW_H = 36, TOP = 54, NR = 14;

function tx(year: number) { return 80 + ((year - MIN_Y) / (MAX_Y - MIN_Y)) * (W - 100); }
function ty(school: string) { return TOP + SCHOOLS[school].row * ROW_H + ROW_H / 2; }

const decades = Array.from({length: 14}, (_, i) => 1890 + i * 10);

export default function App() {
  const [sel, setSel] = useState<string | null>(null);
  const [hov, setHov] = useState<string | null>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const syncScroll = useCallback((source: "top" | "main") => {
    if (syncing.current) return;
    syncing.current = true;
    const from = source === "top" ? topScrollRef.current : mainScrollRef.current;
    const to = source === "top" ? mainScrollRef.current : topScrollRef.current;
    if (from && to) to.scrollLeft = from.scrollLeft;
    requestAnimationFrame(() => { syncing.current = false; });
  }, []);

  const svgH = Object.keys(SCHOOLS).length * ROW_H + TOP + 16;
  const actId = sel || hov;
  const act = PEOPLE.find(p => p.id === actId);

  const arrows = PEOPLE.flatMap(p =>
    p.influences.map(sid => {
      const s = PEOPLE.find(x => x.id === sid);
      if (!s) return null;
      return { x1: tx(s.year)+NR, y1: ty(s.school), x2: tx(p.year)-NR, y2: ty(p.school), sid, tid: p.id };
    }).filter((x): x is NonNullable<typeof x> => x !== null)
  );

  return (
    <div style={{background:"#07090f",minHeight:"100vh",color:"#e2e8f0",fontFamily:"monospace",padding:"10px 12px",boxSizing:"border-box"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>

        <h1 style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em",color:"#f1f5f9",margin:"0 0 4px",textTransform:"uppercase"}}>
          心理学・コミュニケーション理論　系譜年表
        </h1>
        <p style={{color:"#64748b",fontSize:10,margin:"0 0 6px"}}>
          ノードをタップ/ホバーで詳細表示 ／ タップで固定・再タップで解除
        </p>

        {/* Legend */}
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>
          {Object.entries(SCHOOLS).map(([k,s]) => (
            <div key={k} style={{display:"flex",alignItems:"center",gap:3,background:"#0d0f1c",border:`1px solid ${s.color}44`,borderRadius:3,padding:"1px 4px"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:s.color}}/>
              <span style={{fontSize:7,color:s.color}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Top scrollbar (synced) */}
        <div ref={topScrollRef} onScroll={() => syncScroll("top")}
          style={{overflowX:"auto",overflowY:"hidden",height:12,background:"#0a0c18",borderRadius:"8px 8px 0 0",border:"1px solid #181d30",borderBottom:"none"}}>
          <div style={{width:W,height:1}} />
        </div>

        {/* SVG */}
        <div ref={mainScrollRef} onScroll={() => syncScroll("main")}
          style={{overflowX:"auto",background:"#0a0c18",border:"1px solid #181d30",borderRadius:"0 0 8px 8px"}}>
          <svg width={W} height={svgH} style={{display:"block",fontFamily:"monospace"}}>
            <defs>
              <marker id="a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#1e2d44"/>
              </marker>
              <marker id="ao" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#7c96b8"/>
              </marker>
            </defs>

            {/* CBT wave bands */}
            {[
              {x1:1947,x2:1975,color:"#f97316",label:"第一波 (行動療法)"},
              {x1:1953,x2:1988,color:"#c084fc",label:"第二波 (認知療法)"},
              {x1:1977,x2:2010,color:"#e879f9",label:"第三波 (ACT/DBT/MBCT)"},
            ].map((w,i) => (
              <g key={i}>
                <rect x={tx(w.x1)} y={TOP-14} width={tx(w.x2)-tx(w.x1)} height={svgH-TOP+6}
                  fill={w.color+"10"} stroke={w.color+"40"} strokeWidth={1} strokeDasharray="3,6"/>
                <text x={(tx(w.x1)+tx(w.x2))/2} y={14} textAnchor="middle"
                  fill={w.color+"cc"} fontSize={9} fontWeight={700}>{w.label}</text>
              </g>
            ))}

            {/* decade lines */}
            {decades.map(d => (
              <g key={d}>
                <line x1={tx(d)} y1={TOP-14} x2={tx(d)} y2={svgH-4} stroke="#1a2030" strokeWidth={1} strokeDasharray="2,6"/>
                <text x={tx(d)} y={TOP-4} textAnchor="middle" fill="#5a6a80" fontSize={9} fontWeight={600}>{d}</text>
              </g>
            ))}

            {/* row labels */}
            {Object.entries(SCHOOLS).map(([k,s]) => (
              <text key={k} x={76} y={ty(k)+4} textAnchor="end" fill={s.color+"aa"} fontSize={8} fontWeight={600}>
                {s.label}
              </text>
            ))}

            {/* arrows */}
            {arrows.map((a,i) => {
              const on = actId && (a.sid===actId||a.tid===actId);
              const dim = actId && !on;
              const mx = (a.x1+a.x2)/2;
              return (
                <path key={i}
                  d={`M${a.x1},${a.y1} C${mx},${a.y1} ${mx},${a.y2} ${a.x2},${a.y2}`}
                  fill="none" stroke={on?"#7c96b8":"#182030"}
                  strokeWidth={on?1.8:0.8} strokeDasharray={on?"none":"3,5"}
                  markerEnd={on?"url(#ao)":"url(#a)"} opacity={dim?0.07:1}
                />
              );
            })}

            {/* nodes */}
            {PEOPLE.map(p => {
              const cx = tx(p.year), cy = ty(p.school);
              const s = SCHOOLS[p.school];
              const on = actId===p.id;
              const dim = actId && !on;
              return (
                <g key={p.id} style={{cursor:"pointer"}} opacity={dim?0.15:1}
                  onClick={()=>setSel(sel===p.id?null:p.id)}
                  onMouseEnter={()=>setHov(p.id)}
                  onMouseLeave={()=>setHov(null)}>
                  {on && <circle cx={cx} cy={cy} r={NR+6} fill={s.color+"14"}/>}
                  <circle cx={cx} cy={cy} r={NR}
                    fill={on?s.color+"22":"#0a0c18"}
                    stroke={s.color} strokeWidth={on?2.5:1.5}/>
                  <text x={cx} y={cy-2} textAnchor="middle"
                    fill={on?s.color:s.color+"cc"} fontSize={7} fontWeight={700}>
                    {p.name.length>5?p.name.slice(0,5):p.name}
                  </text>
                  <text x={cx} y={cy+6} textAnchor="middle"
                    fill={s.color+"66"} fontSize={6}>{p.year}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail — sticky at bottom */}
        <div style={{
          position:"sticky", bottom:0, zIndex:10,
          marginTop:8, minHeight:70,
          background:"#0a0c18ee",
          backdropFilter:"blur(8px)",
          border:`1px solid ${act?SCHOOLS[act.school].color+"44":"#181d30"}`,
          borderRadius:8, padding:"10px 14px", transition:"border-color 0.2s"
        }}>
          {act ? (() => {
            const sc = SCHOOLS[act.school];
            return (
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                <span style={{fontSize:15,fontWeight:700,color:sc.color}}>{act.name}</span>
                <span style={{fontSize:10,color:"#475569"}}>{act.en}</span>
                <span style={{fontSize:9,color:sc.color+"88",marginLeft:"auto"}}>
                  {act.year}年{act.died?"〜"+act.died+"年":"〜"}
                </span>
              </div>
              <div style={{
                display:"inline-block",
                background:sc.color+"16",
                border:`1px solid ${sc.color}30`,
                borderRadius:3, padding:"1px 6px",
                fontSize:8, color:sc.color, marginBottom:7
              }}>{sc.label}</div>
              <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.75,margin:0}}>{act.desc}</p>
              {act.influences.length>0 && (
                <div style={{marginTop:7,fontSize:10,color:"#4a6080"}}>
                  影響源：{act.influences.map(id=>{
                    const p=PEOPLE.find(x=>x.id===id);
                    if (!p) return null;
                    return (
                      <span key={id} style={{color:SCHOOLS[p.school].color+"cc",marginRight:10,cursor:"pointer"}}
                        onClick={e=>{e.stopPropagation();setSel(id);}}>
                        ▸{p.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })() : (
            <p style={{color:"#3a4a60",fontSize:11,margin:0}}>ノードをタップすると詳細が表示されます</p>
          )}
        </div>

        {/* Footer */}
        <div style={{marginTop:8,background:"#0a0c18",border:"1px solid #181d30",borderRadius:8,padding:"8px 14px"}}>
          <p style={{fontSize:9,color:"#4a6080",margin:0,lineHeight:2.0}}>
            【臨床系譜】① 行動療法：パブロフ→サルター→ウォルピ→アサーティブ
            ② 認知系：フロイト→エリス→ベック/マイケンバウム/ラザラス(第二波)→リネハン(DBT)/ヘイズ(ACT)/MBCT(第三波)
            ③ 人間性：ロジャーズ→ゴードン→ローゼンバーグ(NVC)→ガーゲン→ホワイト(ナラティブ)→サビカス
            ＋精神分析：フロイト→エリクソン→バーン(TA)/シュロスバーグ
            【キャリア系譜】パーソンズ→ロー/ホランド(特性因子)→スーパー/ギンズバーグ(発達)→バンデューラ→クランボルツ(偶発性)/レント他(SCCT)
            ＋組織系：シャイン(アンカー)/ホール(プロティアン)→アーサー(バウンダリーレス)
          </p>
        </div>
      </div>
    </div>
  );
}
