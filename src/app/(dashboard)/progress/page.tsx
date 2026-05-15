'use client';

import React, { useState, useEffect } from 'react';

// ── Quran Juzz list ──────────────────────────────────────────────
const JUZZ_LIST = Array.from({ length: 30 }, (_, i) => ({ value: i + 1, label: `Juzz ${i + 1}` }));

const SURAH_LIST = [
  'Al-Fatihah','Al-Baqarah','Al-Imran','An-Nisa','Al-Maidah','Al-Anam','Al-Araf','Al-Anfal',
  'At-Tawbah','Yunus','Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf',
  'Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara',
  'An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir',
  'Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan',
  'Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur',
  'An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadila','Al-Hashr','Al-Mumtahanah',
  'As-Saf','Al-Jumuah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam',
  'Al-Haqqah','Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan',
  'Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq',
  'Al-Buruj','At-Tariq','Al-Ala','Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl',
  'Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat',
  'Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Maun','Al-Kawthar',
  'Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas',
];

const RATINGS = [
  { value: 'mumtaz',  label: 'Mumtaz — Excellent' },
  { value: 'jayyid',  label: 'Jayyid — Good' },
  { value: 'maqbool', label: 'Maqbool — Pass' },
  { value: 'rasib',   label: 'Rasib — Fail' },
];

// ── Types ────────────────────────────────────────────────────────
type RecitationStatus = 'complete' | 'incomplete' | 'not_done';
type SelectionType    = 'full_juzz' | 'partial';
type ListenerType     = 'teacher' | 'peer';

interface SectionEntry {
  recitationStatus: RecitationStatus;
  selectionType:    SelectionType;
  juzz:             number[];
  surah:            string;
  from:             string;
  to:               string;
  rating:           string;
  mistakes:         number;
  pauses:           number;
  listenerType:     ListenerType;
  listenerName:     string;
}

const defaultSection = (): SectionEntry => ({
  recitationStatus: 'complete',
  selectionType:    'full_juzz',
  juzz:             [],
  surah:            '',
  from:             '',
  to:               '',
  rating:           '',
  mistakes:         0,
  pauses:           0,
  listenerType:     'teacher',
  listenerName:     '',
});

interface ProgressForm {
  date:     string;
  classId:  string;
  studentId:string;
  sabaq:    SectionEntry;
  sabqi:    SectionEntry;
  manzil:   SectionEntry;
  remarks:  string;
}

