"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "emotion-release-sessions";

const colorOptions = [
  { id: "deep-red", label: "深红", value: "#b4878e", glow: "#e8d4d8" },
  { id: "orange-red", label: "橘红", value: "#d1a28f", glow: "#f0dfd5" },
  { id: "gray-blue", label: "灰蓝", value: "#9aaabd", glow: "#dde6ef" },
  { id: "deep-blue", label: "深蓝", value: "#7f93b0", glow: "#d4ddeb" },
  { id: "black-gray", label: "黑灰", value: "#92919a", glow: "#e2e1e8" },
  { id: "violet", label: "紫色", value: "#b6abc7", glow: "#ece6f3" },
  { id: "muddy-yellow", label: "浑黄", value: "#c2ba92", glow: "#ece8d2" },
  { id: "ink-green", label: "墨绿", value: "#91a79d", glow: "#dde8e2" },
  { id: "mist-white", label: "雾白", value: "#dfe2e5", glow: "#f7f8f9" },
  { id: "rose-red", label: "玫红", value: "#cf7d92", glow: "#f0d3dc" },
  { id: "coral", label: "珊瑚", value: "#e09a86", glow: "#f5d9cf" },
  { id: "apricot", label: "杏橘", value: "#e4b07d", glow: "#f6e1c8" },
  { id: "amber", label: "琥珀", value: "#d4ab54", glow: "#f1e2ba" },
  { id: "sun-yellow", label: "亮黄", value: "#dec95f", glow: "#f5edbf" },
  { id: "lime", label: "青柠", value: "#afca63", glow: "#e8f0c8" },
  { id: "leaf-green", label: "叶绿", value: "#7fb06f", glow: "#d7e8d0" },
  { id: "teal", label: "青绿", value: "#62ab98", glow: "#cde8e0" },
  { id: "lake", label: "湖蓝", value: "#67adc7", glow: "#cfe7f0" },
  { id: "sky", label: "天蓝", value: "#7eb9e4", glow: "#d9ebf8" },
  { id: "cobalt", label: "钴蓝", value: "#5d7fd2", glow: "#cfd8f5" },
  { id: "indigo", label: "靛蓝", value: "#6670bf", glow: "#d4d7f0" },
  { id: "lavender", label: "薰衣草", value: "#a48bd8", glow: "#e5dbf8" },
  { id: "orchid", label: "兰紫", value: "#bf8ad5", glow: "#eddcf5" },
  { id: "plum", label: "梅紫", value: "#996d9f", glow: "#dfd0e2" },
  { id: "brown", label: "棕褐", value: "#a48672", glow: "#e6dbd3" }
];

const shapeOptions = [
  { id: "mist", label: "一团雾", icon: "mist" },
  { id: "stone", label: "一块石头", icon: "stone" },
  { id: "fire", label: "一团火", icon: "fire" },
  { id: "swirl", label: "一个漩涡", icon: "swirl" },
  { id: "waterflow", label: "一股水流", icon: "waterflow" },
  { id: "thorn", label: "一根刺", icon: "thorn" },
  { id: "web", label: "一张网", icon: "web" },
  { id: "yarn", label: "一团线", icon: "yarn" },
  { id: "sphere", label: "一个球", icon: "sphere" },
  { id: "wall", label: "一堵墙", icon: "wall" },
  { id: "bubble", label: "一个气泡", icon: "bubble" },
  { id: "lightning", label: "一道闪电", icon: "lightning" },
  { id: "blackhole", label: "一个黑洞", icon: "blackhole" },
  { id: "volcano", label: "一座火山", icon: "volcano" },
  { id: "feather", label: "一片羽毛", icon: "feather" },
  { id: "unclear", label: "说不清", icon: "unclear" }
];

