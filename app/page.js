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
  { id: "mist-white", label: "雾白", value: "#dfe2e5", glow: "#f7f8f9" }
];

const shapeOptions = [
  { id: "mist", label: "一团雾", icon: "mist" },
  { id: "stone", label: "一块石头", icon: "stone" },
  { id: "fire", label: "一团火", icon: "fire" },
  { id: "swirl", label: "一个漩涡", icon: "swirl" },
  { id: "thorn", label: "一根刺", icon: "thorn" },
  { id: "web", label: "一张网", icon: "web" },
  { id: "sphere", label: "一个球", icon: "sphere" },
  { id: "wall", label: "一道墙", icon: "wall" },
  { id: "cloud", label: "一片云", icon: "cloud" },
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
    case "thorn":
      return "M38 176C55 151 79 127 103 102C126 78 150 52 177 36C164 63 156 78 150 96C163 91 181 91 197 96C174 106 157 121 140 138C117 162 91 186 59 196C51 188 45 183 38 176Z";
    case "web":
      return "M111 26C148 34 177 60 190 96C201 128 196 162 177 190M111 26C73 35 44 62 31 98C18 133 23 168 43 195M111 26L111 198M31 98L190 96M43 195L177 190M60 58C86 70 135 70 163 58M49 143C83 152 136 154 171 145M72 108C95 114 122 114 147 108";
    case "sphere":
      return "M111 28C157 28 194 65 194 112C194 158 157 195 111 195C64 195 27 158 27 112C27 65 64 28 111 28Z";
    case "wall":
      return "M41 61C41 49 50 40 62 40H161C173 40 182 49 182 61V160C182 172 173 181 161 181H62C50 181 41 172 41 160V61Z";
    case "cloud":
      return "M72 177C44 177 22 156 22 128C22 102 41 82 67 80C76 50 102 28 134 28C171 28 201 58 201 95C223 100 240 120 240 145C240 163 229 177 210 177H72Z";
    default:
      return "M39 117C48 81 77 54 111 50C144 45 181 61 194 96C208 134 190 176 154 192C118 208 72 197 47 165C38 152 35 134 39 117Z";
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
  const spread = 1 + phase * 0.04;
  const opacity = isEnding ? 0.24 : Math.max(0.28, 0.82 - phase * 0.11);
  const fillOpacity = isEnding ? 0.11 : Math.max(0.14, 0.28 - phase * 0.025);
  const blur = isEnding ? 56 : 28 + phase * 5;
  const dash = phase > 2 ? "10 14" : "0";

  return (
    <div className={`aura-wrap ${isEnding ? "ending-aura" : ""}`} aria-hidden="true">
      <div
        className="aura-glow"
        style={{
          background: `radial-gradient(circle, ${hexToRgba(color, isEnding ? 0.18 : 0.34)} 0%, ${hexToRgba(color, 0.12)} 42%, transparent 72%)`,
          filter: `blur(${blur}px)`,
          transform: `scale(${spread})`
        }}
      />
      <svg className="aura-shape" viewBox="0 0 240 220">
        <path
          d={path}
          fill={hexToRgba(color, fillOpacity)}
          stroke={hexToRgba(color, opacity)}
          strokeWidth={shape?.icon === "web" ? 3 : 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dash}
          style={{
            transform: `scale(${spread})`,
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
