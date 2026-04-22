/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Share2, 
  CheckCircle2, 
  QrCode, 
  Wallet, 
  Users, 
  Bell, 
  FileText, 
  Plus, 
  ArrowLeft,
  Smartphone,
  Info,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Activity
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#080808",
  surface: "#101010",
  card: "#141414",
  cardHover: "#181818",
  border: "#1E1E1E",
  borderLight: "#2A2A2A",
  accent: "#FF5C00",
  accentDim: "#FF5C0018",
  accentBorder: "#FF5C0035",
  text: "#F0F0F0",
  textSub: "#A0A0A0",
  textMuted: "#666666",
  success: "#00D96F",
  successDim: "#00D96F15",
  successBorder: "#00D96F30",
  info: "#4DA8FF",
  infoDim: "#4DA8FF15",
  warm: "#FF9F0A",
  warmDim: "#FF9F0A15",
  red: "#FF3B5C",
  redDim: "#FF3B5C15",
  fontHead: "'Syne', sans-serif",
  fontBody: "'DM Sans', sans-serif",
};

// ─── ADDING TYPOGRAPHY TUNING ────────────────────────────────────────────────
const S = {
  h1: { fontFamily: T.fontHead, letterSpacing: "-0.04em", fontWeight: 800 },
  h2: { fontFamily: T.fontHead, letterSpacing: "-0.03em", fontWeight: 800 },
  label: { fontFamily: T.fontHead, letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase" as const },
};

// ─── DATA ───────────────────────────────────────────────────────────────────
const CITIES = ["All", "Pune", "Mumbai", "Ahmedabad", "Bangalore"];
const CATS = ["All", "Religious", "Cultural", "Social", "Professional"];
const CAT_COLORS = { 
  Religious: T.warm, 
  Cultural: T.red, 
  Social: T.success, 
  Professional: T.info, 
  All: T.accent 
};

const EVENTS = [
  { id: 1, emoji: "🪔", title: "Ganesh Utsav 2025", org: "Shree Siddhivinayak Mandal", city: "Pune", date: "Aug 27–Sep 4", cat: "Religious", price: "₹51", priceNum: 51, type: "Donation", attendees: 347, color: T.warm, desc: "10 days of devotion, prasad & cultural programs. All are welcome. 80G receipts for donations above ₹500." },
  { id: 2, emoji: "🎭", title: "Navratri Garba Night", org: "Ahmedabad Cultural Assoc.", city: "Ahmedabad", date: "Oct 2–11", cat: "Cultural", price: "₹199", priceNum: 199, type: "Paid", attendees: 1240, color: T.red, desc: "9 nights of garba, dandiya & celebration. Passes limited. Dress code: traditional." },
  { id: 3, emoji: "😂", title: "Morning Laughter Club", org: "Andheri West Laughter Circle", city: "Mumbai", date: "Every Sunday", cat: "Social", price: "Free", priceNum: 0, type: "RSVP", attendees: 82, color: T.success, desc: "Start your Sunday with joy! 45 min laughter yoga session at Joggers Park." },
  { id: 4, emoji: "🛕", title: "Diya Sponsorship Drive", org: "ISKCON Bangalore", city: "Bangalore", date: "Oct 2–11", cat: "Religious", price: "₹108+", priceNum: 108, type: "Donation", attendees: 523, color: T.warm, desc: "Sponsor a diya during Navratri. Each diya lit in your name. 80G receipt issued." },
  { id: 5, emoji: "🎓", title: "IIT Bombay Alumni Reunion", org: "IITB Alumni Association", city: "Mumbai", date: "Nov 15", cat: "Professional", price: "₹500", priceNum: 500, type: "Paid", attendees: 211, color: T.info, desc: "Annual alumni meetup. Networking, dinner & batch photos. Batch of 2005–2015 welcome." },
];

const MEMBERS = [
  { id: 1, name: "Ramesh Sharma", mobile: "98201XXXXX", zone: "Shivajinagar", paid: true, amount: 108 },
  { id: 2, name: "Sunita Joshi", mobile: "97302XXXXX", zone: "Camp", paid: true, amount: 500 },
  { id: 3, name: "Anil Kulkarni", mobile: "99703XXXXX", zone: "Kothrud", paid: false, amount: 0 },
  { id: 4, name: "Priya Mehta", mobile: "96404XXXXX", zone: "Shivajinagar", paid: true, amount: 51 },
  { id: 5, name: "Deepak Rane", mobile: "98505XXXXX", zone: "Hadapsar", paid: false, amount: 0 },
  { id: 6, name: "Kavita Desai", mobile: "97606XXXXX", zone: "Camp", paid: true, amount: 251 },
  { id: 7, name: "Vikas Nair", mobile: "98707XXXXX", zone: "Kothrud", paid: false, amount: 0 },
  { id: 8, name: "Sneha Patil", mobile: "96808XXXXX", zone: "Hadapsar", paid: true, amount: 108 },
];

// ─── ATOMS & COMPONENTS ────────────────────────────────────────────────────────

const Badge = ({ children, color = T.accent, size = "sm" }: any) => (
  <span style={{
    background: `${color}12`, color,
    border: `1px solid ${color}25`,
    borderRadius: 99, padding: size === "sm" ? "3px 10px" : "5px 14px",
    fontSize: size === "sm" ? 10 : 12, fontWeight: 700,
    letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 4,
    fontFamily: T.fontHead, textTransform: "uppercase"
  }}>{children}</span>
);

const Chip = ({ children, active, color = T.accent, onClick }: any) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    style={{
      background: active ? (color || T.accent) : T.surface,
      color: active ? "#fff" : T.textSub,
      border: `1px solid ${active ? (color || T.accent) : T.border}`,
      borderRadius: 99, padding: "7px 16px",
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      fontFamily: T.fontBody, whiteSpace: "nowrap",
      transition: "background 0.2s, color 0.2s, border-color 0.2s",
    }}
  >
    {children}
  </motion.button>
);