const bodyAreaOptions = [
  { id: "head", label: "头部", top: "10%", left: "50%" },
  { id: "throat", label: "喉咙", top: "24%", left: "50%" },
  { id: "chest", label: "胸口", top: "35%", left: "50%" },
  { id: "shoulder", label: "肩颈", top: "30%", left: "28%" },
  { id: "back", label: "后背", top: "41%", left: "26%" },
  { id: "stomach", label: "胃部", top: "48%", left: "50%" },
  { id: "abdomen", label: "腹部", top: "61%", left: "50%" },
  { id: "limbs", label: "四肢", top: "74%", left: "28%" },
  { id: "whole", label: "全身", top: "82%", left: "50%" },
  { id: "unclear", label: "说不清", top: "74%", left: "72%" }
];

const bodyFeels = ["紧", "堵", "胀", "酸", "热", "冷", "沉", "麻", "空", "乱"];

const releaseQuestions = [
  {
    id: "allow",
    prompt: "我愿意允许这个感受，此刻先这样存在吗？",
    options: ["愿意", "有一点愿意", "暂时不愿意"]
  },
  {
    id: "stop-fighting",
    prompt: "我能不能先不和它对抗，只是感受它在身体里的样子？",
    options: ["可以", "试试看", "还不行"]
  },
  {
    id: "loosen",
    prompt: "我是否愿意，让它松开一点点？",
    options: ["愿意", "只松开一点点", "现在不想"]
  },
  {
    id: "leave-path",
    prompt: "如果它现在可以释放一点，它想从哪里离开？",
    options: ["呼吸", "胸口", "喉咙", "手心", "脚底", "全身慢慢散开", "不知道"]
  },
  {
    id: "change",
    prompt: "现在再看它，它有没有变化？",
    options: ["变轻了", "变淡了", "变远了", "还在", "更清楚了", "不确定"]
  }
];

const endMessages = {
  "变轻了": "已经可以了。\n不用急着把它完全处理完。\n你刚刚只是给了它一点空间。",
  "变淡了": "它也许还在。\n但现在，已经没有刚刚那样贴得那么近。\n先陪它停在这里就好。",
  "变远了": "它稍微退开了一点。\n你不用追着把它弄清楚。\n这一点距离，已经足够。",
  "还在": "它还在，也没有关系。\n现在不必马上处理完。\n先让身体知道，你已经看见它了。",
  "更清楚了": "变清楚不一定更难受。\n有时候只是它终于被看见。\n你可以先停在这里。",
  default: "已经可以了。\n不用急着把它完全处理完。\n你刚刚只是给了它一点空间。"
};