// ── Component ────────────────────────────────────────────────────
export default function ProgressPage() {
  const today = new Date().toISOString().split('T')[0];

  const [classes,  setClasses]  = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [entries,  setEntries]  = useState<any[]>([]);

  const [form, setForm] = useState<ProgressForm>({
    date:      today,
    classId:   '',
    studentId: '',
    sabaq:     defaultSection(),
    sabqi:     defaultSection(),
    manzil:    defaultSection(),
    remarks:   '',
  });

  // Load classes
  useEffect(() => {
    fetch('/api/classes')
      .then(r => r.json())
      .then(data => setClasses(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Load students when class changes
  useEffect(() => {
    if (!form.classId) { setStudents([]); return; }
    fetch(`/api/students?classId=${form.classId}`)
      .then(r => r.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [form.classId]);

  const setSection = (key: 'sabaq' | 'sabqi' | 'manzil', patch: Partial<SectionEntry>) =>
    setForm(f => ({ ...f, [key]: { ...f[key], ...patch } }));

  const handleSave = async () => {
    if (!form.studentId) { alert('Please select a student first.'); return; }
    setSaving(true);
    try {
      // Save to DB via API
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date:             form.date,
          studentId:        form.studentId,
          learningType:     'hifz',
          attendanceStatus: 'present',
          teacherRemarks:   form.remarks,
          hifzSabaq:        JSON.stringify(form.sabaq),
          hifzSabqi:        JSON.stringify(form.sabqi),
          hifzManzil:       JSON.stringify(form.manzil),
        }),
      });
      if (res.ok) {
        const student = students.find(s => s.id === form.studentId);
        const cls     = classes.find(c => c.id === form.classId);
        setEntries(prev => [{
          id:          Date.now(),
          studentName: student?.name || '—',
          className:   cls?.name    || '—',
          date:        form.date,
          remarks:     form.remarks,
        }, ...prev]);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setForm(f => ({ ...f, studentId: '', sabaq: defaultSection(), sabqi: defaultSection(), manzil: defaultSection(), remarks: '' }));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || 'Failed to save. Please try again.');
      }
    } catch { alert('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1c3c33]">Daily Progress</h1>
            <p className="text-xs text-[#1c3c33]/50 mt-0.5">Log Sabaq, Sabqi and Manzil for each student</p>
          </div>
          {saved && (
            <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
              ✓ Saved successfully
            </span>
          )}
        </div>

        {/* ── Date / Class / Student row ── */}
        <div className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Date">
              <input type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={inputCls} />
            </Field>
            <Field label="Class">
              <select value={form.classId}
                onChange={e => setForm(f => ({ ...f, classId: e.target.value, studentId: '' }))}
                className={inputCls}>
                <option value="">Select a class…</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Student">
              <select value={form.studentId}
                onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                className={inputCls} disabled={!form.classId}>
                <option value="">Select a student…</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Sections — only show when class AND student are selected ── */}
        {form.classId && form.studentId ? (
          <>
            <ProgressSection
              title="Sabaq"
              subtitle="New Lesson"
              color="green"
              icon="📗"
              data={form.sabaq}
              onChange={p => setSection('sabaq', p)}
              showSelectionType={false}
            />
            <ProgressSection
              title="Sabqi"
              subtitle="Recent Revision"
              color="blue"
              icon="📘"
              data={form.sabqi}
              onChange={p => setSection('sabqi', p)}
              showSelectionType
            />
            <ProgressSection
              title="Manzil"
              subtitle="Overall Revision"
              color="orange"
              icon="📙"
              data={form.manzil}
              onChange={p => setSection('manzil', p)}
              showSelectionType
            />

            {/* ── Teacher Remarks ── */}
            <div className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm p-5 space-y-3">
              <label className="text-xs font-black text-[#1c3c33]/60 uppercase tracking-widest">Teacher Remarks</label>
              <textarea rows={3} value={form.remarks}
                onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                placeholder="Write any observations or notes about today's session…"
                className="w-full rounded-xl border border-[#d0d8cf] bg-[#FDFBF7] px-4 py-3 text-sm text-[#1c3c33] outline-none focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/10 resize-none" />
            </div>

            {/* ── Save button ── */}
            <button onClick={handleSave} disabled={saving}
              className="w-full py-4 bg-[#2F6B4F] text-white rounded-2xl font-black text-sm tracking-wide hover:bg-[#285c44] transition-colors shadow-lg shadow-[#2F6B4F]/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving…' : 'Save Progress'}
            </button>
          </>
        ) : (
          /* ── Placeholder when nothing selected ── */
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[#d0d8cf] text-center gap-3">
            <span className="text-4xl">📋</span>
            <p className="text-sm font-bold text-[#1c3c33]/50">
              Select class and student to get started
            </p>
          </div>
        )}

        {/* ── Recent entries ── */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-black text-[#1c3c33]/60 uppercase tracking-widest">Today's Entries</h2>
            {entries.map(e => (
              <div key={e.id} className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-sm font-black text-[#2F6B4F] shrink-0">
                  {e.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1c3c33] truncate">{e.studentName}</p>
                  <p className="text-xs text-[#1c3c33]/40">{e.className} · {e.date}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Saved</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Component ─────────────────────────────────────────────
function ProgressSection({ title, subtitle, color, icon, data, onChange, showSelectionType }: {
  title: string; subtitle: string; color: 'green' | 'blue' | 'orange';
  icon: string; data: SectionEntry;
  onChange: (p: Partial<SectionEntry>) => void;
  showSelectionType: boolean;
}) {
  const colors = {
    green:  { bg: 'bg-[#E8F5EE]', text: 'text-[#2F6B4F]',  ring: 'focus:ring-[#2F6B4F]/10',  border: 'focus:border-[#2F6B4F]',  active: 'bg-[#2F6B4F] text-white' },
    blue:   { bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]',  ring: 'focus:ring-[#1565C0]/10',  border: 'focus:border-[#1565C0]',  active: 'bg-[#1565C0] text-white' },
    orange: { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]',  ring: 'focus:ring-[#E65100]/10',  border: 'focus:border-[#E65100]',  active: 'bg-[#E65100] text-white' },
  }[color];

  const toggleJuzz = (n: number) => {
    const cur = data.juzz;
    onChange({ juzz: cur.includes(n) ? cur.filter(j => j !== n) : [...cur, n] });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#1c3c33]/6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b border-[#1c3c33]/5 ${colors.bg}`}>
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className={`font-black text-sm ${colors.text}`}>{title}</h2>
          <p className="text-xs text-[#1c3c33]/50">{subtitle}</p>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Recitation Status */}
        <div className="space-y-2">
          <label className={labelCls}>Recitation Status</label>
          <div className="flex gap-2 flex-wrap">
            {(['complete','incomplete','not_done'] as RecitationStatus[]).map(s => (
              <button key={s} type="button"
                onClick={() => onChange({ recitationStatus: s })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  data.recitationStatus === s
                    ? `${colors.active} border-transparent`
                    : 'border-[#d0d8cf] text-[#1c3c33]/60 hover:border-[#1c3c33]/40'
                }`}>
                {s === 'complete' ? 'Complete' : s === 'incomplete' ? 'Incomplete' : 'Not Done'}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Type (Sabqi / Manzil only) */}
        {showSelectionType && (
          <div className="space-y-2">
            <label className={labelCls}>Lesson Selection Type</label>
            <div className="flex gap-2">
              {(['full_juzz','partial'] as SelectionType[]).map(t => (
                <button key={t} type="button"
                  onClick={() => onChange({ selectionType: t })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    data.selectionType === t
                      ? `${colors.active} border-transparent`
                      : 'border-[#d0d8cf] text-[#1c3c33]/60 hover:border-[#1c3c33]/40'
                  }`}>
                  {t === 'full_juzz' ? 'Full Juzz' : 'Partial Selection'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lesson Selection */}
        <div className="space-y-2">
          <label className={labelCls}>Lesson Selection — Select one or more Juzz</label>
          <div className="flex flex-wrap gap-1.5">
            {JUZZ_LIST.map(j => (
              <button key={j.value} type="button"
                onClick={() => toggleJuzz(j.value)}
                className={`w-9 h-9 rounded-lg text-xs font-bold border transition-colors ${
                  data.juzz.includes(j.value)
                    ? `${colors.active} border-transparent`
                    : 'border-[#d0d8cf] text-[#1c3c33]/60 hover:border-[#1c3c33]/40'
                }`}>
                {j.value}
              </button>
            ))}
          </div>
        </div>

        {/* Surah / From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Surah">
            <select value={data.surah} onChange={e => onChange({ surah: e.target.value })} className={inputCls}>
              <option value="">Select Surah…</option>
              {SURAH_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="From (Ayah)">
            <input type="text" placeholder="e.g. 1" value={data.from}
              onChange={e => onChange({ from: e.target.value })} className={inputCls} />
          </Field>
          <Field label="To (Ayah)">
            <input type="text" placeholder="e.g. 20" value={data.to}
              onChange={e => onChange({ to: e.target.value })} className={inputCls} />
          </Field>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className={labelCls}>Lesson Assessment — Rating</label>
          <select value={data.rating} onChange={e => onChange({ rating: e.target.value })} className={inputCls}>
            <option value="">Select a rating…</option>
            {RATINGS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {/* Mistakes & Pauses */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mistakes">
            <Counter value={data.mistakes} onChange={v => onChange({ mistakes: v })} color="text-red-600" />
          </Field>
          <Field label="Pauses">
            <Counter value={data.pauses} onChange={v => onChange({ pauses: v })} color="text-amber-600" />
          </Field>
        </div>

        {/* Listened By */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={labelCls}>Listened By</label>
            <div className="flex gap-2">
              {(['teacher','peer'] as ListenerType[]).map(lt => (
                <button key={lt} type="button"
                  onClick={() => onChange({ listenerType: lt })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    data.listenerType === lt
                      ? `${colors.active} border-transparent`
                      : 'border-[#d0d8cf] text-[#1c3c33]/60 hover:border-[#1c3c33]/40'
                  }`}>
                  {lt === 'teacher' ? 'Teacher' : 'Peer / Student'}
                </button>
              ))}
            </div>
          </div>
          <Field label="Listener's Name">
            <input type="text" placeholder="Enter name…" value={data.listenerName}
              onChange={e => onChange({ listenerName: e.target.value })} className={inputCls} />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────
const inputCls = 'w-full rounded-xl border border-[#d0d8cf] bg-[#FDFBF7] px-3 py-2.5 text-sm text-[#1c3c33] outline-none focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F]/10 transition-colors';
const labelCls = 'text-[10px] font-black text-[#1c3c33]/50 uppercase tracking-widest';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Counter({ value, onChange, color }: { value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="flex items-center border border-[#d0d8cf] rounded-xl overflow-hidden bg-[#FDFBF7]">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="w-10 h-10 flex items-center justify-center text-lg text-[#1c3c33]/40 hover:bg-[#f0f0f0] transition-colors">−</button>
      <span className={`flex-1 text-center font-black text-lg ${color}`}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="w-10 h-10 flex items-center justify-center text-lg text-[#1c3c33]/40 hover:bg-[#f0f0f0] transition-colors">+</button>
    </div>
  );
}
