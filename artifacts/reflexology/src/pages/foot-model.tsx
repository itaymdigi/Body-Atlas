import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

type Layer = "organs" | "nerve" | "muscle" | "skin";
type Foot = "right" | "left";

const LAYERS: { id: Layer; label: string }[] = [
  { id: "organs", label: "איברים פנימיים" },
  { id: "nerve",  label: "עצבים" },
  { id: "muscle", label: "שריר" },
  { id: "skin",   label: "עור" },
];

interface ZoneData {
  id: string; name: string; desc: string; element: string;
  color: string; glow: string;
  labelSide: "left" | "right";
}

const ZONES: ZoneData[] = [
  { id:"brain",     name:"ראש/מוח",  desc:"מרכז חשיבה, תיאום ושינה. עבודה על האצבעות מרגיעה מתח עצבי ומיגרנות.",      element:"אוויר", color:"#8b5cf6", glow:"#c4b5fd", labelSide:"left"  },
  { id:"sinus",     name:"סינוסים",  desc:"חללי אוויר בגולגולת. מסייע לאלרגיות, הצטננות וכאבי פנים.",                   element:"אוויר", color:"#0ea5e9", glow:"#bae6fd", labelSide:"right" },
  { id:"eyes",      name:"עיניים",   desc:"עייפות עינית ומתח ראייתי. בקצות אצבעות 2–3.",                                 element:"אש",    color:"#06b6d4", glow:"#a5f3fc", labelSide:"right" },
  { id:"lung",      name:"ריאות",    desc:"מערכת הנשימה. אסתמה, חרדה ונשימה רדודה. כדור כף הרגל.",                      element:"אוויר", color:"#ec4899", glow:"#fbcfe8", labelSide:"left"  },
  { id:"heart",     name:"לב",       desc:"משאבת הדם. לחץ דם, חיוניות וחיבור רגשי.",                                     element:"אש",    color:"#ef4444", glow:"#fca5a5", labelSide:"right" },
  { id:"diaphragm", name:"סרעפת",   desc:"שריר הנשימה המפריד בין בית החזה לבטן. הרפייתו משפיעה על הגוף כולו.",          element:"אוויר", color:"#84cc16", glow:"#bef264", labelSide:"left"  },
  { id:"stomach",   name:"קיבה",    desc:"עיכול מזון ורגשות. צרבת, כיבים ודאגנות יתר.",                                 element:"אש",    color:"#f97316", glow:"#fed7aa", labelSide:"right" },
  { id:"liver",     name:"כבד",     desc:"ניקוי רעלים וחילוף חומרים. ברפלקסולוגיה קשור לכעס ותסכול.",                  element:"עץ",    color:"#b45309", glow:"#d4a166", labelSide:"left"  },
  { id:"pancreas",  name:"לבלב",   desc:"ויסות סוכר וייצור אנזימים עיכוליים.",                                          element:"אדמה", color:"#ca8a04", glow:"#fde68a", labelSide:"right" },
  { id:"kidney",    name:"כליות",  desc:"ניקוי הדם. שורש אנרגיית החיים, פחדים עמוקים ומבנה.",                          element:"מים",  color:"#7c3aed", glow:"#ddd6fe", labelSide:"left"  },
  { id:"intestine", name:"מעיים",  desc:"ספיגת חומרים מזינים ופינוי. קשור לסדר ועיבוד רגשי.",                          element:"אדמה", color:"#e879a0", glow:"#fce7f3", labelSide:"right" },
  { id:"lowerback", name:"גב תחתון",desc:"תמיכה יציבה. ביטחון קיומי, גמישות ועצמאות.",                                  element:"מים",  color:"#3b82f6", glow:"#bfdbfe", labelSide:"left"  },
  { id:"pelvis",    name:"אגן",    desc:"בסיס, יציבות ואברי רבייה. קרקוע ושייכות.",                                    element:"אדמה", color:"#0f766e", glow:"#99f6e4", labelSide:"right" },
  { id:"heel",      name:"עקב",   desc:"בסיס עגן. כאב עקב קשור לחסר בתמיכה כלכלית או רגשית.",                        element:"אדמה", color:"#e8a830", glow:"#fde68a", labelSide:"left"  },
];

// Foot sole outline path, plantar view, 240×460 viewBox
const FOOT_PATH = "M 86,20 C 70,20 52,22 46,32 C 40,38 40,50 44,58 C 30,56 24,60 26,70 C 28,80 40,83 50,80 C 46,88 44,95 50,100 C 56,105 66,103 72,98 C 68,106 66,115 72,120 C 78,125 90,122 96,116 C 100,128 108,135 120,134 C 132,133 140,126 144,116 C 150,122 160,124 168,118 C 174,112 172,103 168,96 C 180,95 188,88 186,78 C 184,68 174,64 162,68 C 164,60 162,50 156,44 C 150,36 138,34 130,38 L 126,30 C 118,22 104,18 94,18 Z M 66,128 C 44,138 34,165 34,200 C 34,240 42,275 50,305 C 58,340 64,365 74,388 C 86,415 104,438 120,440 C 138,442 156,424 166,400 C 178,372 184,340 188,308 C 192,275 192,240 188,206 C 184,168 174,145 158,130 C 148,122 136,118 120,118 C 104,118 82,120 66,128 Z";