const initialSession = {
  color: null,
  customColor: "#c5ccd8",
  shape: null,
  bodyArea: null,
  bodyFeel: null,
  answers: {}
};

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(184, 199, 217, ${alpha})`;
  const cleanHex = hex.replace("#", "");
  const fullHex = cleanHex.length === 3
    ? cleanHex.split("").map((part) => `${part}${part}`).join("")
    : cleanHex;
  const value = Number.parseInt(fullHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getShapePath(icon) {
  switch (icon) {
    case "mist":
      return "M28 105C39 73 65 54 95 57C116 59 123 74 146 71C170 67 196 79 205 103C214 127 205 155 183 168C163 179 135 172 113 176C89 180 63 192 41 179C17 166 14 136 28 105Z";
    case "stone":
      return "M50 63C72 37 110 33 145 42C179 51 198 78 197 112C196 146 175 173 141 181C107 189 67 180 43 151C19 121 26 91 50 63Z";
    case "fire":
      return "M119 22C136 48 145 66 133 93C146 85 162 89 171 104C184 126 179 155 160 174C142 191 113 196 88 187C55 174 39 138 50 108C61 79 89 68 98 46C102 36 106 28 119 22Z";
    case "swirl":
      return "M118 47C151 50 181 73 187 105C194 139 173 170 141 178C112 186 78 173 67 145C55 116 70 90 97 84C117 79 137 93 139 112C140 126 130 139 116 141C104 143 93 136 91 124";
    case "waterflow":
      return "M30 93C50 76 68 75 88 89C108 103 126 103 145 89C164 75 183 76 204 94M24 123C46 106 66 106 88 120C110 134 130 134 151 120C172 106 193 106 216 123M39 152C58 140 76 140 95 150C114 160 131 160 149 150C167 140 185 140 204 152";
    case "thorn":
      return "M38 176C55 151 79 127 103 102C126 78 150 52 177 36C164 63 156 78 150 96C163 91 181 91 197 96C174 106 157 121 140 138C117 162 91 186 59 196C51 188 45 183 38 176Z";
    case "web":
      return "M111 26C148 34 177 60 190 96C201 128 196 162 177 190M111 26C73 35 44 62 31 98C18 133 23 168 43 195M111 26L111 198M31 98L190 96M43 195L177 190M60 58C86 70 135 70 163 58M49 143C83 152 136 154 171 145M72 108C95 114 122 114 147 108";
    case "yarn":
      return "M111 33C152 33 186 67 186 109C186 151 152 185 111 185C69 185 35 151 35 109C35 67 69 33 111 33ZM64 95C80 79 100 73 122 76C142 79 157 93 163 112M53 123C69 136 88 143 109 143C132 143 151 132 166 116M81 57C93 69 102 83 106 98M121 121C130 129 139 138 147 150";
    case "sphere":
      return "M111 28C157 28 194 65 194 112C194 158 157 195 111 195C64 195 27 158 27 112C27 65 64 28 111 28Z";
    case "wall":
      return "M41 61C41 49 50 40 62 40H161C173 40 182 49 182 61V160C182 172 173 181 161 181H62C50 181 41 172 41 160V61Z";
    case "bubble":
      return "M112 39C149 39 179 69 179 106C179 144 149 174 112 174C74 174 44 144 44 106C44 69 74 39 112 39ZM165 147C177 149 186 159 186 171C186 184 176 194 163 194C151 194 141 184 141 171C141 159 151 149 163 147ZM82 75C89 68 97 64 107 64";
    case "lightning":
      return "M122 28L73 111H111L94 192L157 96H116L122 28Z";
    case "blackhole":
      return "M110 39C150 39 182 71 182 111C182 151 150 183 110 183C70 183 38 151 38 111C38 71 70 39 110 39ZM110 71C132 71 149 89 149 111C149 133 132 151 110 151C88 151 71 133 71 111C71 89 88 71 110 71ZM110 93C120 93 128 101 128 111C128 121 120 129 110 129C100 129 92 121 92 111C92 101 100 93 110 93Z";
    case "volcano":
      return "M56 176L94 101L116 131L138 87L181 176ZM112 55C102 69 102 81 112 91M136 39C122 57 123 74 136 87M88 71C80 82 80 92 88 101";
    case "feather":
      return "M163 48C145 51 127 61 111 76C81 103 69 140 61 182M163 48C164 81 152 110 127 130C108 145 86 152 61 152M91 122C105 122 118 118 129 111M99 98C114 97 128 92 141 82M75 145C88 145 100 141 111 135";
    default:
      return "M71 60C79 53 89 50 99 51C105 58 106 67 103 75C111 70 121 69 130 73C132 83 127 92 120 98C130 97 139 100 146 107C143 117 135 123 126 124C131 132 133 141 130 150C120 153 111 149 104 142C102 151 96 159 87 164C79 158 76 149 77 140C68 145 58 146 49 143C47 132 52 123 60 117C51 113 44 105 41 95C48 88 58 86 67 89C64 79 65 69 71 60Z";
  }
}

function getShapeMood(icon, phase, isEnding) {
  const safePhase = Math.max(0, phase);
  const baseScale = 1 + safePhase * 0.04;
  const endingScale = isEnding ? 1.12 : 1;
  const defaultMood = {
    shapeScale: baseScale * endingScale,
    glowScale: (1.02 + safePhase * 0.05) * endingScale,
    glowOpacity: isEnding ? 0.18 : Math.max(0.24, 0.34 - safePhase * 0.03),
    strokeOpacity: isEnding ? 0.24 : Math.max(0.28, 0.82 - safePhase * 0.11),
    fillOpacity: isEnding ? 0.11 : Math.max(0.14, 0.28 - safePhase * 0.025),
    blur: isEnding ? 56 : 28 + safePhase * 5,
    dash: safePhase > 2 ? "10 14" : "0",
    rotate: 0
  };

  switch (icon) {
    case "mist":
      return {
        ...defaultMood,
        shapeScale: 1 + safePhase * 0.055 + (isEnding ? 0.12 : 0),
        glowScale: 1.08 + safePhase * 0.08 + (isEnding ? 0.12 : 0),
        glowOpacity: isEnding ? 0.14 : Math.max(0.2, 0.36 - safePhase * 0.04),
        fillOpacity: isEnding ? 0.08 : Math.max(0.11, 0.24 - safePhase * 0.03),
        strokeOpacity: isEnding ? 0.18 : Math.max(0.22, 0.62 - safePhase * 0.08),
        blur: isEnding ? 72 : 34 + safePhase * 8,
        dash: safePhase > 1 ? "6 16" : "0"
      };
    case "fire":
    case "volcano":
    case "lightning":
      return {
        ...defaultMood,
        shapeScale: 1 + safePhase * 0.025 + (isEnding ? 0.06 : 0),
        glowScale: 1 + safePhase * 0.04 + (isEnding ? 0.1 : 0),
        glowOpacity: isEnding ? 0.16 : Math.max(0.22, 0.38 - safePhase * 0.035),
        fillOpacity: isEnding ? 0.07 : Math.max(0.1, 0.26 - safePhase * 0.04),
        strokeOpacity: isEnding ? 0.2 : Math.max(0.24, 0.86 - safePhase * 0.13),
        blur: isEnding ? 64 : 26 + safePhase * 6,
        dash: safePhase > 2 ? "14 10" : "0",
        rotate: safePhase * 1.2
      };
    case "web":
    case "yarn":
      return {
        ...defaultMood,
        shapeScale: 1 + safePhase * 0.02 + (isEnding ? 0.04 : 0),
        glowScale: 0.98 + safePhase * 0.03 + (isEnding ? 0.05 : 0),
        glowOpacity: isEnding ? 0.12 : Math.max(0.18, 0.28 - safePhase * 0.025),
        fillOpacity: isEnding ? 0.05 : Math.max(0.08, 0.18 - safePhase * 0.02),
        strokeOpacity: isEnding ? 0.16 : Math.max(0.2, 0.7 - safePhase * 0.1),
        blur: isEnding ? 46 : 24 + safePhase * 4,
        dash: safePhase > 0 ? "4 12" : "0"
      };
    case "blackhole":
    case "swirl":
      return {
        ...defaultMood,
        shapeScale: 1 - Math.min(0.12, safePhase * 0.02) + (isEnding ? 0.08 : 0),
        glowScale: 0.96 + safePhase * 0.02 + (isEnding ? 0.08 : 0),
        glowOpacity: isEnding ? 0.1 : Math.max(0.16, 0.26 - safePhase * 0.03),
        fillOpacity: isEnding ? 0.06 : Math.max(0.09, 0.2 - safePhase * 0.02),
        strokeOpacity: isEnding ? 0.14 : Math.max(0.2, 0.74 - safePhase * 0.1),
        blur: isEnding ? 52 : 25 + safePhase * 5,
        dash: safePhase > 2 ? "9 18" : "0",
        rotate: safePhase * -2.4
      };
    case "bubble":
    case "feather":
    case "waterflow":
      return {
        ...defaultMood,
        shapeScale: 1 + safePhase * 0.05 + (isEnding ? 0.1 : 0),
        glowScale: 1.05 + safePhase * 0.07 + (isEnding ? 0.12 : 0),
        glowOpacity: isEnding ? 0.13 : Math.max(0.18, 0.3 - safePhase * 0.03),
        fillOpacity: isEnding ? 0.06 : Math.max(0.09, 0.18 - safePhase * 0.025),
        strokeOpacity: isEnding ? 0.16 : Math.max(0.2, 0.66 - safePhase * 0.09),
        blur: isEnding ? 68 : 30 + safePhase * 7,
        dash: safePhase > 1 ? "8 14" : "0",
        rotate: icon === "feather" ? safePhase * 1.1 : 0
      };
    case "wall":
    case "stone":
      return {
        ...defaultMood,
        shapeScale: 1 + safePhase * 0.01 + (isEnding ? 0.03 : 0),
        glowScale: 0.98 + safePhase * 0.025 + (isEnding ? 0.05 : 0),
        glowOpacity: isEnding ? 0.12 : Math.max(0.18, 0.28 - safePhase * 0.025),
        fillOpacity: isEnding ? 0.07 : Math.max(0.11, 0.24 - safePhase * 0.02),
        strokeOpacity: isEnding ? 0.18 : Math.max(0.24, 0.78 - safePhase * 0.1),
        blur: isEnding ? 48 : 24 + safePhase * 4
      };
    default:
      return defaultMood;
  }
}

function getShapeEcho(icon, mood) {
  switch (icon) {
    case "mist":
      return {
        scale: mood.shapeScale * 1.12,
        rotate: mood.rotate - 4,
        strokeOpacity: mood.strokeOpacity * 0.34,
        fillOpacity: mood.fillOpacity * 0.42,
        dash: "8 18",
        translateX: -4,
        translateY: 3
      };
    case "web":
    case "yarn":
      return {
        scale: mood.shapeScale * 1.05,
        rotate: mood.rotate + 3,
        strokeOpacity: mood.strokeOpacity * 0.28,
        fillOpacity: 0,
        dash: "3 12",
        translateX: 2,
        translateY: 2
      };
    case "blackhole":
    case "swirl":
      return {
        scale: mood.shapeScale * 0.92,
        rotate: mood.rotate - 8,
        strokeOpacity: mood.strokeOpacity * 0.26,
        fillOpacity: mood.fillOpacity * 0.18,
        dash: "10 20",
        translateX: 0,
        translateY: 0
      };
    case "feather":
    case "waterflow":
      return {
        scale: mood.shapeScale * 1.08,
        rotate: mood.rotate + 5,
        strokeOpacity: mood.strokeOpacity * 0.24,
        fillOpacity: 0,
        dash: "12 16",
        translateX: 5,
        translateY: -3
      };
    case "fire":
    case "lightning":
    case "volcano":
      return {
        scale: mood.shapeScale * 0.98,
        rotate: mood.rotate + 4,
        strokeOpacity: mood.strokeOpacity * 0.22,
        fillOpacity: mood.fillOpacity * 0.16,
        dash: "16 10",
        translateX: 3,
        translateY: -2
      };
    default:
      return null;
  }
}

function StepFrame({
  title,
  description,
  note,
  children,
  onSkip,
  onBack,
  center = false
}) {
  return (
    <section className={`panel step-panel fade-panel ${center ? "panel-center" : ""}`}>
      <div className="step-copy">
        {note ? <p className="step-note">{note}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="step-content">{children}</div>
      <div className="panel-footer">
        {onBack ? (
          <button className="nav-button" onClick={onBack} type="button">
            返回
          </button>
        ) : <span />}
        {onSkip ? (
          <button className="nav-button" onClick={onSkip} type="button">
            跳过
          </button>
        ) : <span />}
      </div>
    </section>
  );
}

function EmotionAura({ color, shape, phase, isEnding }) {
  const path = getShapePath(shape?.icon);
  const mood = getShapeMood(shape?.icon, phase, isEnding);
  const echo = getShapeEcho(shape?.icon, mood);
  const strokeWidth = shape?.icon === "web" ? 3 : 2.2;

  return (
    <div className={`aura-wrap ${isEnding ? "ending-aura" : ""}`} aria-hidden="true">
      <div
        className="aura-glow"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(color, mood.glowOpacity)} 0%, ${hexToRgba(color, 0.12)} 42%, transparent 72%)`,
          filter: `blur(${mood.blur}px)`,
          transform: `scale(${mood.glowScale})`
        }}
      />
      <svg className="aura-shape" viewBox="0 0 240 220">
        {echo ? (
          <path
            d={path}
            fill={hexToRgba(color, echo.fillOpacity)}
            stroke={hexToRgba(color, echo.strokeOpacity)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={echo.dash}
            style={{
              transform: `translate(${echo.translateX}px, ${echo.translateY}px) scale(${echo.scale}) rotate(${echo.rotate}deg)`,
              transformOrigin: "center",
              transition: "all 720ms ease"
            }}
          />
        ) : null}
        <path
          d={path}
          fill={hexToRgba(color, mood.fillOpacity)}
          stroke={hexToRgba(color, mood.strokeOpacity)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={mood.dash}
          style={{
            transform: `scale(${mood.shapeScale}) rotate(${mood.rotate}deg)`,
            transformOrigin: "center",
            transition: "all 720ms ease"
          }}
        />
      </svg>
    </div>
  );
}

