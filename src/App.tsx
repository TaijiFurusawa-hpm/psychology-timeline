import { useState } from "react";

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
  lifespan:        { label: "発達/ライフスパン系",   color: "#facc15", row: 12 },
  happenstance:    { label: "偶発性理論",            color: "#6ee7b7", row: 13 },
  career:          { label: "キャリア構成系",        color: "#a5f3fc", row: 14 },
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
  { id:"freud",      name:"フロイト",        en:"Freud",           year:1895, died:1939, school:"psychoanalysis",  influences:[],                    desc:"精神分析の創始者。無意識・自我・イド・超自我。行動療法・人間性心理学・TAはいずれも精神分析への反発から生まれた。エリス・バーンの思想的出発点。" },
  { id:"erikson",    name:"エリクソン",      en:"Erikson",         year:1950, died:1994, school:"psychoanalysis",  influences:["freud"],             desc:"心理社会的発達理論。フロイトの弟子だが社会・文化的側面を重視。バーンの直接の師。8段階発達モデル。アイデンティティ概念でキャリア理論にも影響。" },
  { id:"pavlov",     name:"パブロフ",        en:"Pavlov",          year:1890, died:1936, school:"behaviorism",     influences:[],                    desc:"古典的条件づけ。サルターが直接援用したパブロフ主義の源泉。「条件反射」が行動療法全体の出発点。" },
  { id:"salter",     name:"サルター",        en:"Salter",          year:1949, died:1996, school:"behaviorism",     influences:["pavlov"],            desc:"条件反射療法（1949）。行動療法の創始者。「感情を出す＝excitation」が最初のI-statement的発想。アサーティブネスの祖先。エリスも自分の先行者と認めた。" },
  { id:"wolpe",      name:"ウォルピ",        en:"Wolpe",           year:1958, died:1997, school:"behaviorism",     influences:["salter"],            desc:"系統的脱感作（1958）。サルターの弟子。「アサーティブネスは不安の逆制止」として臨床確立。行動療法の国際的普及に貢献。" },
  { id:"alberti",    name:"アルベルティ他",  en:"Alberti/Emmons",  year:1970,            school:"assertive",       influences:["wolpe"],             desc:"「Your Perfect Right」（1970）。アサーティブネスを一般向けに初体系化。人権・平等の観点から再定義。現代アサーティブの直接の源。" },
  { id:"ellis",      name:"エリス",          en:"Ellis",           year:1955, died:2007, school:"cognitive",       influences:["salter","freud"],    desc:"REBT（1955）。行動主義と人間性心理学の間の第三の道。ABCモデル「信念を論駁せよ」。Rogersと公開討論。CBT第二波の先駆け。" },
  { id:"meichenbaum",name:"マイケンバウム",  en:"Meichenbaum",     year:1977,            school:"cognitive",       influences:["ellis"],             desc:"認知行動的変容・自己教示訓練（1977）。「内なる独り言を変えることで行動が変わる」。エリス・ベックとは独立した認知系の流れ。ストレス免疫訓練でも著名。" },
  { id:"beck",       name:"ベック",          en:"Beck",            year:1963, died:2021, school:"cbt",             influences:["freud","ellis"],     desc:"認知療法/CBT（1963〜）。精神分析出身だが「自動思考・認知の歪み」に着目。1960年代にエリスと接触。うつ・不安への最大エビデンス基盤を持つ療法を確立。" },
  { id:"lazarus",    name:"ラザラス",        en:"Lazarus",         year:1976, died:2013, school:"cbt",             influences:["wolpe","ellis"],     desc:"マルチモーダル療法（1976）。ウォルピの弟子だが後に離れ独自路線へ。認知・行動・感情・感覚・イメージ・対人・薬物の7次元（BASIC-ID）で統合的にアセスメント。" },
  { id:"linehan",    name:"リネハン",        en:"Linehan",         year:1993,            school:"thirdwave",       influences:["beck"],              desc:"DBT＝弁証法的行動療法（1993）。境界性パーソナリティ障害向けに開発。「受容と変化」の弁証法的統合。感情調節・苦痛耐性・マインドフルネスのスキルを体系化。" },
  { id:"hayes",      name:"ヘイズ",          en:"Hayes",           year:1999,            school:"thirdwave",       influences:["beck","wolpe"],      desc:"ACT＝アクセプタンス&コミットメント療法（1999）。「思考の内容を変える」ではなく「思考への関係性を変える（脱フュージョン）」。価値に基づく行動。社会構成主義とも共鳴。" },
  { id:"kabatzinn",  name:"カバット＝ジン",  en:"Kabat-Zinn",      year:1979,            school:"mindfulness",     influences:[],                    desc:"MBSR＝マインドフルネスストレス低減法（1979）。仏教瞑想を世俗的・臨床的に体系化。MBCTの基盤。「今この瞬間への非評価的注意」。CBT第三波全体に影響。" },
  { id:"segal",      name:"シーガル他",      en:"Segal/Williams/Teasdale", year:1995,   school:"mindfulness",     influences:["beck","kabatzinn"],  desc:"MBCT＝マインドフルネス認知療法（1995〜2002）。ベックの認知療法＋カバット＝ジンのMBSRを融合。うつの再発防止が目的。「思考の内容ではなく、思考との関係を変える」。" },
  { id:"berne",      name:"バーン",          en:"Berne",           year:1957, died:1970, school:"ta",              influences:["freud","erikson"],  desc:"交流分析・TA（1957）。精神分析から出発しエリクソンに師事。「親・大人・子ども」の自我状態モデル。「Games People Play」は世界的ベストセラー。精神分析×人間性×認知の融合。" },
  { id:"rogers",     name:"ロジャーズ",      en:"Rogers",          year:1940, died:1987, school:"humanistic",      influences:[],                    desc:"クライアント中心療法（1940年代〜）。共感・無条件の肯定的関心・一致性の3条件。ゴードンとローゼンバーグの師。人間性心理学の中心。エリスと公開論争。" },
  { id:"gordon",     name:"ゴードン",        en:"Gordon",          year:1962, died:2002, school:"humanistic",      influences:["rogers"],            desc:"PET親業訓練（1962年コース、著書1970）。ロジャーズの直弟子。I-messageとActive Listeningを体系化。NVCの最も近い先行モデル。" },
  { id:"rosenberg",  name:"ローゼンバーグ",  en:"Rosenberg",       year:1963, died:2015, school:"nvc",             influences:["rogers","gordon"],  desc:"NVC＝非暴力コミュニケーション（1960年代〜、著書1999）。ロジャーズの弟子。観察・感情・ニーズ・リクエストの4段階。「感情の背後にあるニーズへ」。普遍的ニーズの前提がガーゲンから批判される。" },
  { id:"gergen",     name:"ガーゲン",        en:"Gergen",          year:1985,            school:"constructionism", influences:[],                    desc:"社会構成主義（1985〜）。「現実は言語と関係によって共同構成される」。ニーズの普遍性を否定。ナラティブ・セラピーの理論的基盤。心理学自体の不要論まで示唆するラジカルな立場。" },
  { id:"white",      name:"ホワイト他",      en:"White/Epston",    year:1990,            school:"narrative",       influences:["gergen"],            desc:"ナラティブ・セラピー（1990）。問題の外在化「問題と人を分離する」。クライアントが自分の物語の著者になる。社会構成主義の実践的展開。フーコーの権力論も援用。" },
  { id:"schlossberg",name:"シュロスバーグ",  en:"Schlossberg",     year:1981,            school:"lifespan",        influences:["erikson"],           desc:"トランジション理論（1981〜）。4S＝Self・Situation・Support・Strategies。発達心理学・ライフスパン系の独立した流れ。キャリア移行の資源棚卸しモデル。" },
  { id:"krumboltz",  name:"クランボルツ",    en:"Krumboltz",       year:1996,            school:"happenstance",    influences:["wolpe"],             desc:"計画的偶発性理論（1996〜）。行動療法・社会的学習理論の系譜だが「偶然への開かれ」を説く。不確実性の肯定という点で社会構成主義とも共鳴。キャリアは設計するものではない。" },
  { id:"savickas",   name:"サビカス",        en:"Savickas",        year:2005,            school:"career",          influences:["gergen","white"],    desc:"キャリア構成理論（2005〜）。「客観的キャリアは存在せず、語ることで構成される」。ライフテーマ・キャリアストーリー・インタビュー。社会構成主義×キャリア論の統合。" },
];