const Btn = ({ children, full = false, secondary = false, small = false, danger = false, onClick = () => {}, disabled = false, loading = false }: any) => (
  <motion.button 
    whileTap={disabled ? {} : { scale: 0.97 }}
    onClick={onClick} 
    disabled={disabled || loading} 
    style={{
      background: disabled ? T.border : secondary ? "transparent" : danger ? T.red : T.accent,
      color: disabled ? T.textMuted : secondary ? T.textSub : "#fff",
      border: secondary ? `1px solid ${T.border}` : "none",
      borderRadius: 12, padding: small ? "10px 18px" : "15px 24px",
      fontSize: small ? 13 : 15, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto",
      fontFamily: T.fontHead, letterSpacing: "0.02em",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      position: "relative", overflow: "hidden"
    }}
  >
    {loading ? "..." : children}
  </motion.button>
);

const Input = ({ label = "", placeholder = "", type = "text", value = "", onChange = () => {}, hint = "", icon: Icon = null }: any) => (
  <div style={{ marginBottom: 18 }}>
    {label && <div style={{ fontSize: 11, color: T.textSub, marginBottom: 8, ...S.label }}>{label}</div>}
    <div style={{ position: "relative" }}>
      {Icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted }}><Icon size={18} /></span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
        width: "100%", background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: 12,
        padding: (Icon as any) ? "14px 14px 14px 44px" : "14px 16px", color: T.text,
        fontSize: 15, transition: "all 0.2s", fontFamily: T.fontBody
      }} />
    </div>
    {hint && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><Info size={12} /> {hint}</div>}
  </div>
);

const Avatar = ({ name, size = 40, color = T.accent, ring = false }: any) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `${color}10`, color, 
    border: ring ? `2px solid ${T.bg}` : `1.5px solid ${color}25`,
    outline: ring ? `1.5px solid ${color}40` : "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.4, fontWeight: 800, flexShrink: 0,
    fontFamily: T.fontHead, position: "relative"
  }}>
    {name?.[0]?.toUpperCase()}
  </div>
);

const SectionLabel = ({ children, right = null }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
    <div style={{ fontSize: 11, color: T.textSub, ...S.label }}>{children}</div>
    {right && <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>{right}</div>}
  </div>
);

const Divider = ({ margin = "14px 0" }: any) => (
  <div style={{ height: 1.5, background: T.border, margin }} />
);

// ─── SCREENS ────────────────────────────────────────────────────────────────