function FootSVG({ layer, selectedId, onSelect, foot }: {
  layer: Layer; selectedId: string | null; onSelect: (id: string) => void; foot: Foot;
}) {
  const sel = (id: string) => selectedId === id;

  return (
    <svg
      viewBox="0 0 240 460"
      style={{
        width: "100%", height: "100%", maxWidth: 300, maxHeight: 520,
        filter: "drop-shadow(0 16px 40px rgba(0,120,100,0.22)) drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
        transform: foot === "left" ? "scaleX(-1)" : "none",
        overflow: "visible",
      }}
    >
      <defs>
        {/* Glass foot fill */}
        <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ccfbf1" stopOpacity="0.7"/>
          <stop offset="40%"  stopColor="#99f6e4" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="glassEdge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2dd4bf"/>
          <stop offset="50%"  stopColor="#14b8a6"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </linearGradient>
        <filter id="innerGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="blobShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/>
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="footClip"><path d={FOOT_PATH}/></clipPath>

        {/* Organ radial gradients */}
        <radialGradient id="gBrain" cx="38%" cy="32%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#6d28d9"/></radialGradient>
        <radialGradient id="gSinus" cx="38%" cy="32%"><stop offset="0%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#0369a1"/></radialGradient>
        <radialGradient id="gEyes" cx="38%" cy="32%"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0e7490"/></radialGradient>
        <radialGradient id="gLungL" cx="38%" cy="32%"><stop offset="0%" stopColor="#fbcfe8"/><stop offset="100%" stopColor="#be185d"/></radialGradient>
        <radialGradient id="gLungR" cx="62%" cy="32%"><stop offset="0%" stopColor="#fbcfe8"/><stop offset="100%" stopColor="#be185d"/></radialGradient>
        <radialGradient id="gHeart" cx="40%" cy="30%"><stop offset="0%" stopColor="#fca5a5"/><stop offset="100%" stopColor="#b91c1c"/></radialGradient>
        <radialGradient id="gDiaphragm" cx="50%" cy="30%"><stop offset="0%" stopColor="#d9f99d"/><stop offset="100%" stopColor="#4d7c0f"/></radialGradient>
        <radialGradient id="gStomach" cx="38%" cy="28%"><stop offset="0%" stopColor="#fed7aa"/><stop offset="100%" stopColor="#c2410c"/></radialGradient>
        <radialGradient id="gLiver" cx="38%" cy="28%"><stop offset="0%" stopColor="#d97706"/><stop offset="60%" stopColor="#92400e"/><stop offset="100%" stopColor="#78350f"/></radialGradient>
        <radialGradient id="gPancreas" cx="38%" cy="30%"><stop offset="0%" stopColor="#fef08a"/><stop offset="100%" stopColor="#a16207"/></radialGradient>
        <radialGradient id="gKidneyL" cx="38%" cy="32%"><stop offset="0%" stopColor="#ddd6fe"/><stop offset="100%" stopColor="#5b21b6"/></radialGradient>
        <radialGradient id="gKidneyR" cx="62%" cy="32%"><stop offset="0%" stopColor="#ddd6fe"/><stop offset="100%" stopColor="#5b21b6"/></radialGradient>
        <radialGradient id="gIntestine" cx="50%" cy="30%"><stop offset="0%" stopColor="#fce7f3"/><stop offset="40%" stopColor="#f9a8d4"/><stop offset="100%" stopColor="#9d174d"/></radialGradient>
        <radialGradient id="gLowerBack" cx="50%" cy="30%"><stop offset="0%" stopColor="#bfdbfe"/><stop offset="100%" stopColor="#1e40af"/></radialGradient>
        <radialGradient id="gPelvis" cx="50%" cy="30%"><stop offset="0%" stopColor="#99f6e4"/><stop offset="100%" stopColor="#0f766e"/></radialGradient>
        <radialGradient id="gHeel" cx="40%" cy="30%"><stop offset="0%" stopColor="#fef3c7"/><stop offset="50%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#b45309"/></radialGradient>
        {/* Skin gradient */}
        <radialGradient id="gSkinFill" cx="35%" cy="30%"><stop offset="0%" stopColor="#fde8d8"/><stop offset="100%" stopColor="#d4956a"/></radialGradient>
        {/* Nerve gradient */}
        <radialGradient id="gNerveFill" cx="35%" cy="30%"><stop offset="0%" stopColor="#dbeafe"/><stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5"/></radialGradient>
        {/* Muscle gradient */}
        <radialGradient id="gMuscleFill" cx="35%" cy="30%"><stop offset="0%" stopColor="#fecdd3"/><stop offset="100%" stopColor="#f87171" stopOpacity="0.5"/></radialGradient>
      </defs>

      {/* ── SKIN LAYER ── */}
      {layer === "skin" && (
        <g>
          <path d={FOOT_PATH} fill="url(#gSkinFill)" stroke="#c8856a" strokeWidth="2" opacity="0.95"/>
          <path d="M 80,135 Q 120,130 160,135" stroke="#c8956a" strokeWidth="0.8" fill="none" opacity="0.5"/>
          <path d="M 72,175 Q 120,170 168,175" stroke="#c8956a" strokeWidth="0.8" fill="none" opacity="0.4"/>
          <path d="M 66,220 Q 120,215 174,220" stroke="#c8956a" strokeWidth="0.8" fill="none" opacity="0.4"/>
          <path d="M 62,270 Q 120,265 178,270" stroke="#c8956a" strokeWidth="0.8" fill="none" opacity="0.3"/>
          <path d="M 58,320 Q 120,315 182,320" stroke="#c8956a" strokeWidth="0.8" fill="none" opacity="0.3"/>
          <ellipse cx="90"  cy="55" rx="18" ry="13" fill="#e8a070" opacity="0.3"/>
          <ellipse cx="140" cy="50" rx="14" ry="11" fill="#e8a070" opacity="0.25"/>
          <ellipse cx="70"  cy="80" rx="10" ry="8"  fill="#e8a070" opacity="0.2"/>
        </g>
      )}

      {/* ── MUSCLE LAYER ── */}
      {layer === "muscle" && (
        <g>
          <path d={FOOT_PATH} fill="url(#gMuscleFill)" stroke="#ef4444" strokeWidth="1.5" opacity="0.5"/>
          <g clipPath="url(#footClip)" opacity="0.75">
            <path d="M 80,135 C 70,155 66,190 68,230 C 70,270 76,305 86,340 L 100,390 L 120,395 L 140,390 L 154,340 C 164,305 170,270 170,230 C 170,190 166,155 156,135 Z" fill="#fca5a5" opacity="0.55"/>
            {[155, 190, 230, 272, 315, 360].map((y, i) => (
              <path key={i} d={`M 62,${y} Q 120,${y-5} 178,${y}`} stroke="#e11d48" strokeWidth="2.2" fill="none" opacity={0.55 - i * 0.05} strokeLinecap="round"/>
            ))}
            {[[-0.2, 1.5], [0.2, 1.5], [-0.25, 2.5], [0.25, 2.5]].map(([xMul, yMid], i) => (
              <path key={i} d={`M ${120+xMul*60},135 L ${120+xMul*50},390`} stroke="#be123c" strokeWidth={2} fill="none" opacity="0.45"/>
            ))}
          </g>
        </g>
      )}

      {/* ── NERVE LAYER ── */}
      {layer === "nerve" && (
        <g>
          <path d={FOOT_PATH} fill="url(#gNerveFill)" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4"/>
          <g clipPath="url(#footClip)">
            {/* Central nerve trunk */}
            <path d="M 120,30 L 120,430" stroke="#1d4ed8" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round"/>
            {/* Left branches */}
            <path d="M 120,80 C 100,90 80,110 66,145 C 54,175 48,220 50,265" stroke="#2563eb" strokeWidth="1.8" fill="none" opacity="0.7"/>
            <path d="M 120,150 C 98,160 76,175 62,210" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M 120,240 C 96,250 72,265 60,300" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M 120,330 C 96,340 74,358 64,388" stroke="#60a5fa" strokeWidth="1.3" fill="none" opacity="0.55"/>
            {/* Right branches */}
            <path d="M 120,80 C 140,90 162,110 174,145 C 186,175 192,220 190,265" stroke="#2563eb" strokeWidth="1.8" fill="none" opacity="0.7"/>
            <path d="M 120,150 C 142,160 164,175 178,210" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M 120,240 C 144,250 168,265 180,300" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M 120,330 C 146,340 166,358 176,388" stroke="#60a5fa" strokeWidth="1.3" fill="none" opacity="0.55"/>
            {/* Nodes */}
            {[55, 100, 148, 200, 255, 315, 380, 425].map((y, i) => (
              <g key={i}>
                <circle cx="120" cy={y} r="6" fill="#1d4ed8" opacity="0.2"/>
                <circle cx="120" cy={y} r="3.5" fill="#60a5fa" opacity="0.9" filter="url(#glow)"/>
              </g>
            ))}
          </g>
        </g>
      )}

      {/* ── ORGANS LAYER ── */}
      {layer === "organs" && (
        <g>
          {/* Glass foot body */}
          <path d={FOOT_PATH} fill="url(#glassBody)" opacity="1"/>
          {/* Inner glass shimmer */}
          <path d="M 100,125 C 88,132 78,148 74,170 C 70,194 72,225 78,260 C 84,296 94,328 106,354 C 112,368 118,375 124,372 C 116,365 110,350 106,328 C 100,298 96,262 96,228 C 96,196 100,168 106,148 Z"
            fill="white" opacity="0.18"/>
          {/* Foot border */}
          <path d={FOOT_PATH} fill="none" stroke="url(#glassEdge)" strokeWidth="2.5"/>
          {/* Outer glow ring */}
          <path d={FOOT_PATH} fill="none" stroke="#2dd4bf" strokeWidth="5" opacity="0.15"/>

          {/* ── BRAIN ── (top, toes area, rose-purple walnut shape) */}
          <g onClick={() => onSelect("brain")} style={{ cursor:"pointer" }} filter={sel("brain") ? "url(#glow)" : "url(#blobShadow)"}>
            <ellipse cx="110" cy="60" rx="26" ry="22" fill="url(#gBrain)" stroke={sel("brain") ? "#c4b5fd" : "rgba(255,255,255,0.4)"} strokeWidth={sel("brain") ? "2.5" : "1"}/>
            {/* Brain wrinkles */}
            <path d="M 92,58 Q 100,50 108,58 Q 116,66 124,58" stroke="#7c3aed" strokeWidth="1.2" fill="none" opacity="0.5" clipPath="url(#footClip)"/>
            <path d="M 94,65 Q 103,58 112,65 Q 121,72 130,65" stroke="#7c3aed" strokeWidth="1.2" fill="none" opacity="0.4" clipPath="url(#footClip)"/>
            <ellipse cx="104" cy="55" rx="7" ry="5" fill="white" opacity="0.28"/>
            {sel("brain") && <ellipse cx="110" cy="60" rx="30" ry="26" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.5"/>}
          </g>

          {/* ── SINUSES ── bilateral small ovals */}
          {([
            { cx:80, cy:72, g:"gSinus" },
            { cx:142, cy:70, g:"gSinus" },
          ]).map((s, i) => (
            <g key={i} onClick={() => onSelect("sinus")} style={{ cursor:"pointer" }} filter={sel("sinus") ? "url(#glow)" : "url(#blobShadow)"}>
              <ellipse cx={s.cx} cy={s.cy} rx="14" ry="11" fill={`url(#${s.g})`} stroke={sel("sinus") ? "#7dd3fc" : "rgba(255,255,255,0.4)"} strokeWidth={sel("sinus") ? "2" : "1"}/>
              <ellipse cx={s.cx - 3} cy={s.cy - 3} rx="4" ry="3" fill="white" opacity="0.3"/>
            </g>
          ))}

          {/* ── EYES ── tiny teal circles */}
          {([
            { cx:88, cy:96, g:"gEyes" },
            { cx:134, cy:95, g:"gEyes" },
          ]).map((e, i) => (
            <g key={i} onClick={() => onSelect("eyes")} style={{ cursor:"pointer" }} filter={sel("eyes") ? "url(#glow)" : "url(#blobShadow)"}>
              <circle cx={e.cx} cy={e.cy} r="10" fill={`url(#${e.g})`} stroke={sel("eyes") ? "#67e8f9" : "rgba(255,255,255,0.4)"} strokeWidth={sel("eyes") ? "2" : "1"}/>
              {/* Pupil-like highlight */}
              <circle cx={e.cx - 2} cy={e.cy - 2} r="3" fill="white" opacity="0.35"/>
              <circle cx={e.cx + 1} cy={e.cy + 1} r="1.5" fill="#0e7490" opacity="0.6"/>
            </g>
          ))}

          {/* ── LUNGS ── two wing shapes */}
          <g onClick={() => onSelect("lung")} style={{ cursor:"pointer" }} filter={sel("lung") ? "url(#glow)" : "url(#blobShadow)"}>
            {/* Left lung */}
            <path d="M 74,130 C 62,135 56,148 56,162 C 56,178 62,196 72,210 C 80,222 88,226 94,220 C 100,214 102,202 100,185 C 98,168 94,148 88,136 Z"
              fill="url(#gLungL)" stroke={sel("lung") ? "#fbcfe8" : "rgba(255,255,255,0.35)"} strokeWidth={sel("lung") ? "2" : "0.8"} opacity="0.92"/>
            {/* Right lung */}
            <path d="M 166,130 C 178,135 184,148 184,162 C 184,178 178,196 168,210 C 160,222 152,226 146,220 C 140,214 138,202 140,185 C 142,168 146,148 152,136 Z"
              fill="url(#gLungR)" stroke={sel("lung") ? "#fbcfe8" : "rgba(255,255,255,0.35)"} strokeWidth={sel("lung") ? "2" : "0.8"} opacity="0.92"/>
            {/* Lung lobes texture */}
            <path d="M 76,155 Q 84,150 92,158" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4"/>
            <path d="M 74,172 Q 83,167 91,175" stroke="white" strokeWidth="0.8" fill="none" opacity="0.35"/>
            <path d="M 164,155 Q 156,150 148,158" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4"/>
            <path d="M 166,172 Q 157,167 149,175" stroke="white" strokeWidth="0.8" fill="none" opacity="0.35"/>
            <ellipse cx="76"  cy="145" rx="7" ry="5" fill="white" opacity="0.25"/>
            <ellipse cx="164" cy="145" rx="7" ry="5" fill="white" opacity="0.25"/>
            {sel("lung") && <>
              <path d="M 74,130 C 62,135 56,148 56,162 C 56,178 62,196 72,210 C 80,222 88,226 94,220 C 100,214 102,202 100,185 C 98,168 94,148 88,136 Z"
                fill="none" stroke="#fbcfe8" strokeWidth="2" opacity="0.5"/>
              <path d="M 166,130 C 178,135 184,148 184,162 C 184,178 178,196 168,210 C 160,222 152,226 146,220 C 140,214 138,202 140,185 C 142,168 146,148 152,136 Z"
                fill="none" stroke="#fbcfe8" strokeWidth="2" opacity="0.5"/>
            </>}
          </g>

          {/* ── HEART ── between the lungs */}
          <g onClick={() => onSelect("heart")} style={{ cursor:"pointer" }} filter={sel("heart") ? "url(#glow)" : "url(#blobShadow)"}>
            <path d="M 120,158 C 120,158 105,144 102,140 C 98,134 98,128 102,126 C 106,122 112,124 116,128 C 118,130 120,133 120,133 C 120,133 122,130 124,128 C 128,124 134,122 138,126 C 142,128 142,134 138,140 C 135,144 120,158 120,158 Z"
              fill="url(#gHeart)" stroke={sel("heart") ? "#fca5a5" : "rgba(255,255,255,0.35)"} strokeWidth={sel("heart") ? "2" : "0.8"}/>
            <ellipse cx="112" cy="132" rx="5" ry="3.5" fill="white" opacity="0.3"/>
            {sel("heart") && <path d="M 120,162 C 120,162 103,146 100,141 C 95,133 95,126 100,123 C 105,120 111,122 115,127 C 117,129 120,133 120,133 C 120,133 123,129 125,127 C 129,122 135,120 140,123 C 145,126 145,133 140,141 C 137,146 120,162 120,162 Z"
              fill="none" stroke="#fca5a5" strokeWidth="2" opacity="0.45"/>}
          </g>

          {/* ── DIAPHRAGM ── thin curved band */}
          <g onClick={() => onSelect("diaphragm")} style={{ cursor:"pointer" }}>
            <path d="M 60,225 C 76,218 96,215 120,216 C 144,215 164,218 180,225 C 176,232 162,236 144,235 C 128,234 112,234 96,235 C 78,236 64,232 60,225 Z"
              fill="url(#gDiaphragm)" stroke={sel("diaphragm") ? "#bef264" : "rgba(255,255,255,0.35)"} strokeWidth={sel("diaphragm") ? "2" : "0.8"} opacity="0.9"/>
            <ellipse cx="96" cy="225" rx="14" ry="4" fill="white" opacity="0.22"/>
            {sel("diaphragm") && <path d="M 58,225 C 74,217 95,214 120,215 C 145,214 166,217 182,225"
              fill="none" stroke="#bef264" strokeWidth="2.5" opacity="0.5"/>}
          </g>

          {/* ── STOMACH ── J-shaped orange blob */}
          <g onClick={() => onSelect("stomach")} style={{ cursor:"pointer" }} filter={sel("stomach") ? "url(#glow)" : "url(#blobShadow)"}>
            <path d="M 80,243 C 72,243 64,250 62,262 C 60,274 64,286 72,292 C 80,298 92,298 100,290 C 108,282 110,268 106,256 C 102,244 92,240 84,240 Z"
              fill="url(#gStomach)" stroke={sel("stomach") ? "#fed7aa" : "rgba(255,255,255,0.35)"} strokeWidth={sel("stomach") ? "2" : "0.8"}/>
            <ellipse cx="76" cy="250" rx="7" ry="5" fill="white" opacity="0.3"/>
            {sel("stomach") && <path d="M 78,242 C 70,242 62,249 60,261 C 58,273 62,285 70,292 C 78,299 90,299 99,291"
              fill="none" stroke="#fed7aa" strokeWidth="2" opacity="0.5"/>}
          </g>

          {/* ── LIVER ── large right-side brown mass */}
          <g onClick={() => onSelect("liver")} style={{ cursor:"pointer" }} filter={sel("liver") ? "url(#glow)" : "url(#blobShadow)"}>
            <path d="M 116,238 C 124,234 138,234 150,238 C 164,242 174,252 178,264 C 182,276 180,290 172,298 C 164,306 150,308 138,304 C 126,300 116,290 114,276 C 112,262 112,244 116,238 Z"
              fill="url(#gLiver)" stroke={sel("liver") ? "#d4a166" : "rgba(255,255,255,0.3)"} strokeWidth={sel("liver") ? "2" : "0.8"}/>
            <ellipse cx="138" cy="248" rx="10" ry="7" fill="white" opacity="0.22"/>
            {sel("liver") && <path d="M 114,237 C 122,233 137,233 149,237 C 163,241 173,251 177,263 C 181,275 179,289 171,297"
              fill="none" stroke="#d4a166" strokeWidth="2" opacity="0.5"/>}
          </g>

          {/* ── PANCREAS ── thin banana shape */}
          <g onClick={() => onSelect("pancreas")} style={{ cursor:"pointer" }} filter={sel("pancreas") ? "url(#glow)" : "url(#blobShadow)"}>
            <path d="M 72,308 C 80,302 96,300 110,302 C 124,304 136,310 140,316 C 136,322 122,326 108,324 C 94,322 80,318 72,312 Z"
              fill="url(#gPancreas)" stroke={sel("pancreas") ? "#fde68a" : "rgba(255,255,255,0.35)"} strokeWidth={sel("pancreas") ? "2" : "0.8"}/>
            <ellipse cx="88" cy="308" rx="8" ry="4" fill="white" opacity="0.28"/>
          </g>

          {/* ── KIDNEYS ── bilateral beans */}
          {([
            { cx:78, cy:336, g:"gKidneyL", flip:false },
            { cx:158, cy:334, g:"gKidneyR", flip:true  },
          ]).map((k, i) => (
            <g key={i} onClick={() => onSelect("kidney")} style={{ cursor:"pointer" }} filter={sel("kidney") ? "url(#glow)" : "url(#blobShadow)"}>
              <path
                d={k.flip
                  ? `M ${k.cx+16},${k.cy} C ${k.cx+16},${k.cy-16} ${k.cx+8},${k.cy-22} ${k.cx},${k.cy-20} C ${k.cx-8},${k.cy-18} ${k.cx-14},${k.cy-10} ${k.cx-16},${k.cy} C ${k.cx-16},${k.cy+14} ${k.cx-8},${k.cy+22} ${k.cx},${k.cy+20} C ${k.cx+8},${k.cy+18} ${k.cx+16},${k.cy+14} ${k.cx+16},${k.cy} Z`
                  : `M ${k.cx-16},${k.cy} C ${k.cx-16},${k.cy-16} ${k.cx-8},${k.cy-22} ${k.cx},${k.cy-20} C ${k.cx+8},${k.cy-18} ${k.cx+14},${k.cy-10} ${k.cx+16},${k.cy} C ${k.cx+16},${k.cy+14} ${k.cx+8},${k.cy+22} ${k.cx},${k.cy+20} C ${k.cx-8},${k.cy+18} ${k.cx-16},${k.cy+14} ${k.cx-16},${k.cy} Z`
                }
                fill={`url(#${k.g})`}
                stroke={sel("kidney") ? "#ddd6fe" : "rgba(255,255,255,0.35)"}
                strokeWidth={sel("kidney") ? "2" : "0.8"}
              />
              <ellipse cx={k.cx + (k.flip ? 6 : -6)} cy={k.cy - 6} rx="5" ry="3.5" fill="white" opacity="0.28"/>
            </g>
          ))}

          {/* ── INTESTINES ── coiled pink mass */}
          <g onClick={() => onSelect("intestine")} style={{ cursor:"pointer" }} filter={sel("intestine") ? "url(#glow)" : "url(#blobShadow)"}>
            <ellipse cx="118" cy="372" rx="46" ry="30" fill="url(#gIntestine)" opacity="0.85"
              stroke={sel("intestine") ? "#fce7f3" : "rgba(255,255,255,0.25)"} strokeWidth={sel("intestine") ? "2" : "0.8"}/>
            {/* Intestine coil lines */}
            <path d="M 82,365 C 90,358 102,360 108,368 C 114,376 110,384 100,385 C 90,386 80,380 80,370" stroke="#be185d" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
            <path d="M 118,360 C 128,355 140,358 144,366 C 148,374 142,382 132,383" stroke="#be185d" strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round"/>
            <path d="M 96,380 C 106,384 118,384 126,378" stroke="#be185d" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/>
            <ellipse cx="94"  cy="366" rx="8" ry="5" fill="white" opacity="0.22"/>
          </g>

          {/* ── LOWER BACK ── blue horizontal structure */}
          <g onClick={() => onSelect("lowerback")} style={{ cursor:"pointer" }} filter={sel("lowerback") ? "url(#glow)" : "url(#blobShadow)"}>
            <path d="M 76,407 C 84,400 100,396 120,396 C 140,396 156,400 164,407 C 160,414 148,418 134,418 C 122,419 108,419 96,418 C 84,417 76,414 76,407 Z"
              fill="url(#gLowerBack)" stroke={sel("lowerback") ? "#bfdbfe" : "rgba(255,255,255,0.3)"} strokeWidth={sel("lowerback") ? "2" : "0.8"} opacity="0.9"/>
            <ellipse cx="104" cy="407" rx="14" ry="4" fill="white" opacity="0.22"/>
          </g>

          {/* ── PELVIS ── teal bowl shape */}
          <g onClick={() => onSelect("pelvis")} style={{ cursor:"pointer" }} filter={sel("pelvis") ? "url(#glow)" : "url(#blobShadow)"}>
            <path d="M 84,422 C 84,430 90,440 106,442 C 118,444 132,442 140,436 C 148,430 152,422 148,416 C 140,420 130,422 120,422 C 110,422 96,420 84,422 Z"
              fill="url(#gPelvis)" stroke={sel("pelvis") ? "#99f6e4" : "rgba(255,255,255,0.3)"} strokeWidth={sel("pelvis") ? "2" : "0.8"}/>
            <ellipse cx="110" cy="430" rx="12" ry="5" fill="white" opacity="0.2"/>
          </g>

          {/* ── HEEL ── large golden sphere */}
          <g onClick={() => onSelect("heel")} style={{ cursor:"pointer" }} filter={sel("heel") ? "url(#glow)" : "url(#blobShadow)"}>
            <circle cx="118" cy="426" r="22" fill="url(#gHeel)" stroke={sel("heel") ? "#fef3c7" : "rgba(255,255,255,0.35)"} strokeWidth={sel("heel") ? "2" : "0.8"} opacity="0.88"/>
            <ellipse cx="110" cy="418" rx="8" ry="6" fill="white" opacity="0.3"/>
            {sel("heel") && <circle cx="118" cy="426" r="26" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.45"/>}
          </g>

          {/* ── LABEL CONNECTORS & DOTS (organs layer) ── */}
          {ZONES.map(z => {
            const coords: Record<string, { dotX: number; dotY: number }> = {
              brain:    { dotX:110, dotY:60 },
              sinus:    { dotX:142, dotY:70 },
              eyes:     { dotX:134, dotY:95 },
              lung:     { dotX:166, dotY:170 },
              heart:    { dotX:120, dotY:140 },
              diaphragm:{ dotX:60,  dotY:225 },
              stomach:  { dotX:64,  dotY:266 },
              liver:    { dotX:172, dotY:264 },
              pancreas: { dotX:142, dotY:313 },
              kidney:   { dotX:62,  dotY:336 },
              intestine:{ dotX:164, dotY:368 },
              lowerback:{ dotX:78,  dotY:407 },
              pelvis:   { dotX:152, dotY:430 },
              heel:     { dotX:96,  dotY:436 },
            };
            const c = coords[z.id];
            if (!c) return null;
            const isLeft = z.labelSide === "left";
            const lineEndX = isLeft ? 36 : 204;
            const labelX = isLeft ? 36 : 204;
            const isSelected = sel(z.id);
            return (
              <g key={z.id} onClick={() => onSelect(z.id)} style={{ cursor:"pointer" }}>
                {/* connector dot at organ */}
                <circle cx={c.dotX} cy={c.dotY} r={isSelected ? 5 : 3.5}
                  fill={isSelected ? z.color : "white"}
                  stroke={z.color} strokeWidth="1.5"
                  filter={isSelected ? "url(#glow)" : ""}
                />
                {/* line */}
                <line x1={c.dotX} y1={c.dotY} x2={lineEndX} y2={c.dotY}
                  stroke={isSelected ? z.color : "rgba(255,255,255,0.65)"}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                  strokeDasharray={isSelected ? "none" : "2,2"}
                />
                {/* label box */}
                <rect
                  x={isLeft ? labelX - 50 : labelX}
                  y={c.dotY - 10}
                  width="50" height="20" rx="10"
                  fill={isSelected ? z.color : "rgba(255,255,255,0.9)"}
                  stroke={isSelected ? z.glow : "rgba(200,220,215,0.8)"}
                  strokeWidth={isSelected ? "1.5" : "0.8"}
                />
                <text
                  x={isLeft ? labelX - 25 : labelX + 25}
                  y={c.dotY + 4}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight={isSelected ? "700" : "600"}
                  fill={isSelected ? "white" : "#134e4a"}
                  style={{ pointerEvents:"none" }}
                  fontFamily="Rubik, sans-serif"
                >
                  {z.name}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

export default function FootModel() {
  const [layer,    setLayer]    = useState<Layer>("organs");
  const [foot,     setFoot]     = useState<Foot>("right");
  const [selected, setSelected] = useState<string | null>("brain");
  const [rotY,     setRotY]     = useState(0);
  const [zoom,     setZoom]     = useState(1);

  const dragging   = useRef(false);
  const lastX      = useRef(0);
  const velX       = useRef(0);
  const animRef    = useRef<number | null>(null);

  const selectedZone = ZONES.find(z => z.id === selected) ?? null;

  // Auto-rotate
  useEffect(() => {
    let lastTs = performance.now();
    let running = true;
    const tick = (ts: number) => {
      if (!running) return;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (!dragging.current) {
        setRotY(r => r + 22 * dt);
        velX.current *= 0.9;
        setRotY(r => r + velX.current);
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { running = false; if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    velX.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    velX.current = dx * 0.35;
    setRotY(r => r + dx * 0.5);
    lastX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  const cosY = Math.cos((rotY * Math.PI) / 180);
  const showBack = cosY < 0;

  return (
    <div className="flex flex-col h-full" data-testid="foot-model-page">
      {/* Header */}
      <div className="pb-4 border-b border-border mb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">מפת כף הרגל</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {foot === "right" ? "כף רגל ימין" : "כף רגל שמאל"} — {layer === "organs" ? "איברים פנימיים" : LAYERS.find(l=>l.id===layer)?.label}
        </p>
      </div>

      {/* Layer Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 flex-shrink-0 scrollbar-hide">
        {LAYERS.map(l => (
          <button key={l.id} onClick={() => setLayer(l.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              layer === l.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}>{l.label}</button>
        ))}
      </div>

      {/* Foot toggle */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        {(["right","left"] as Foot[]).map(f => (
          <button key={f} onClick={() => setFoot(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              foot === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}>{f === "right" ? "ימין" : "שמאל"}</button>
        ))}
      </div>

      {/* Main */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* LEFT: label column for left-side organs */}
        {layer === "organs" && (
          <div className="hidden xl:flex flex-col w-16 shrink-0 justify-end pb-8">
            <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">מקרא שכבות</p>
            {[
              { label: "עור",          color: "#e8b090" },
              { label: "שריר",         color: "#f87171" },
              { label: "עצבים",        color: "#60a5fa" },
              { label: "איברים פנימיים", color: "#2dd4bf" },
              { label: "כאב",          color: "#ef4444" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }}/>
                <span className="text-[9px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* CENTER: 3D rotating foot */}
        <div
          className="flex-1 rounded-3xl overflow-hidden border border-border shadow-inner bg-gradient-to-b from-teal-50/40 via-white to-slate-50 relative select-none cursor-grab active:cursor-grabbing"
          style={{ minHeight: 420 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
            <button onClick={() => setZoom(z => Math.min(z + 0.15, 2))}
              className="w-8 h-8 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white">
              <ZoomIn className="w-4 h-4 text-muted-foreground"/>
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
              className="w-8 h-8 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white">
              <ZoomOut className="w-4 h-4 text-muted-foreground"/>
            </button>
            <button onClick={() => { setRotY(0); setZoom(1); velX.current = 0; }}
              className="w-8 h-8 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center hover:bg-white">
              <RotateCcw className="w-4 h-4 text-muted-foreground"/>
            </button>
          </div>

          {/* 3-D perspective container */}
          <div className="w-full h-full flex items-center justify-center py-6">
            <div style={{ perspective: "1000px", perspectiveOrigin: "50% 48%" }}>
              <div style={{
                transform: `rotateY(${foot === "left" ? -rotY : rotY}deg) scale(${zoom})`,
                transformStyle: "preserve-3d",
                transition: "none",
                display: "inline-block",
              }}>
                {/* Front face */}
                <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <FootSVG layer={layer} selectedId={selected} onSelect={setSelected} foot={foot}/>
                </div>
                {/* Back face (mirrored, plain glass) */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}>
                  <svg viewBox="0 0 240 460" style={{ width:"100%", height:"100%", maxWidth:300, maxHeight:520 }}>
                    <defs>
                      <linearGradient id="backGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ccfbf1" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#5eead4" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path d={FOOT_PATH} fill="url(#backGlass)" stroke="#14b8a6" strokeWidth="2"/>
                    <path d="M 90,135 C 75,148 65,175 62,210 C 58,255 62,300 70,340 C 78,375 90,405 108,428"
                      stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Status hint */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground/80 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-border/30">
              {showBack ? "מבט אחורי" : "מבט קדמי"} · גרור לסיבוב המודל · צבט לפתיחה וסגירה
            </span>
          </div>
        </div>

        {/* RIGHT: info panel */}
        <div className="hidden lg:flex flex-col w-52 shrink-0 gap-3">
          <AnimatePresence mode="wait">
            {selectedZone && (
              <motion.div key={selectedZone.id}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl p-4 text-sm shadow-lg text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${selectedZone.glow}33, ${selectedZone.color})` }}>
                <div className="font-bold text-base mb-1 drop-shadow">{selectedZone.name}</div>
                <div className="text-xs opacity-80 mb-2 font-medium">יסוד: {selectedZone.element}</div>
                <p className="text-xs leading-relaxed opacity-95">{selectedZone.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-xs font-semibold text-muted-foreground px-1 mt-1">מיפוי איברים</div>
          <ScrollArea className="flex-1 rounded-2xl bg-card border border-border">
            <div className="p-2 space-y-0.5">
              {ZONES.map(z => (
                <button key={z.id} onClick={() => setSelected(z.id)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                    selected===z.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: z.color }}/>
                  {z.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