function ReviewPanel({ records, onClose, onClear }) {
  return (
    <section className="panel fade-panel">
      <div className="step-copy">
        <p className="step-note">轻轻回看</p>
        <h1>回看</h1>
        <p>这里只放一些你愿意留下来的片刻，不做分析，也不催促解释。</p>
      </div>

      <div className="step-content">
        {records.length === 0 ? (
          <div className="empty-state">还没有留下任何记录。</div>
        ) : (
          <div className="review-list">
            {records.map((record) => (
              <article className="review-card" key={record.id}>
                <div className="review-row">
                  <span className="swatch" style={{ background: record.colorValue }} />
                  <strong>{record.colorLabel || "未选择颜色"}</strong>
                  <time>{new Date(record.timestamp).toLocaleString("zh-CN")}</time>
                </div>
                <p>{[record.shape, record.bodyArea, record.bodyFeel].filter(Boolean).join(" · ") || "这次没有留下具体描述"}</p>
                <p>{record.change ? `最后看到的是：${record.change}` : "没有留下最后变化。"}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="panel-footer review-footer">
        <button className="nav-button" onClick={onClose} type="button">
          回到首页
        </button>
        {records.length > 0 ? (
          <button className="nav-button" onClick={onClear} type="button">
            清空
          </button>
        ) : <span />}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState("home");
  const [session, setSession] = useState(initialSession);
  const [records, setRecords] = useState([]);
  const [saveRecord, setSaveRecord] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      return undefined;
    }
  }, [records]);

  const releaseIndex = currentStep.startsWith("release-")
    ? Number(currentStep.replace("release-", ""))
    : -1;

  const accentColor = useMemo(() => {
    if (session.color?.id === "custom") return session.customColor;
    return session.color?.value || "#b8c7d9";
  }, [session.color, session.customColor]);

  const currentShape = session.shape || shapeOptions[0];
  const finalChange = session.answers.change;
  const endMessage = endMessages[finalChange] || endMessages.default;
  const isEnding = currentStep === "end";

  function goToStep(step) {
    setCurrentStep(step);
  }

  function backFromStep() {
    if (currentStep === "review") {
      goToStep("home");
      return;
    }

    if (currentStep.startsWith("release-")) {
      const index = Number(currentStep.replace("release-", ""));
      if (index === 0) {
        goToStep("body-feel");
        return;
      }
      goToStep(`release-${index - 1}`);
      return;
    }

    const order = ["home", "color", "shape", "body-area", "body-feel", "end"];
    const currentIndex = order.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(order[currentIndex - 1]);
    }
  }

  function handleSkip() {
    if (currentStep === "color") return goToStep("shape");
    if (currentStep === "shape") return goToStep("body-area");
    if (currentStep === "body-area") return goToStep("body-feel");
    if (currentStep === "body-feel") return goToStep("release-0");
    if (currentStep.startsWith("release-")) {
      const index = Number(currentStep.replace("release-", ""));
      if (index === releaseQuestions.length - 1) return goToStep("end");
      return goToStep(`release-${index + 1}`);
    }
  }

  function startNewSession(nextStep = "color") {
    setSession(initialSession);
    setSaveRecord(false);
    goToStep(nextStep);
  }

  function chooseColor(option) {
    setSession((prev) => ({ ...prev, color: option }));
    goToStep("shape");
  }

  function updateCustomColor(value) {
    const custom = { id: "custom", label: "自定义颜色", value, glow: value };
    setSession((prev) => ({ ...prev, customColor: value, color: custom }));
  }

  function confirmCustomColor() {
    setSession((prev) => ({
      ...prev,
      color: {
        id: "custom",
        label: "自定义颜色",
        value: prev.customColor,
        glow: prev.customColor
      }
    }));
    goToStep("shape");
  }

  function chooseShape(shape) {
    setSession((prev) => ({ ...prev, shape }));
    goToStep("body-area");
  }

  function chooseBodyArea(bodyArea) {
    setSession((prev) => ({ ...prev, bodyArea }));
    goToStep("body-feel");
  }

  function chooseBodyFeel(bodyFeel) {
    setSession((prev) => ({ ...prev, bodyFeel }));
    goToStep("release-0");
  }

  function answerRelease(questionId, answer, index) {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));

    if (index === releaseQuestions.length - 1) {
      goToStep("end");
      return;
    }

    goToStep(`release-${index + 1}`);
  }

  function saveCurrentRecord() {
    const record = {
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      colorLabel: session.color?.label || "自定义颜色",
      colorValue: accentColor,
      shape: session.shape?.label || "",
      bodyArea: session.bodyArea || "",
      bodyFeel: session.bodyFeel || "",
      change: finalChange || ""
    };

    setRecords((prev) => [record, ...prev].slice(0, 24));
  }

  function finishAndReset(nextStep = "home") {
    if (saveRecord) {
      saveCurrentRecord();
    }
    startNewSession(nextStep);
  }

  const shellStyle = {
    "--accent": accentColor,
    "--accent-soft": hexToRgba(accentColor, 0.22),
    "--accent-faint": hexToRgba(accentColor, 0.11),
    "--accent-line": hexToRgba(accentColor, 0.34)
  };

  return (
    <main className={`shell ${isEnding ? "shell-ending" : ""}`} style={shellStyle}>
      <div className="mist-layer mist-one" />
      <div className="mist-layer mist-two" />
      <div className="mist-layer mist-three" />

      <section className="app-frame">
        <header className="top-bar">
          <button className="corner-link" onClick={() => goToStep("review")} type="button">
            回看
          </button>
        </header>

        <EmotionAura
          color={accentColor}
          shape={currentShape}
          phase={Math.max(releaseIndex, 0)}
          isEnding={isEnding}
        />

        {currentStep === "home" ? (
          <section className="panel panel-home fade-panel">
            <div className="step-copy home-copy">
              <p className="step-note">情绪释放</p>
              <h1 className="multiline">
                {"先不用解释发生了什么。\n只是看看，此刻它在身体里是什么样子。"}
              </h1>
            </div>
            <div className="home-actions">
              <button className="primary-button" onClick={() => startNewSession("color")} type="button">
                开始释放
              </button>
            </div>
          </section>
        ) : null}

        {currentStep === "color" ? (
          <StepFrame
            title="如果它有颜色，现在更接近哪一种？"
            description="不需要想得太准确，只选更接近的就好。"
            note="此刻的颜色"
            onBack={backFromStep}
            onSkip={handleSkip}
          >
            <div className="color-grid">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  className={`color-tile ${session.color?.id === option.id ? "selected" : ""}`}
                  onClick={() => chooseColor(option)}
                  style={{
                    background: `linear-gradient(155deg, ${option.glow}, ${option.value})`,
                    boxShadow: session.color?.id === option.id
                      ? `0 18px 36px ${hexToRgba(option.value, 0.2)}`
                      : undefined
                  }}
                  type="button"
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

            <div className="custom-color-card">
              <div>
                <strong>自定义颜色</strong>
                <p>也可以让它更接近你心里的那一层颜色。</p>
              </div>
              <div className="custom-color-row">
                <input
                  aria-label="自定义颜色"
                  type="color"
                  value={session.customColor}
                  onChange={(event) => updateCustomColor(event.target.value)}
                />
                <button className="soft-button" onClick={confirmCustomColor} type="button">
                  用这个颜色
                </button>
              </div>
            </div>
          </StepFrame>
        ) : null}

        {currentStep === "shape" ? (
          <StepFrame
            title="如果这个情绪有形状，它更像什么？"
            description="只要像一点点，就已经够了。"
            note="它像什么"
            onBack={backFromStep}
            onSkip={handleSkip}
          >
            <div className="shape-grid">
              {shapeOptions.map((shape) => (
                <button
                  key={shape.id}
                  className={`shape-card ${session.shape?.id === shape.id ? "selected" : ""}`}
                  onClick={() => chooseShape(shape)}
                  type="button"
                >
                  <svg viewBox="0 0 240 220" aria-hidden="true">
                    <path d={getShapePath(shape.icon)} />
                  </svg>
                  <span>{shape.label}</span>
                </button>
              ))}
            </div>
          </StepFrame>
        ) : null}

        {currentStep === "body-area" ? (
          <StepFrame
            title="它主要停留在哪里？"
            description="可以点身体上的位置，也可以选说不清。"
            note="停留的位置"
            onBack={backFromStep}
            onSkip={handleSkip}
          >
            <div className="body-map-card">
              <div className="body-map">
                <div className="body-outline" aria-hidden="true">
                  <div className="body-head" />
                  <div className="body-torso" />
                  <div className="body-arm left" />
                  <div className="body-arm right" />
                  <div className="body-leg left" />
                  <div className="body-leg right" />
                </div>

                {bodyAreaOptions.map((area) => (
                  <button
                    key={area.label}
                    className={`body-point ${session.bodyArea === area.label ? "selected" : ""}`}
                    onClick={() => chooseBodyArea(area.label)}
                    style={{ top: area.top, left: area.left }}
                    type="button"
                  >
                    <span>{area.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </StepFrame>
        ) : null}

        {currentStep === "body-feel" ? (
          <StepFrame
            title="它的感觉更接近？"
            description="看看哪一个字最贴近它。"
            note="身体里的感觉"
            onBack={backFromStep}
            onSkip={handleSkip}
          >
            <div className="choice-grid">
              {bodyFeels.map((feel) => (
                <button className="choice-button" key={feel} onClick={() => chooseBodyFeel(feel)} type="button">
                  {feel}
                </button>
              ))}
            </div>
          </StepFrame>
        ) : null}

        {releaseIndex >= 0 ? (
          <StepFrame
            title={releaseQuestions[releaseIndex].prompt}
            description="不用解释，只选此刻更接近你的一个。"
            note="轻轻松开一点"
            onBack={backFromStep}
            onSkip={handleSkip}
            center
          >
            <div className={`choice-stack ${releaseQuestions[releaseIndex].options.length > 4 ? "dense" : ""}`}>
              {releaseQuestions[releaseIndex].options.map((option) => (
                <button
                  className="choice-button"
                  key={option}
                  onClick={() => answerRelease(releaseQuestions[releaseIndex].id, option, releaseIndex)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </StepFrame>
        ) : null}

        {currentStep === "end" ? (
          <section className="panel panel-end fade-panel">
            <div className="step-copy end-copy">
              <p className="step-note">停在这里就好</p>
              <h1 className="multiline">{endMessage}</h1>
            </div>

            <label className="save-toggle">
              <input
                checked={saveRecord}
                onChange={(event) => setSaveRecord(event.target.checked)}
                type="checkbox"
              />
              <span>愿意的话，把这次轻轻留在回看里。</span>
            </label>

            <div className="home-actions">
              <button className="primary-button" onClick={() => finishAndReset("color")} type="button">
                再释放一次
              </button>
              <button className="soft-button" onClick={() => finishAndReset("home")} type="button">
                回到首页
              </button>
            </div>
          </section>
        ) : null}

        {currentStep === "review" ? (
          <ReviewPanel
            records={records}
            onClose={() => goToStep("home")}
            onClear={() => setRecords([])}
          />
        ) : null}
      </section>
    </main>
  );
}