const MIN_Y = 1880, MAX_Y = 2025;
const W = 1080, ROW_H = 52, TOP = 42, NR = 17;

function tx(year: number) { return 80 + ((year - MIN_Y) / (MAX_Y - MIN_Y)) * (W - 100); }
function ty(school: string) { return TOP + SCHOOLS[school].row * ROW_H + ROW_H / 2; }

const decades = Array.from({length: 14}, (_, i) => 1890 + i * 10);

export default function App() {
  const [sel, setSel] = useState<string | null>(null);
  const [hov, setHov] = useState<string | null>(null);
  const svgH = Object.keys(SCHOOLS).length * ROW_H + TOP + 16;
  const actId = sel || hov;
  const act = PEOPLE.find(p => p.id === actId);

  const arrows = PEOPLE.flatMap(p =>
    p.influences.map(sid => {
      const s = PEOPLE.find(x => x.id === sid);
      if (!s) return null;
      return { x1: tx(s.year)+NR, y1: ty(s.school), x2: tx(p.year)-NR, y2: ty(p.school), sid, tid: p.id };
    }).filter(Boolean)
  );

  return (
    <div style={{background:"#07090f",minHeight:"100vh",color:"#e2e8f0",fontFamily:"monospace",padding:"14px 12px",boxSizing:"border-box"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>

        <h1 style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em",color:"#f1f5f9",margin:"0 0 6px",textTransform:"uppercase"}}>
          心理学・コミュニケーション理論　系譜年表
        </h1>
        <p style={{color:"#334155",fontSize:10,margin:"0 0 8px"}}>
          ノードをタップ/ホバーで詳細表示 ／ タップで固定・再タップで解除
        </p>

        {/* Legend */}
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
          {Object.entries(SCHOOLS).map(([k,s]) => (
            <div key={k} style={{display:"flex",alignItems:"center",gap:3,background:"#0d0f1c",border:`1px solid ${s.color}22`,borderRadius:3,padding:"2px 5px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:s.color}}/>
              <span style={{fontSize:8,color:s.color}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* SVG */}
        <div style={{overflowX:"auto",background:"#0a0c18",border:"1px solid #181d30",borderRadius:8}}>
          <svg width={W} height={svgH} style={{display:"block"}}>
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
              {x1:1947,x2:1975,color:"#f97316",label:"第一波"},
              {x1:1953,x2:1988,color:"#c084fc",label:"第二波"},
              {x1:1977,x2:2010,color:"#e879f9",label:"第三波"},
            ].map((w,i) => (
              <g key={i}>
                <rect x={tx(w.x1)} y={TOP-14} width={tx(w.x2)-tx(w.x1)} height={svgH-TOP+6}
                  fill={w.color+"08"} stroke={w.color+"20"} strokeWidth={1} strokeDasharray="3,6"/>
                <text x={(tx(w.x1)+tx(w.x2))/2} y={TOP-3} textAnchor="middle"
                  fill={w.color+"55"} fontSize={8} fontFamily="monospace">{w.label}</text>
              </g>
            ))}

            {/* decade lines */}
            {decades.map(d => (
              <g key={d}>
                <line x1={tx(d)} y1={TOP-14} x2={tx(d)} y2={svgH-4} stroke="#111828" strokeWidth={1} strokeDasharray="2,6"/>
                <text x={tx(d)} y={TOP-3} textAnchor="middle" fill="#1e2840" fontSize={8} fontFamily="monospace">{d}</text>
              </g>
            ))}

            {/* row labels */}
            {Object.entries(SCHOOLS).map(([k,s]) => (
              <text key={k} x={76} y={ty(k)+4} textAnchor="end" fill={s.color+"44"} fontSize={7} fontFamily="monospace">
                {s.label}
              </text>
            ))}

            {/* arrows */}
            {arrows.map((a,i) => {
              if (!a) return null;
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
                  {on && <circle cx={cx} cy={cy} r={NR+8} fill={s.color+"14"}/>}
                  <circle cx={cx} cy={cy} r={NR}
                    fill={on?s.color+"22":"#0a0c18"}
                    stroke={s.color} strokeWidth={on?2.5:1.5}/>
                  <text x={cx} y={cy-3} textAnchor="middle"
                    fill={on?s.color:s.color+"cc"} fontSize={7.5} fontWeight={700} fontFamily="monospace">
                    {p.name.length>6?p.name.slice(0,6):p.name}
                  </text>
                  <text x={cx} y={cy+7} textAnchor="middle"
                    fill={s.color+"66"} fontSize={6.5} fontFamily="monospace">{p.year}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail */}
        <div style={{
          marginTop:10, minHeight:90,
          background:"#0a0c18",
          border:`1px solid ${act?SCHOOLS[act.school].color+"44":"#181d30"}`,
          borderRadius:8, padding:"12px 14px", transition:"border-color 0.2s"
        }}>
          {act ? (
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                <span style={{fontSize:15,fontWeight:700,color:SCHOOLS[act.school].color}}>{act.name}</span>
                <span style={{fontSize:10,color:"#475569"}}>{act.en}</span>
                <span style={{fontSize:9,color:SCHOOLS[act.school].color+"55",marginLeft:"auto"}}>
                  {act.year}年{act.died?"〜"+act.died+"年":"〜"}
                </span>
              </div>
              <div style={{
                display:"inline-block",
                background:SCHOOLS[act.school].color+"16",
                border:`1px solid ${SCHOOLS[act.school].color}30`,
                borderRadius:3, padding:"1px 6px",
                fontSize:8, color:SCHOOLS[act.school].color, marginBottom:7
              }}>{SCHOOLS[act.school].label}</div>
              <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.75,margin:0}}>{act.desc}</p>
              {act.influences.length>0 && (
                <div style={{marginTop:7,fontSize:10,color:"#2d3f5a"}}>
                  影響源：{act.influences.map(id=>{
                    const p=PEOPLE.find(x=>x.id===id);
                    if (!p) return null;
                    return (
                      <span key={id} style={{color:SCHOOLS[p.school].color+"99",marginRight:10,cursor:"pointer"}}
                        onClick={e=>{e.stopPropagation();setSel(id);}}>
                        ▸{p.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <p style={{color:"#1e2840",fontSize:11,margin:0}}>ノードをタップすると詳細が表示されます</p>
          )}
        </div>

        {/* Footer */}
        <div style={{marginTop:8,background:"#0a0c18",border:"1px solid #181d30",borderRadius:8,padding:"8px 14px"}}>
          <p style={{fontSize:8,color:"#253045",margin:0,lineHeight:2.0}}>
            【三大系譜】① 行動療法：パブロフ→サルター→ウォルピ→(アサーティブ/クランボルツ)
            ② 認知系：フロイト→エリス→ベック/マイケンバウム/ラザラス(第二波)→リネハン(DBT)/ヘイズ(ACT)/MBCT(第三波)
            ③ 人間性：ロジャーズ→ゴードン→ローゼンバーグ(NVC)→ガーゲン→ホワイト(ナラティブ)→サビカス
            ＋精神分析：フロイト→エリクソン→バーン(TA)/シュロスバーグ
          </p>
        </div>
      </div>
    </div>
  );
}
