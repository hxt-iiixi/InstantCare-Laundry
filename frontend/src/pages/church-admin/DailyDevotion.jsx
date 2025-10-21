import React from "react";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";
import { useDailyRandomVerse } from "../../lib/useDailyRandomVerse"

const Icon = ({ file, className = "h-4 w-4", alt = "" }) => (
  <img src={`/src/assets/icons/${file}.svg`} alt={alt || file} className={className} draggable="false" />
);

const Img = ({ file, className = "w-full h-full object-cover", alt = "" }) => (
  <img src={`/src/assets/images/${file}`} alt={alt || file} className={className} draggable="false" />
);

export default function DailyDevotion() {
  const { text, reference, translation, loading, error } = useDailyRandomVerse();

  return (
    <div className="min-h-screen bg-[#FBF7F3]">
      <AdminSidebar />
      <AdminHeader className="pl-[232px]" title="Daily Devotion" />
      <main className="pl-[232px] pt-[64px]">
        <div className="max-w-5xl mx-auto w-full px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
            Daily Devotion &amp; Bible Verse
          </h1>

          {/* Today's Bible Verse */}
          <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 relative">
            <button type="button" className="absolute right-3 top-3 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200" aria-label="Edit verse">
              <Icon file="edit" className="h-4 w-4 opacity-80" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-[#0F172A]">Today&apos;s Bible Verse</h2>

            <div className="mt-3 border-l-4 border-orange-400 pl-4">
              <p className="italic text-slate-800">
                {loading ? "Loading verse..." : error ? "Could not load verse." : `“${text}”`}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {loading || error ? "" : `— ${reference} (${translation})`}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button className="rounded-md bg-[#D33131] text-white px-4 py-2 text-sm hover:opacity-95">Discard</button>
              <button className="rounded-md bg-[#20A04C] text-white px-4 py-2 text-sm hover:opacity-95">Save changes</button>
            </div>
          </section>

          {/* Reflection Prompts */}
          <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 relative">
            <button type="button" className="absolute right-3 top-3 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200" aria-label="Edit prompts">
              <Icon file="edit" className="h-4 w-4 opacity-80" />
            </button>

            <h3 className="text-lg md:text-xl font-semibold text-slate-900">Reflection Prompts</h3>
            <p className="text-sm text-slate-500 mt-1">Take a moment to reflect on today&apos;s message.</p>

            <div className="mt-4 space-y-4">
              <Prompt n={1} q="How does Philippians 4:13 resonate with your current life challenges?" />
              <Prompt n={2} q="What specific areas of your life do you need Christ’s strength today?" />
              <Prompt n={3} q="How can you practically apply this verse to overcome a difficulty this week?" />
              <Prompt n={4} q="Consider a time when you felt God’s strength. How can you carry that experience forward?" />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button className="rounded-md bg-[#D33131] text-white px-4 py-2 text-sm hover:opacity-95">Discard</button>
              <button className="rounded-md bg-[#20A04C] text-white px-4 py-2 text-sm hover:opacity-95">Save changes</button>
            </div>
          </section>

          <button type="button" className="fixed right-6 bottom-24 md:bottom-20 h-12 w-12 rounded-full shadow-md bg-white border border-slate-200 overflow-hidden" aria-label="Helper">
            <Img file="avatar.jpg" />
          </button>

          {/* Previous Devotions */}
          <section className="mt-10">
            <h4 className="text-2xl font-semibold text-slate-900 text-center">Previous Devotions</h4>
            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <DevotionCard img="devotion-1.jpg" date="May 15, 2024" title="The Power of Forgiveness" excerpt="Exploring the liberating power of forgiveness as taught in the scriptures, and how it transforms relationships." />
              <DevotionCard img="devotion-2.jpg" date="May 14, 2024" title="Living in Gratitude" excerpt="A daily practice of gratitude can profoundly shift our perspective, bringing joy and peace into our lives." />
              <DevotionCard img="devotion-3.jpg" date="May 13, 2024" title="Understanding Divine Love" excerpt="Delving into the depths of God’s unconditional love and how it shapes our identity and purpose." />
              <DevotionCard img="devotion-4.jpg" date="May 12, 2024" title="Faith in Uncertain Times" excerpt="How to maintain unwavering faith when facing trials and uncertainties, trusting in God’s sovereign plan." />
              <DevotionCard img="devotion-5.jpg" date="May 11, 2024" title="The Importance of Community" excerpt="Discovering the biblical call to fellowship and the strength found in supporting one another." />
              <DevotionCard img="devotion-6.jpg" date="May 10, 2024" title="Prayer: Our Direct Line" excerpt="Exploring prayer as a vital spiritual discipline and how it connects us directly to God’s heart." />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- small helpers ---------- */
function Prompt({ n, q }) {
  return (
    <div>
      <label className="block text-[13px] text-slate-700">
        <span className="font-medium">{n}. </span>
        {q}
      </label>
      <textarea
        rows={3}
        placeholder="Write your thoughts here..."
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
    </div>
  );
}

function DevotionCard({ img, date, title, excerpt }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-sm transition">
      <div className="h-[140px] w-full overflow-hidden">
        <Img file={img} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="text-[12px] text-slate-500">{date}</div>
        <h5 className="mt-1 font-semibold text-slate-900">{title}</h5>
        <p className="mt-2 text-[13px] leading-6 text-slate-600 line-clamp-3">{excerpt}</p>
        <button className="mt-3 text-sm text-orange-600 hover:underline">Read More</button>
      </div>
    </article>
  );
}
