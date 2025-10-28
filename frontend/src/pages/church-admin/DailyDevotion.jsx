// DailyDevotion.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/church-admin/AdminSidebar";
import AdminHeader from "../../components/church-admin/AdminHeader";
import { useDailyRandomVerse } from "../../lib/useDailyRandomVerse";
import { useReflectionPrompts } from "../../lib/reflectionPrompts";

const Icon = ({ file, className = "h-4 w-4", alt = "" }) => (
  <img src={`/src/assets/icons/${file}.svg`} alt={alt || file} className={className} draggable="false" />
);
const Img = ({ file, className = "w-full h-full object-cover", alt = "" }) => (
  <img src={`/src/assets/images/${file}`} alt={alt || file} className={className} draggable="false" />
);

export default function DailyDevotion() {
  // alias loading so it doesn't clash with prompts loading
  const { text, reference, translation, loading: verseLoading, error } = useDailyRandomVerse();

  // get churchId once
  const [churchId, setChurchId] = useState(null);
  useEffect(() => {
    const base = import.meta.env?.VITE_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${base}/api/members/me/church`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setChurchId(data?.church?.id || null);
      } catch (e) {
        console.error("Failed to load churchId", e);
        setChurchId(null);
      }
    })();
  }, []);

  // prompts hook (now syntactically complete + passed churchId)
const { prompts } = useReflectionPrompts();

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
                {verseLoading ? "Loading verse..." : error ? "Could not load verse." : `“${text}”`}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {verseLoading || error ? "" : `— ${reference} (${translation})`}
              </p>
            </div>
          </section>

          {/* Reflection Prompts */}
          <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 relative">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900">Reflection Prompts</h3>
            <p className="text-sm text-slate-500 mt-1">Take a moment to reflect on today&apos;s message.</p>

            {promptsLoading  ? (
              <div className="mt-4 text-slate-500">Loading…</div>
            ) : (
              <div className="mt-4 space-y-4">
                <ol className="mt-4 list-decimal list-inside space-y-3 text-[15px] text-slate-800">
  {prompts.map((q, i) => (
    <li key={i}>{q}</li>
  ))}
</ol>
<p className="mt-2 text-sm text-slate-500">No need to type—just reflect quietly.</p>
                <button type="button" onClick={add} className="rounded-md bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200">
                  + Add prompt
                </button>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={discard}
                className="rounded-md bg-[#D33131] text-white px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                disabled={!dirty || !churchId}
              >
                Discard
              </button>
              <button
                onClick={save}
                className="rounded-md bg-[#20A04C] text-white px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                disabled={!dirty || !churchId}
              >
                Save changes
              </button>
              {!dirty && <span className="text-xs text-slate-500">All changes saved for today.</span>}
            </div>
          </section>

          <button type="button" className="fixed right-6 bottom-24 md:bottom-20 h-12 w-12 rounded-full shadow-md bg-white border border-slate-200 overflow-hidden" aria-label="Helper">
            <Img file="avatar.jpg" />
          </button>
        </div>
      </main>
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
