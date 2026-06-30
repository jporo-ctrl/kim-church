"use client";
import Link from "next/link";
import { useState } from "react";

export default function KIMKidsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const ageGroups = [
    {
      emoji: "🍼",
      name: "Little Ones",
      range: "Ages 0–2",
      color: "#B8942A",
      description:
        "A safe, loving nursery environment with worship music, sensory play, and devoted caregivers so parents can worship freely.",
    },
    {
      emoji: "🌱",
      name: "Little Builders",
      range: "Ages 3–5",
      color: "#B8942A",
      description:
        "Hands-on Bible stories, songs with motion, simple crafts, and repetition of Kingdom truths in age-appropriate language.",
    },
    {
      emoji: "⚡",
      name: "Kingdom Kids",
      range: "Ages 6–10",
      color: "#B8942A",
      description:
        "Deeper Word engagement, object lessons, group activities, and discussion that builds real faith — not just knowledge.",
    },
    {
      emoji: "🔥",
      name: "Kingdom Builders Jr.",
      range: "Ages 11–12",
      color: "#B8942A",
      description:
        "Discussion-led, identity-focused teaching that treats them like the young leaders they already are in God's eyes.",
    },
  ];

  const pillars = [
    { icon: "📖", title: "Bible-Based", desc: "Every lesson rooted in Scripture, age-adapted but never watered down." },
    { icon: "🛡️", title: "Safe Environment", desc: "Background-checked volunteers. Structured check-in and pickup. Always." },
    { icon: "🎉", title: "Fun & Worship", desc: "Kids encounter God through joy. We sing, move, create, and celebrate." },
    { icon: "👨‍👩‍👧", title: "Parent Partnership", desc: "Take-home materials keep the conversation going at the dinner table." },
  ];

  const faqs = [
    {
      q: "When does KIM Kids meet?",
      a: "KIM Kids runs during every KIM service — currently Saturdays 6–8 PM at Compass Center, 4201 Pool Road, Grapevine, TX 76051.",
    },
    {
      q: "How does check-in work?",
      a: "We use a QR-based check-in system. On your first visit, a volunteer will register your child and issue a secure pickup code. It takes about 2 minutes.",
    },
    {
      q: "Is there a nursery?",
      a: "Yes — our Little Ones room (ages 0–2) runs simultaneously with the main service. Caregivers are background-checked and trained.",
    },
    {
      q: "What curriculum do you use?",
      a: "We use a combination of Ministry-To-Children resources and KIM-original lessons built around KIM's seven Kingdom pillars — adapted for every age group.",
    },
    {
      q: "How can I volunteer?",
      a: "We'd love to have you. Click the Serve in KIM Kids button below or email serve@kim.church.",
    },
  ];

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Inter', 'Arial', sans-serif", color: "#F0EAD6" }}>

      {/* NAV PLACEHOLDER — replace with your shared <Nav /> component */}
      <nav style={{ borderBottom: "1px solid #222", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0D0D0D", zIndex: 50 }}>
        <Link href="/" style={{ color: "#B8942A", fontWeight: 700, fontSize: 18, textDecoration: "none", letterSpacing: 1 }}>
          KIM<span style={{ color: "#F0EAD6" }}>.church</span>
        </Link>
        <div style={{ display: "flex", gap: 24, fontSize: 14 }}>
          <Link href="/" style={{ color: "#999", textDecoration: "none" }}>Home</Link>
          <Link href="/thevision" style={{ color: "#999", textDecoration: "none" }}>The Vision</Link>
          <Link href="/builders" style={{ color: "#999", textDecoration: "none" }}>Builders</Link>
          <Link href="/kids" style={{ color: "#B8942A", textDecoration: "none", fontWeight: 600 }}>KIM Kids</Link>
          <Link href="/give" style={{ color: "#999", textDecoration: "none" }}>Give</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 24px 80px", textAlign: "center" }}>
        {/* Background rings */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {[600, 480, 360].map((size, i) => (
            <div key={i} style={{
              position: "absolute", width: size, height: size, borderRadius: "50%",
              border: `1px solid rgba(184,148,42,${0.06 + i * 0.04})`,
            }} />
          ))}
        </div>

        {/* Crown icon */}
        <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>👑</div>

        <div style={{ display: "inline-block", background: "rgba(184,148,42,0.12)", border: "1px solid rgba(184,148,42,0.3)", borderRadius: 4, padding: "4px 14px", fontSize: 11, letterSpacing: 3, color: "#B8942A", fontWeight: 700, marginBottom: 20, textTransform: "uppercase" }}>
          Kingdom Insights Ministries
        </div>

        <h1 style={{ fontSize: "clamp(52px, 10vw, 88px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1, margin: "0 0 8px", color: "#F0EAD6" }}>
          KIM <span style={{ color: "#B8942A", fontStyle: "italic" }}>Kids</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 3vw, 22px)", color: "#999", maxWidth: 520, margin: "16px auto 40px", lineHeight: 1.6 }}>
          Big faith. Young hearts. Kingdom identity — starting now.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/checkin" style={{
            background: "#B8942A", color: "#0D0D0D", padding: "14px 32px",
            borderRadius: 4, fontWeight: 700, fontSize: 15, textDecoration: "none", letterSpacing: 0.5,
          }}>
            Check In Your Child →
          </Link>
          <a href="mailto:serve@kim.church" style={{
            border: "1px solid #444", color: "#F0EAD6", padding: "14px 32px",
            borderRadius: 4, fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}>
            Serve in KIM Kids
          </a>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: "#555" }}>
          Saturdays · 6–8 PM · Compass Center, Grapevine TX
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ height: 1, background: "linear-gradient(to right, transparent, #B8942A40, transparent)", margin: "0 48px" }} />

      {/* WHAT TO EXPECT — 4 PILLARS */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: 3, color: "#B8942A", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>What to Expect</p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 56px", color: "#F0EAD6" }}>
          A place where every child belongs
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              background: "#141414", border: "1px solid #222", borderRadius: 8,
              padding: "32px 24px", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#B8942A"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: "#F0EAD6", margin: "0 0 10px" }}>{p.title}</h3>
              <p style={{ color: "#777", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ height: 1, background: "linear-gradient(to right, transparent, #B8942A40, transparent)", margin: "0 48px" }} />

      {/* AGE GROUPS */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: 3, color: "#B8942A", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Age Groups</p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 16px", color: "#F0EAD6" }}>
          Teaching that meets them where they are
        </h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: 15, maxWidth: 480, margin: "0 auto 56px" }}>
          Every age group runs simultaneously with the main service — no one has to choose.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {ageGroups.map((g, i) => (
            <div key={i} style={{
              background: "#111", border: "1px solid #1E1E1E", borderRadius: 8,
              overflow: "hidden", position: "relative",
            }}>
              <div style={{ background: "#161616", borderBottom: "1px solid #222", padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>{g.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#F0EAD6" }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: "#B8942A", fontWeight: 600, marginTop: 2 }}>{g.range}</div>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ color: "#777", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{g.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHECK-IN BANNER */}
      <section style={{ margin: "0 24px 80px", maxWidth: 1052, marginLeft: "auto", marginRight: "auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #1A1500 0%, #111 60%, #1A1500 100%)",
          border: "1px solid #B8942A50",
          borderRadius: 12, padding: "52px 48px",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32,
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 11, letterSpacing: 3, color: "#B8942A", fontWeight: 700, textTransform: "uppercase", margin: "0 0 10px" }}>Secure Drop-Off</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: "0 0 12px", color: "#F0EAD6", lineHeight: 1.2 }}>
              QR Check-In &amp; Pickup
            </h2>
            <p style={{ color: "#777", fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: 0 }}>
              We use a secure QR code system for every child. You get a unique pickup code at check-in — no code, no pickup. First-time families get registered in under 2 minutes.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
            <Link href="/checkin" style={{
              background: "#B8942A", color: "#0D0D0D", padding: "14px 28px",
              borderRadius: 4, fontWeight: 700, fontSize: 15, textDecoration: "none", textAlign: "center",
            }}>
              Check In Now →
            </Link>
            <Link href="/pickup" style={{
              border: "1px solid #333", color: "#999", padding: "12px 28px",
              borderRadius: 4, fontWeight: 600, fontSize: 14, textDecoration: "none", textAlign: "center",
            }}>
              Pickup Lookup
            </Link>
          </div>
        </div>
      </section>

      {/* VOLUNTEER CTA */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, #B8942A40, transparent)", marginBottom: 80 }} />
        <p style={{ fontSize: 11, letterSpacing: 3, color: "#B8942A", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Serve</p>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 16px", color: "#F0EAD6" }}>
          The next generation needs builders too
        </h2>
        <p style={{ color: "#666", fontSize: 16, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
          You don't need a theology degree — just a heart for kids and a willingness to show up. We'll train you on everything else.
        </p>
        <a href="mailto:serve@kim.church?subject=KIM Kids Volunteer" style={{
          display: "inline-block", background: "transparent", border: "1px solid #B8942A",
          color: "#B8942A", padding: "14px 36px", borderRadius: 4, fontWeight: 700,
          fontSize: 15, textDecoration: "none", letterSpacing: 0.5,
        }}>
          Email serve@kim.church →
        </a>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 24px 100px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, #B8942A40, transparent)", marginBottom: 80 }} />
        <p style={{ fontSize: 11, letterSpacing: 3, color: "#B8942A", fontWeight: 700, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>FAQ</p>
        <h2 style={{ textAlign: "center", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: "0 0 48px", color: "#F0EAD6" }}>
          Common questions from parents
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ border: "1px solid #1E1E1E", borderRadius: 6, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", background: openFaq === i ? "#141414" : "#0F0F0F",
                  border: "none", padding: "18px 24px", display: "flex", justifyContent: "space-between",
                  alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15, color: "#F0EAD6" }}>{f.q}</span>
                <span style={{ color: "#B8942A", fontSize: 18, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ background: "#141414", padding: "0 24px 20px", borderTop: "1px solid #1E1E1E" }}>
                  <p style={{ color: "#777", fontSize: 14, lineHeight: 1.8, margin: "16px 0 0" }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{
        background: "#B8942A", padding: "64px 24px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, color: "#0D0D0D", margin: "0 0 12px", letterSpacing: -1 }}>
          Your kids belong here.
        </h2>
        <p style={{ color: "#5C4500", fontSize: 16, margin: "0 0 32px" }}>
          Bring them this Saturday — Compass Center, Grapevine TX, 6 PM.
        </p>
        <Link href="/checkin" style={{
          display: "inline-block", background: "#0D0D0D", color: "#B8942A",
          padding: "14px 36px", borderRadius: 4, fontWeight: 700, fontSize: 15, textDecoration: "none",
        }}>
          Register &amp; Check In →
        </Link>
      </section>

    </div>
  );
}