// 1. DISCOVER
const DiscoverScreen = ({ setScreen, setSelectedEvent }) => {
  const [city, setCity] = useState("All");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => EVENTS.filter(e =>
    (city === "All" || e.city === city) &&
    (cat === "All" || e.cat === cat)
  ), [city, cat]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "30px 24px 10px", position: "sticky", top: 0, background: T.bg, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ ...S.h1, fontSize: 24, color: T.accent }}>CoFu</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.textSub, fontSize: 12, fontWeight: 600, marginTop: 2 }}>
              <MapPin size={12} color={T.accent} strokeWidth={2.5} /> {city === "All" ? "Across India" : city}
            </div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={20} color={T.textSub} />
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", pb: 15, scrollbarWidth: "none" }} className="no-scrollbar">
          {CITIES.map(c => <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>)}
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }} className="no-scrollbar">
          {CATS.map(c => <Chip key={c} active={cat === c} color={CAT_COLORS[c]} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
      </div>

      {/* Featured Hero */}
      <AnimatePresence mode="wait">
        {featured && (
          <motion.div 
            key={featured.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => { setSelectedEvent(featured); setScreen("event"); }}
            style={{
              margin: "24px 24px 20px", cursor: "pointer",
              background: `linear-gradient(165deg, ${featured.color}25, ${T.card} 60%)`,
              border: `1px solid ${featured.color}35`,
              borderRadius: 24, padding: "26px", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -20, right: -20, width: 140, height: 140, background: `radial-gradient(circle, ${featured.color}25, transparent 70%)` }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
              <Badge color={featured.color}>{featured.cat}</Badge>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.textSub, fontSize: 13, fontWeight: 600 }}>
                <Users size={14} /> {featured.attendees}
              </div>
            </div>

            <div style={{ fontSize: 56, marginBottom: 16 }}>{featured.emoji}</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: T.fontHead, marginBottom: 6, lineHeight: 1.2 }}>{featured.title}</div>
            <div style={{ fontSize: 14, color: T.textSub, marginBottom: 28 }}>{featured.org}</div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 10, color: T.textSub, fontWeight: 700, letterSpacing: "0.1em" }}>STARTS AT</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: featured.color, fontFamily: T.fontHead }}>{featured.price}</div>
              </div>
              <motion.div 
                whileHover={{ x: 5 }}
                style={{ background: featured.color, borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
              >
                <ChevronRight />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div style={{ padding: "10px 24px 20px" }}>
        <SectionLabel>TRENDING NEARBY</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rest.map((e, i) => (
            <motion.div 
              key={e.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setSelectedEvent(e); setScreen("event"); }}
              style={{
                display: "flex", gap: 16, alignItems: "center",
                padding: "16px", background: T.card, borderRadius: 20,
                border: `1px solid ${T.border}`, cursor: "pointer"
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: `${e.color}10`, fontSize: 26,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${e.color}20`,
              }}>{e.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: T.fontHead, marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 13, color: T.textSub, display: "flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={12} /> {e.date.split("–")[0]}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 800, fontFamily: T.fontHead, color: e.price === "Free" ? T.success : e.color }}>{e.price}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{e.attendees} going</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. EVENT DETAIL
const EventScreen = ({ setScreen, event }) => {
  const e = event || EVENTS[0];
  const screenRef = useRef(null);

  useEffect(() => {
    screenRef.current?.scrollTo(0,0);
  }, [e]);

  return (
    <div ref={screenRef} style={{ paddingBottom: 120 }}>
      {/* Visual Header */}
      <div style={{
        height: 380, position: "relative", overflow: "hidden",
        background: `linear-gradient(to bottom, ${e.color}35, ${T.bg})`,
        display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "30px 24px"
      }}>
        {/* Top Controls */}
        <div style={{ position: "absolute", top: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", zIndex: 10 }}>
          <button onClick={() => setScreen("discover")} style={{ width: 44, height: 44, borderRadius: 14, background: "#00000040", backdropFilter: "blur(10px)", border: "1px solid #ffffff20", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={20} />
          </button>
          <button style={{ width: 44, height: 44, borderRadius: 14, background: "#00000040", backdropFilter: "blur(10px)", border: "1px solid #ffffff20", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Share2 size={20} />
          </button>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{ fontSize: 100, marginBottom: 20, filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))" }}
        >
          {e.emoji}
        </motion.div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Badge color={e.color}>{e.cat}</Badge>
          <Badge color={T.textSub}>{e.city}</Badge>
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, fontFamily: T.fontHead, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>{e.title}</div>
        <div style={{ fontSize: 16, color: T.textSub, fontWeight: 500 }}>by {e.org}</div>
      </div>

      <div style={{ padding: "30px 24px" }}>
        {/* Quick Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, padding: 16 }}>
            <div style={{ color: T.textSub, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6 }}>WHEN</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{e.date}</div>
          </div>
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, padding: 16 }}>
            <div style={{ color: T.textSub, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6 }}>WHERE</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{e.city} Center</div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[
            { label: "ATTENDING", val: e.attendees, icon: Users, color: e.color },
            { label: "GOAL", val: "₹5L", icon: TrendingUp, color: T.success },
            { label: "VIEWS", val: "2.4K", icon: Activity, color: T.info },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: s.color, marginBottom: 8, display: "flex", justifyContent: "center" }}><s.icon size={20} /></div>
              <div style={{ fontWeight: 800, fontSize: 18, fontFamily: T.fontHead }}>{s.val}</div>
              <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 700, letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <SectionLabel>ABOUT THE EVENT</SectionLabel>
        <div style={{ color: T.textSub, fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>{e.desc}</div>

        <SectionLabel>PICK YOUR PASS</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {[
            { name: "General Entry", desc: "Access to community zone", price: "Free", color: T.success },
            { name: "Patron Pass", desc: "Front row seating + Gift", price: "₹1,001", color: e.color },
            { name: "Family Bundle", desc: "Pass for 4 members", price: "₹2,500", color: T.info },
          ].map(p => (
            <div key={p.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, fontFamily: T.fontHead, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>{p.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: p.color, fontWeight: 800, fontSize: 18, fontFamily: T.fontHead }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>

        <SectionLabel>ORGANISER</SectionLabel>
        <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name={e.org} size={50} color={e.color} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: T.fontHead }}>{e.org}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.success, fontSize: 11, fontWeight: 700, marginTop: 2 }}>
              <CheckCircle2 size={12} /> VERIFIED COMMUNITY
            </div>
          </div>
          <button style={{ color: T.accent, fontSize: 13, fontWeight: 700 }}>Follow</button>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, padding: "20px 24px 30px", background: `linear-gradient(to top, ${T.bg} 80%, transparent)`, zIndex: 100 }}>
        <Btn full onClick={() => setScreen("register")}>Register Now <ChevronRight size={18} /></Btn>
      </div>
    </div>
  );
};

// 3. REGISTER
const RegisterScreen = ({ event, setScreen }) => {
  const e = event || EVENTS[0];
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("108");

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => step === 1 ? setScreen("event") : setStep(s => s - 1)} style={{ color: T.textSub }}><ArrowLeft /></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: "0.1em" }}>REGISTRATION</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.fontHead }}>{e.title}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.accent }}>{step}/3</div>
      </div>

      <div style={{ padding: "30px 24px" }}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: T.fontHead, marginBottom: 8, letterSpacing: "-0.02em" }}>Who's attending?</h2>
            <p style={{ color: T.textSub, fontSize: 15, marginBottom: 32 }}>We'll send your digital pass on WhatsApp.</p>
            
            <Input label="Full Name" placeholder="e.g. Ramesh Patel" value={name} onChange={v => setName(v.target.value)} />
            <Input label="Mobile Number" placeholder="98765 43210" type="tel" value={mobile} onChange={v => setMobile(v.target.value)} icon={Smartphone} hint="Standard WhatsApp charges may apply" />
            
            <div style={{ marginTop: 40 }}>
              <Btn full disabled={!name || !mobile} onClick={() => setStep(2)}>Next Step <ChevronRight size={18} /></Btn>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: T.fontHead, marginBottom: 8, letterSpacing: "-0.02em" }}>Contribution</h2>
            <p style={{ color: T.textSub, fontSize: 15, marginBottom: 32 }}>Your support keeps the community thriving 🙏</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["51", "101", "251", "501", "1001", "5001"].map(p => (
                <button key={p} onClick={() => setAmount(p)} style={{
                  padding: "16px 10px", borderRadius: 14,
                  border: `1px solid ${amount === p ? T.accent : T.border}`,
                  background: amount === p ? `${T.accent}15` : T.surface,
                  color: amount === p ? T.accent : T.text,
                  fontWeight: 700, fontSize: 15, transition: "0.2s"
                }}>₹{p}</button>
              ))}
            </div>
            
            <Input label="Custom Amount" placeholder="₹ Enter value" type="number" value={amount} onChange={v => setAmount(v.target.value)} />

            <div style={{ background: T.infoDim, border: `1px solid ${T.info}30`, borderRadius: 14, padding: 12, display: "flex", gap: 12, marginTop: 24 }}>
              <div style={{ color: T.info }}><CheckCircle2 size={18} /></div>
              <div style={{ fontSize: 12, color: T.info, lineHeight: 1.4 }}>Contributions above ₹500 are eligible for 80G tax benefit.</div>
            </div>

            <div style={{ marginTop: 40 }}>
              <Btn full onClick={() => setStep(3)}>Complete Payment <ChevronRight size={18} /></Btn>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.successDim, color: T.success, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: T.fontHead, marginBottom: 8 }}>Success!</h2>
            <p style={{ color: T.textSub, fontSize: 15, marginBottom: 40 }}>Your ticket has been sent to {mobile}.</p>

            {/* Pass Card */}
            <div style={{ background: T.card, borderRadius: 28, border: `1px solid ${T.border}`, overflow: "hidden", textAlign: "left", position: "relative" }}>
              <div style={{ height: 6, background: e.color }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 800, letterSpacing: "0.1em" }}>OFFICIAL PASS</div>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: T.fontHead }}>{e.title}</div>
                  </div>
                  <div style={{ fontSize: 32 }}>{e.emoji}</div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 30 }}>
                  <div>
                    <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700 }}>HOLDER</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700 }}>PAID</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.success }}>₹{amount}</div>
                  </div>
                </div>

                <div style={{ border: `1.5px dashed ${T.border}`, padding: 24, borderRadius: 16, display: "flex", justifyContent: "center" }}>
                  <QrCode size={100} color={T.text} />
                </div>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: T.textMuted, fontFamily: "monospace" }}>COFU-PK-9283-X1</div>
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <Btn full secondary onClick={() => setScreen("discover")}>Back to Discover</Btn>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// 4. DASHBOARD (Treasurer View)
const DashboardScreen = () => {
  return (
    <div style={{ paddingBottom: 100 }}>
       <div style={{ padding: "30px 24px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: T.accent, fontWeight: 800, letterSpacing: "0.15em", fontFamily: T.fontHead }}>TREASURER ACCESS</div>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: T.fontHead, letterSpacing: "-0.02em" }}>Mandal Dashboard</div>
          </div>
          <Avatar name="Shree Siddhivinayak" size={44} ring color={T.warm} />
        </div>

        {/* Live Pulse Card */}
        <div style={{ background: T.successDim, borderRadius: 20, border: `1px solid ${T.successBorder}`, padding: 20, display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.success, boxShadow: `0 0 10px ${T.success}` }} className="pulse" />
          <div style={{ flex: 1 }}>
            <div style={{ color: T.success, fontWeight: 700, fontSize: 11, letterSpacing: "0.05em" }}>LIVE EVENT: GANESH UTSAV</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>Collecting Dahihandi Bhet</div>
          </div>
          <button style={{ background: T.success, color: "#000", border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 800 }}>GO LIVE</button>
        </div>

        {/* Total Stats */}
        <div style={{ background: `linear-gradient(135deg, ${T.surface}, ${T.bg})`, border: `1px solid ${T.border}`, borderRadius: 24, padding: 24, marginBottom: 24 }}>
          <div style={{ color: T.textSub, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 8 }}>TOTAL TREASURY</div>
          <div style={{ fontSize: 36, fontWeight: 900, fontFamily: T.fontHead, letterSpacing: "-0.03em" }}>₹8,42,100</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Badge color={T.success}>+12% vs last month</Badge>
          </div>
          
          <div style={{ height: 1.5, background: T.border, margin: "24px 0" }} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, marginBottom: 4 }}>DIGITAL (UPI)</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>₹6,12,000</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, marginBottom: 4 }}>OFFLINE CASH</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>₹2,30,100</div>
            </div>
          </div>
        </div>

        <SectionLabel right="View All">QUICK ACTIONS</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Log Cash", icon: Wallet, color: T.accent, desc: "Add cash entry" },
            { label: "Reminders", icon: Bell, color: T.info, desc: "Notify pending" },
            { label: "Receipts", icon: FileText, color: T.success, desc: "80G / Manual" },
            { label: "Scanner", icon: QrCode, color: T.warm, desc: "Check entry" },
          ].map(a => (
            <motion.div 
              key={a.label}
              whileTap={{ scale: 0.95 }}
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 20 }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${a.color}10`, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <a.icon size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: T.fontHead }}>{a.label}</div>
              <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{a.desc}</div>
            </motion.div>
          ))}
        </div>

        <SectionLabel>RECENT TRANSACTIONS</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { name: "Varun Verma", amt: "+ ₹501", type: "UPI", time: "2m ago" },
            { name: "Anita Rao", amt: "+ ₹108", type: "CASH", time: "14m ago" },
            { name: "Manoj Joshi", amt: "+ ₹2,000", type: "80G", time: "1h ago" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar name={t.name} size={38} color={i % 2 === 0 ? T.success : T.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{t.type} Entry</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: T.success }}>{t.amt}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{t.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. MEMBERS
const MembersScreen = () => {
  const [tab, setTab] = useState("all");
  const filtered = useMemo(() => MEMBERS.filter(m => tab === "all" || (tab === "paid" ? m.paid : !m.paid)), [tab]);

  return (
    <div style={{ paddingBottom: 100 }}>
       <div style={{ padding: "30px 24px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: T.fontHead, letterSpacing: "-0.03em" }}>Members</div>
          <button style={{ background: T.accent, color: "#fff", width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[{ L: "PAID", V: "142", C: T.success }, { L: "PENDING", V: "45", C: T.red }, { L: "TOTAL", V: "187", C: T.text }].map(s => (
            <div key={s.L} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.C, fontFamily: T.fontHead }}>{s.V}</div>
              <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 800, letterSpacing: "0.1em", marginTop: 4 }}>{s.L}</div>
            </div>
          ))}
        </div>

        <Input placeholder="Search name or ID..." icon={Search} />

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["all", "paid", "pending"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "12px", borderRadius: 12, border: "none",
              background: tab === t ? T.surface : "transparent",
              color: tab === t ? T.text : T.textMuted,
              fontWeight: 700, fontSize: 13, textTransform: "capitalize"
            }}>{t}</button>
          ))}
        </div>

        {tab === "pending" && (
          <div style={{ background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.accent }}>Bulk Reminder</div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>Nudge all 45 pending members via WhatsApp.</div>
            </div>
            <button style={{ background: T.accent, border: "none", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <MessageCircle size={20} />
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {filtered.map((m, i) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <Avatar name={m.name} size={42} color={m.paid ? T.success : T.textMuted} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: T.fontHead }}>{m.name}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{m.mobile} • {m.zone}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {m.paid ? (
                  <div style={{ color: T.success, fontWeight: 800, fontSize: 13, background: T.successDim, padding: "4px 10px", borderRadius: 8 }}>PAID</div>
                ) : (
                  <div style={{ color: T.red, fontWeight: 800, fontSize: 13, background: T.redDim, padding: "4px 10px", borderRadius: 8 }}>PENDING</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ROLE SWITCHER (simulates login state) ────────────────────────────────────
const RoleBanner = ({ role, setRole, setScreen }: any) => {
  const isTreasurer = role === "treasurer";
  
  const handleSwitch = () => {
    const nextRole = isTreasurer ? "public" : "treasurer";
    setRole(nextRole);
    // Auto-redirect if switching from treasurer to public while on treasurer screens
    if (isTreasurer) {
      setScreen("discover");
    }
  };

  return (
    <div style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
      position: "relative", zIndex: 1001
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: isTreasurer ? T.success : T.info }} />
        <div style={{ fontSize: 11, color: T.textSub, fontWeight: 500, fontFamily: T.fontBody }}>
          Mode: <span style={{ color: T.text, fontWeight: 700 }}>{isTreasurer ? "Treasurer (Shree Mandal)" : "Public Visitor"}</span>
        </div>
      </div>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={handleSwitch} 
        style={{
          background: "transparent", border: `1px solid ${T.border}`,
          color: T.accent, borderRadius: 8, padding: "5px 12px",
          fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: T.fontHead,
          letterSpacing: "0.02em"
        }}
      >
        SWITCH ROLE
      </motion.button>
    </div>
  );
};

// ─── 3. HOST EVENT (Create Wizard) ──────────────────────────────────────────

const CreateScreen = ({ setScreen }: any) => {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Form State
  const [form, setForm] = useState({
    orgName: "", orgType: "", contactName: "", contactMobile: "", contactEmail: "",
    eventName: "", eventCat: "", startDate: "", endDate: "", city: "", venue: "", desc: "",
    upiId: "", passType: "", amount: "", is80G: false, reg80G: ""
  });

  const updateForm = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const steps = ["Organiser", "Details", "Payments", "Launch"];

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "40px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🚀</div>
      <h2 style={{ ...S.h1, fontSize: 28, marginBottom: 12 }}>Event is Live!</h2>
      <p style={{ color: T.textSub, fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
        Your community page is ready. Share it on WhatsApp to start collecting registrations.
      </p>

      <div style={{ background: T.card, border: `1px solid ${T.accentBorder}`, borderRadius: 24, padding: 24, textAlign: "left", marginBottom: 32 }}>
        <div style={{ ...S.label, color: T.accent, marginBottom: 12 }}>EVENT LINK</div>
        <div style={{ 
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px", 
          display: "flex", justifyContent: "space-between", alignItems: "center" 
        }}>
          <span style={{ fontSize: 13, color: T.textSub, fontFamily: "monospace" }}>cofu.app/e/ganesh-2025</span>
          <button style={{ color: T.accent, fontWeight: 700, fontSize: 13 }}>COPY</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
        <button style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <MessageCircle color={T.success} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>WhatsApp</span>
        </button>
        <button style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Share2 color={T.info} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>Other Apps</span>
        </button>
      </div>

      <Btn full onClick={() => setScreen("dashboard")}>Go to Dashboard</Btn>
    </motion.div>
  );

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 10px", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: T.bg, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => setScreen("discover")} style={{ color: T.textSub }}><ArrowLeft /></button>
          <div style={{ ...S.h2, fontSize: 16 }}>Host New Event</div>
          <div style={{ width: 24 }} />
        </div>
        
        {/* Progress Dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ 
              flex: 1, height: 4, borderRadius: 2, 
              background: step > i + 1 ? T.success : step === i + 1 ? T.accent : T.border,
              transition: "0.3s"
            }} />
          ))}
        </div>
        <div style={{ ...S.label, fontSize: 9, color: T.textMuted }}>STEP {step}: {steps[step-1]}</div>
      </div>

      <div style={{ padding: "30px 24px" }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SectionLabel>ORGANISER INFO</SectionLabel>
              <Input label="Organisation Name" placeholder="e.g. Shree Siddhivinayak Mandal" value={form.orgName} onChange={(e: any) => updateForm("orgName", e.target.value)} />
              
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...S.label, fontSize: 11, color: T.textSub, marginBottom: 8 }}>Organisation Type</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Mandali", "Temple", "RWA", "Club"].map(t => (
                    <button key={t} onClick={() => updateForm("orgType", t)} style={{
                      padding: "12px", borderRadius: 12, border: `1px solid ${form.orgType === t ? T.accent : T.border}`,
                      background: form.orgType === t ? `${T.accent}10` : T.surface,
                      color: form.orgType === t ? T.accent : T.text, fontSize: 13, fontWeight: 600
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <Divider margin="24px 0" />
              <SectionLabel>CONTACT PERSON</SectionLabel>
              <Input label="Full Name" placeholder="Your Name" value={form.contactName} onChange={(e: any) => updateForm("contactName", e.target.value)} />
              <Input label="Mobile Number" placeholder="98XXXXXXXX" type="tel" value={form.contactMobile} onChange={(e: any) => updateForm("contactMobile", e.target.value)} />
              <Input label="Email Address" placeholder="alex@gmail.com" type="email" value={form.contactEmail} onChange={(e: any) => updateForm("contactEmail", e.target.value)} />
              
              <div style={{ marginTop: 32 }}>
                <Btn full onClick={next}>Next Step <ChevronRight size={18} /></Btn>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SectionLabel>EVENT DETAILS</SectionLabel>
              <Input label="Event Title" placeholder="e.g. Navratri Dandiya Night" value={form.eventName} onChange={(e: any) => updateForm("eventName", e.target.value)} />
              
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...S.label, fontSize: 11, color: T.textSub, marginBottom: 8 }}>Category</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }} className="no-scrollbar">
                  {CATS.filter(c => c !== "All").map(c => (
                    <Chip key={c} active={form.eventCat === c} onClick={() => updateForm("eventCat", c)}>{c}</Chip>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Start Date" type="date" value={form.startDate} onChange={(e: any) => updateForm("startDate", e.target.value)} />
                <Input label="End Date" type="date" value={form.endDate} onChange={(e: any) => updateForm("endDate", e.target.value)} />
              </div>

              <Input label="City" placeholder="Pune" value={form.city} onChange={(e: any) => updateForm("city", e.target.value)} />
              <Input label="Venue" placeholder="Ganesh Ground, Sector 4" value={form.venue} onChange={(e: any) => updateForm("venue", e.target.value)} />
              
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...S.label, fontSize: 11, color: T.textSub, marginBottom: 8 }}>Description</div>
                <textarea 
                  placeholder="Tell people about the event..."
                  value={form.desc}
                  onChange={(e) => updateForm("desc", e.target.value)}
                  style={{
                    width: "100%", background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 12, padding: "14px", color: T.text, fontSize: 15,
                    minHeight: 100, fontFamily: T.fontBody, resize: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <Btn secondary full onClick={back}>Back</Btn>
                <Btn full onClick={next}>Next Step <ChevronRight size={18} /></Btn>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SectionLabel>PAYMENT SETTINGS</SectionLabel>
              <Input label="UPI ID for Collections" placeholder="mandal@upi" value={form.upiId} onChange={(e: any) => updateForm("upiId", e.target.value)} icon={Wallet} hint="Payments settle instantly to your bank" />
              
              <div style={{ marginBottom: 24 }}>
                <div style={{ ...S.label, fontSize: 11, color: T.textSub, marginBottom: 8 }}>Pass Type</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Free", "Donation", "Fixed", "Tiered"].map(t => (
                    <button key={t} onClick={() => updateForm("passType", t)} style={{
                      padding: "12px", borderRadius: 12, border: `1px solid ${form.passType === t ? T.accent : T.border}`,
                      background: form.passType === t ? `${T.accent}10` : T.surface,
                      color: form.passType === t ? T.accent : T.text, fontSize: 13, fontWeight: 600
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {form.passType === "Fixed" && (
                <Input label="Ticket Price (₹)" type="number" placeholder="499" value={form.amount} onChange={(e: any) => updateForm("amount", e.target.value)} />
              )}

              <Divider margin="32px 0" />

              <div style={{ padding: "16px", background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>80G Registration</div>
                  <button 
                    onClick={() => updateForm("is80G", !form.is80G)}
                    style={{ width: 44, height: 24, borderRadius: 12, background: form.is80G ? T.accent : T.border, position: "relative", transition: "0.2s" }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", left: form.is80G ? 23 : 3, top: 3, transition: "0.2s" }} />
                  </button>
                </div>
                {form.is80G && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <Input label="80G Reg Number" placeholder="e.g. REG-12345-AA" value={form.reg80G} onChange={(e: any) => updateForm("reg80G", e.target.value)} hint="Auto-included in donor receipts" />
                  </motion.div>
                )}
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                  When enabled, donors will receive a tax-compliant receipt automatically.
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <Btn secondary full onClick={back}>Back</Btn>
                <Btn full onClick={next}>Preview <ChevronRight size={18} /></Btn>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SectionLabel>REVIEW EVERYTHING</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 20, background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🪔</div>
                  <h3 style={{ ...S.h2, fontSize: 20, marginBottom: 4 }}>{form.eventName || "Untitled Event"}</h3>
                  <div style={{ color: T.textSub, fontSize: 13 }}>{form.city} • {form.startDate}</div>
                </div>

                <div style={{ padding: 20, background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }}>
                  <div style={{ ...S.label, fontSize: 10, color: T.textSub, marginBottom: 12 }}>ORGANISER</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{form.orgName}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>Contact: {form.contactName}</div>
                </div>

                <div style={{ padding: 20, background: T.card, borderRadius: 20, border: `1px solid ${T.border}` }}>
                  <div style={{ ...S.label, fontSize: 10, color: T.textSub, marginBottom: 12 }}>MONEY</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>UPI: {form.upiId}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>Pass: {form.passType} {form.amount && `(₹${form.amount})`}</div>
                  {form.is80G && <div style={{ fontSize: 12, color: T.success, marginTop: 4 }}>✓ 80G Enabled</div>}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <Btn secondary full onClick={back}>Edit</Btn>
                <Btn full onClick={() => setDone(true)}>Launch Event 🚀</Btn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── MAIN APP NAVIGATION ──────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "discover", icon: Search, label: "Explore", public: true },
  { id: "event", icon: Calendar, label: "Events", public: true },
  { id: "create", icon: Plus, label: "Host", public: true },
  { id: "dashboard", icon: TrendingUp, label: "Treasury", public: false },
  { id: "members", icon: Users, label: "Members", public: false },
];

export default function App() {
  const [role, setRole] = useState("public"); // "public" | "treasurer"
  const [screen, setScreen] = useState("discover");
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0]);

  const availableNavItems = useMemo(() => 
    NAV_ITEMS.filter(item => role === "treasurer" || item.public),
  [role]);

  return (
    <div style={{ 
      background: T.bg, color: T.text, minHeight: "100vh", 
      fontFamily: T.fontBody, maxWidth: 430, margin: "0 auto",
      position: "relative", overflowX: "hidden"
    }}>
      <RoleBanner role={role} setRole={setRole} setScreen={setScreen} />

      <AnimatePresence mode="wait">
        <motion.div
           key={screen}
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -10 }}
           transition={{ duration: 0.2 }}
        >
          {screen === "discover" && <DiscoverScreen setScreen={setScreen} setSelectedEvent={setSelectedEvent} />}
          {screen === "event" && <EventScreen setScreen={setScreen} event={selectedEvent} />}
          {screen === "create" && <CreateScreen setScreen={setScreen} />}
          {screen === "register" && <RegisterScreen event={selectedEvent} setScreen={setScreen} />}
          {screen === "dashboard" && <DashboardScreen />}
          {screen === "members" && <MembersScreen />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navbar */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, height: 74,
        background: "#080808F0", backdropFilter: "blur(20px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        zIndex: 1000, paddingBottom: 10
      }}>
        {availableNavItems.map((item) => {
          const isActive = screen === item.id;
          const isHost = item.id === "create";

          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              style={{
                background: "none", border: "none", color: isActive ? T.accent : T.textMuted,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                transition: "0.2s", cursor: "pointer",
                padding: "8px"
              }}
            >
              {isHost ? (
                <div style={{ 
                  background: T.accent, color: "#fff", 
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 2, boxShadow: `0 4px 12px ${T.accent}30`
                }}>
                  <item.icon size={20} />
                </div>
              ) : (
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              )}
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: T.fontHead, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {item.label}
              </span>
              {isActive && !isHost && (
                <motion.div layoutId="nav-pill" style={{ width: 16, height: 2, background: T.accent, borderRadius: 2, marginTop: 2 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
