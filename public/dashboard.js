// dashboard.js

// ---------- STATE & I18N ----------

const State = {
  lang: 'en',
  theme: 'light',
  lastExportKey: 'dashboardLastExport',
  jobs: [],
  glyphs: [],
  uploads: [],
  lastAccuracy: 0,
  lastAiMode: null,
  viewMode: 'grouped', // 'grouped' or 'all'
  currentJob: null,
  originalText: '',
  charMap: [], // [{ index, segment_id, glyph_sample_id, glyph_id, from_letter }]
  isFallbackJob: false,
  _suggestions: [],
};

const I18N = {
  en: {
    "brand.title":"Glyph Intelligence",
    "brand.subtitle":"Adaptive OCR & glyph learning",
    "menu.upload":"Upload glyphs",
    "menu.support":"Contact support",
    "menu.profile":"Profile",
    "menu.settings":"Settings",
    "menu.activity":"Activity",
    "section.uploadTitle":"Upload & translate",
    "section.uploadSub":"Tap or drop anywhere in the box. OCR uses your glyphs, learns from corrections, and respects RTL/LTR.",
    "upload.dropTitle":"Tap anywhere or drop files here",
    "upload.dropSub":"Images or PDFs, multi‑page supported. Camera capture works on mobile.",
    "upload.progressLabel":"OCR progress",
    "upload.progressIdle":"Waiting for upload…",
    "translation.title":"Translation",
    "translation.highlightGlyphs":"Highlight glyph resolve",
    "translation.exportText":"Plain text",
    "translation.exportPdf":"PDF",
    "translation.exportImage":"Image",
    "translation.exportCopy":"Copy to clipboard",
    "translation.exportBtn":"Export",
    "translation.hint":"Edits teach the system: character substitutions, word corrections, and contextual fixes.",
    "glyphs.title":"Glyph library",
    "glyphs.showAll":"Show all",
    "glyphs.suggestionsTitle":"Suggestions & improvements",
    "glyphs.suggestionsSub":"Help the system understand you better.",
    "jobs.title":"Recent OCR jobs",
    "jobs.subtitle":"Reopen jobs to inspect results."
  },
  he: {
    "brand.title":"מודיעין גליפים",
    "brand.subtitle":"OCR מסתגל ולמידת גליפים",
    "menu.upload":"העלאת גליפים",
    "menu.support":"צור קשר",
    "menu.profile":"פרופיל",
    "menu.settings":"הגדרות",
    "menu.activity":"פעילות",
    "section.uploadTitle":"העלאה ותרגום",
    "section.uploadSub":"הקש או גרור לכל מקום בתיבה. ה‑OCR משתמש בגליפים שלך, לומד מהתיקונים ומכבד ימין‑לשמאל.",
    "upload.dropTitle":"הקש בכל מקום או גרור קבצים לכאן",
    "upload.dropSub":"תמונות או PDF, כולל מסמכים מרובי עמודים. מצלמה עובדת במובייל.",
    "upload.progressLabel":"התקדמות OCR",
    "upload.progressIdle":"ממתין להעלאה…",
    "translation.title":"תרגום",
    "translation.highlightGlyphs":"הדגשת פתרון גליפים",
    "translation.exportText":"טקסט רגיל",
    "translation.exportPdf":"PDF",
    "translation.exportImage":"תמונה",
    "translation.exportCopy":"העתקה ללוח",
    "translation.exportBtn":"ייצוא",
    "translation.hint":"עריכות מלמדות את המערכת: החלפת תווים, תיקוני מילים ותיקונים הקשריים.",
    "glyphs.title":"ספריית גליפים",
    "glyphs.showAll":"הצג הכל",
    "glyphs.suggestionsTitle":"הצעות ושיפורים",
    "glyphs.suggestionsSub":"עזור למערכת להבין אותך טוב יותר.",
    "jobs.title":"עבודות OCR אחרונות",
    "jobs.subtitle":"פתח מחדש עבודות כדי לבדוק תוצאות."
  }
};

const $ = id => document.getElementById(id);
const t = key => (I18N[State.lang] && I18N[State.lang][key]) || (I18N.en[key] || key);

// ---------- SNACKBAR ----------

function showSnackbar(msg, ms = 3000){
  const s = $('snackbar');
  if(!s) return;
  s.textContent = msg;
  s.classList.add('show');
  setTimeout(()=>s.classList.remove('show'), ms);
}

// ---------- THEME & LANG ----------

function applyTheme(){
  document.body.classList.toggle('dark', State.theme === 'dark');
  document.body.classList.toggle('light', State.theme !== 'dark');
  localStorage.setItem('dashboardTheme', State.theme);
}

function applyLang(){
  document.body.classList.toggle('rtl', State.lang === 'he');
  document.body.classList.toggle('ltr', State.lang !== 'he');

  const header = $('topbar');
  if(header) header.style.direction = 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(key) el.textContent = t(key);
  });

  const pill = $('langPill');
  if(pill){
    pill.classList.toggle('lang-en', State.lang === 'en');
    pill.classList.toggle('lang-he', State.lang === 'he');
  }

  const meta = $('translateMeta');
  if(meta){
    meta.textContent =
      State.lang === 'he'
        ? 'שפה: עברית. דיוק ה‑OCR יתעדכן לאורך זמן לפי העריכות שלך.'
        : 'Language: English. OCR accuracy over time will update as you edit.';
  }

  const translation = $('translation');
  if(translation){
    translation.style.direction = State.lang === 'he' ? 'rtl' : 'ltr';
    translation.placeholder = State.lang === 'he'
      ? 'תוצאת ה‑OCR תופיע כאן'
      : 'OCR output appears here';
  }

  const glyphSearch = $('glyphSearch');
  if(glyphSearch){
    glyphSearch.placeholder = State.lang === 'he'
      ? 'חיפוש גליפים…'
      : 'Search glyphs…';
  }

  const accLabel = $('accuracyLabel');
  if(accLabel){
    accLabel.textContent = State.lang === 'he'
      ? 'דיוק OCR'
      : 'OCR accuracy';
  }

  renderJobs();
  renderGlyphCounts();
  renderGlyphs();
  renderSuggestions();
  updateViewModeButton();
}

// ---------- PROGRESS & ACCURACY ----------

function setProgress(pct, label){
  const fill = $('progressFill');
  const status = $('progressStatus');
  if(fill) fill.style.width = pct + '%';
  if(status) status.textContent = label || '';
}

function setAccuracy(pct){
  State.lastAccuracy = pct;
  const fill = $('accuracyFill');
  if(fill) fill.style.width = pct + '%';
  const meta = $('translateMeta');
  if(meta){
    meta.textContent =
      State.lang === 'he'
        ? `שפה: עברית. דיוק ה‑OCR לאורך זמן: ${Math.round(pct)}%.`
        : `Language: English. OCR accuracy over time: ${Math.round(pct)}%.`;
  }
}

function updateAiExplain(mode){
  const el = $('aiExplain');
  if(!el) return;
  let text = '';
  switch(mode){
    case 'glyph-first':
      text = State.lang === 'he'
        ? 'ה‑AI השתמש קודם בספריית הגליפים שלך ואז בהקשר (אמון > 75%).'
        : 'AI used your glyph library first, then context (confidence > 75%).';
      break;
    case 'fallback-ocr':
      text = State.lang === 'he'
        ? 'ה‑AI השתמש בצורות OCR רגילות כי אמון הגליפים היה נמוך.'
        : 'AI used regular OCR shapes because glyph confidence was low.';
      break;
    case 'line-restore':
      text = State.lang === 'he'
        ? 'ה‑AI שחזר שורות שהוסרו בתחילה.'
        : 'AI restored lines it initially removed.';
      break;
    case 'guess':
      text = State.lang === 'he'
        ? 'ה‑AI ניחש לפי דפוסים.'
        : 'AI guessed based on patterns.';
      break;
    default:
      text = '';
  }
  el.textContent = text;
}

// ---------- SUPABASE CLIENT ----------

const { supabase, requireAuth, callRpc } = window.supabaseClient;
let CURRENT_USER = null;

// ---------- JOBS: LOAD FROM DB, REOPEN INTO EDITOR ----------

async function loadJobsFromDb(){
  const { data, error } = await supabase
    .from('ocr_jobs')
    .select('*')
    .eq('user_id', CURRENT_USER.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if(error){
    console.error('Error loading jobs', error);
    showSnackbar(State.lang === 'he' ? 'טעינת עבודות נכשלה' : 'Failed to load jobs');
    return;
  }

  State.jobs = data || [];
  renderJobs();
}

function renderJobs(){
  const container = $('jobsList');
  if(!container) return;
  container.innerHTML = '';

  const filtered = State.jobs.filter(j=>!State.lang || j.language === State.lang);
  if(!filtered.length){
    container.innerHTML = State.lang === 'he'
      ? '<div class="sub">אין עבודות OCR לשפה זו עדיין.</div>'
      : '<div class="sub">No OCR jobs yet for this language.</div>';
    return;
  }

  filtered.forEach(job=>{
    const div = document.createElement('div');
    div.className = 'job-card';
    const langLabel = job.language === 'he' ? 'עברית' : 'English';
    const reopenLabel = State.lang === 'he' ? 'פתח מחדש' : 'Reopen';
    const created = job.created_at ? new Date(job.created_at).toLocaleString() : '';
    div.innerHTML = `
      <div>
        <div>${job.title || '(Untitled OCR job)'}</div>
        <div class="sub">${created} • ${langLabel}</div>
      </div>
      <button class="pill reopen" data-id="${job.id}">${reopenLabel}</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.reopen').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      reopenJob(id);
    });
  });
}

async function reopenJob(id){
  const job = State.jobs.find(j=>String(j.id)===String(id));
  if(!job) return;

  State.currentJob = job;
  State.originalText = '';
  State.charMap = [];
  State.isFallbackJob = true;

  const editor = $('translation');
  if(editor) editor.value = '';
  setAccuracy(0);
  updateAiExplain(null);

  try{
    const { data: segments, error } = await supabase
      .from('ocr_segments')
      .select('id, ocr_guess, corrected_char, glyph_sample_id, glyph_id')
      .eq('ocr_job_id', job.id)
      .order('created_at', { ascending: true });

    if(error){
      console.error('Error loading segments', error);
      showSnackbar(State.lang === 'he' ? 'טעינת מקטעים נכשלה' : 'Failed to load segments');
      return;
    }

    buildEditorFromSegments(job, segments || []);
    showSnackbar(State.lang === 'he' ? 'העבודה נטענה לעורך' : 'Job loaded into editor');
  }catch(err){
    console.error('Reopen job error', err);
    showSnackbar(State.lang === 'he' ? 'שגיאה בפתיחת העבודה' : 'Error reopening job');
  }
}

function buildEditorFromSegments(job, segments){
  State.charMap = [];
  State.originalText = '';
  State.isFallbackJob = true;

  let index = 0;

  segments.forEach(seg=>{
    const text = seg.corrected_char || seg.ocr_guess || '';
    for(let i=0;i<text.length;i++){
      const ch = text[i];
      State.originalText += ch;
      State.charMap.push({
        index,
        segment_id: seg.id,
        glyph_sample_id: seg.glyph_sample_id || null,
        glyph_id: seg.glyph_id || null,
        from_letter: ch,
      });
      if(seg.glyph_id){
        State.isFallbackJob = false;
      }
      index++;
    }
  });

  const editor = $('translation');
  const initialText = job.final_text || State.originalText;
  if(editor) editor.value = initialText;

  setAccuracy(80);
  State.lastAiMode = State.isFallbackJob ? 'fallback-ocr' : 'glyph-first';
  updateAiExplain(State.lastAiMode);
}

// ---------- CORRECTION LOGIC (LETTER-BY-LETTER) ----------

function classifyDeltaWeight(fromLetter, toLetter){
  if(!fromLetter || !toLetter || fromLetter === toLetter) return 0;
  const codeDiff = Math.abs(fromLetter.codePointAt(0) - toLetter.codePointAt(0));
  if(codeDiff > 5) return 2; // strong difference → 2
  return 1; // mild difference → 1
}

function buildCorrectionsPayload(originalText, finalText){
  const corrections = [];
  const len = Math.min(originalText.length, finalText.length);

  for(let i=0;i<len;i++){
    const fromCh = originalText[i];
    const toCh = finalText[i];
    if(fromCh === toCh) continue;

    const map = State.charMap[i];
    if(!map) continue;

    const { segment_id, glyph_sample_id, glyph_id } = map;
    if(!glyph_id) continue; // fallback chars: do not touch glyph tables

    const deltaWeight = classifyDeltaWeight(fromCh, toCh);
    if(deltaWeight === 0) continue;

    corrections.push({
      segment_id,
      glyph_sample_id,
      glyph_id,
      from_letter: fromCh,
      to_letter: toCh,
      delta_weight: deltaWeight,
    });
  }

  return corrections;
}

function generateSummary(finalText, correctionsCount){
  const trimmed = finalText.trim();
  const preview = trimmed.length > 140 ? trimmed.slice(0,140) + '…' : trimmed;
  const lines = [];

  if(correctionsCount > 0){
    lines.push(
      State.lang === 'he'
        ? `מכיל ${correctionsCount} תיקוני תווים.`
        : `Contains ${correctionsCount} character-level corrections.`
    );
  }else{
    lines.push(
      State.lang === 'he'
        ? 'אין תיקוני תווים.'
        : 'No character-level corrections detected.'
    );
  }

  if(trimmed.length > 0){
    lines.push(
      (State.lang === 'he' ? 'נושא: ' : 'Subject: ') + preview
    );
  }else{
    lines.push(
      State.lang === 'he'
        ? 'טקסט ריק או קצר מאוד.'
        : 'Empty or very short text.'
    );
  }

  return lines.join(' ');
}

async function handleExportClick(){
  if(!State.currentJob){
    showSnackbar(State.lang === 'he'
      ? 'בחר עבודה לפני ייצוא.'
      : 'Select a job before exporting.');
    return;
  }

  const editor = $('translation');
  const finalText = editor ? (editor.value || '') : '';
  const originalText = State.originalText || '';

  const btn = $('btnExport');
  if(btn) btn.disabled = true;

  try{
    if(State.isFallbackJob){
      // Fallback mode: do NOT touch glyph tables
      if(finalText !== originalText){
        await callRpc('save_fallback_corrections', {
          p_user_id: CURRENT_USER.id,
          p_job_id: State.currentJob.id,
          p_original_text: originalText,
          p_final_text: finalText,
        });
      }

      const summary = generateSummary(finalText, 0);
      await callRpc('save_ocr_export', {
        p_user_id: CURRENT_USER.id,
        p_job_id: State.currentJob.id,
        p_final_text: finalText,
        p_summary: summary,
      });

      showSnackbar(State.lang === 'he'
        ? 'ייצוא נשמר (מצב גיבוי).'
        : 'Export saved (fallback mode).');
    }else{
      // Glyph-aware mode
      const corrections = buildCorrectionsPayload(originalText, finalText);
      const summary = generateSummary(finalText, corrections.length);

      if(corrections.length > 0){
        await callRpc('apply_text_corrections', {
          p_user_id: CURRENT_USER.id,
          p_job_id: State.currentJob.id,
          p_corrections: corrections,
          p_is_fallback: false,
        });
      }

      await callRpc('save_ocr_export', {
        p_user_id: CURRENT_USER.id,
        p_job_id: State.currentJob.id,
        p_final_text: finalText,
        p_summary: summary,
      });

      showSnackbar(State.lang === 'he'
        ? 'ייצוא נשמר ותיקונים הוחלו.'
        : 'Export saved and corrections applied.');
    }

    await loadJobsFromDb();
    await loadSuggestionsFromDb(); // suggestions may change after corrections
  }catch(err){
    console.error('Export error', err);
    showSnackbar(State.lang === 'he'
      ? 'שמירת הייצוא נכשלה.'
      : 'Failed to save export.');
  }finally{
    if(btn) btn.disabled = false;
  }
}

// ---------- GLYPHS & SUGGESTIONS (REAL DATA) ----------

async function loadGlyphsFromDb(){
  const { data, error } = await supabase
    .from('glyphs')
    .select('id, letter, type, confidence, total_usage, language');

  if(error){
    console.error('Error loading glyphs', error);
    showSnackbar(State.lang === 'he' ? 'טעינת גליפים נכשלה' : 'Failed to load glyphs');
    return;
  }

  State.glyphs = (data || []).map(g=>({
    id: g.id,
    letter: g.letter,
    type: g.type,
    confidence: g.confidence,
    usage_count: g.total_usage,
    language: g.language,
  }));

  renderGlyphCounts();
  renderGlyphs();
}

function renderGlyphCounts(){
  const el = $('glyphCounts');
  if(!el) return;
  const filtered = State.glyphs.filter(g=>g.language === State.lang);
  const total = filtered.length;
  if(!total){
    el.textContent = State.lang === 'he'
      ? 'אין גליפים לשפה זו עדיין.'
      : 'No glyphs yet for this language.';
    return;
  }
  el.textContent = '';
}

function updateViewModeButton(){
  const btn = $('viewModeToggle');
  if(!btn) return;
  if(State.viewMode === 'grouped'){
    btn.textContent = State.lang === 'he' ? 'מקובץ' : 'Grouped';
  }else{
    btn.textContent = State.lang === 'he' ? 'הצג הכל' : 'See all';
  }
}

function renderGlyphs(){
  const container = $('glyphGroups');
  if(!container) return;
  container.innerHTML = '';
  const q = ($('glyphSearch')?.value || '').trim().toLowerCase();
  const filtered = State.glyphs.filter(g=>{
    if(g.language !== State.lang) return false;
    if(q && !(g.letter||'').toLowerCase().includes(q)) return false;
    return true;
  });
  if(!filtered.length){
    container.innerHTML = State.lang === 'he'
      ? '<div class="sub">אין גליפים לשפה זו עדיין.</div>'
      : '<div class="sub">No glyphs for this language yet.</div>';
    return;
  }

  if(State.viewMode === 'all'){
    filtered.forEach(g=>{
      const tile = document.createElement('div');
      tile.className = 'glyph-tile';

      const canvasDiv = document.createElement('div');
      canvasDiv.className = 'glyph-canvas';
      canvasDiv.textContent = g.letter || '?';

      const meta = document.createElement('div');
      meta.className = 'glyph-meta';
      const confLabel = State.lang === 'he' ? 'אמינות' : 'Conf';
      const usedLabel = State.lang === 'he' ? 'שימושים' : 'Used';
      meta.innerHTML = `
        <span>${confLabel}: ${Math.round((g.confidence||0)*100)}%</span>
        <span>${usedLabel}: ${g.usage_count||0}</span>
      `;

      const heat = document.createElement('div');
      heat.className = 'heatmap';

      tile.appendChild(canvasDiv);
      tile.appendChild(meta);
      tile.appendChild(heat);

      tile.addEventListener('click', ()=>{
        openGlyphActionsModal(g);
      });

      container.appendChild(tile);
    });
    return;
  }

  const groups = {};
  filtered.forEach(g=>{
    const key = g.letter || '?';
    if(!groups[key]) groups[key] = [];
    groups[key].push(g);
  });

  Object.keys(groups).forEach(letter=>{
    const list = groups[letter];
    const count = list.length;
    const avg = list.reduce((s,g)=>s+(g.confidence||0),0)/count;
    const randomGlyph = list[Math.floor(Math.random()*count)];

    const tile = document.createElement('div');
    tile.className = 'glyph-tile';

    const canvasDiv = document.createElement('div');
    canvasDiv.className = 'glyph-canvas';
    canvasDiv.textContent = randomGlyph.letter || '?';

    const meta = document.createElement('div');
    meta.className = 'glyph-meta';
    const countLabel = State.lang === 'he' ? 'גליפים' : 'glyphs';
    const avgLabel = State.lang === 'he' ? 'ממוצע' : 'Avg';
    meta.innerHTML = `
      <span>${letter} • ${count} ${countLabel}</span>
      <span>${avgLabel}: ${Math.round(avg*100)}%</span>
    `;

    const heat = document.createElement('div');
    heat.className = 'heatmap';

    tile.appendChild(canvasDiv);
    tile.appendChild(meta);
    tile.appendChild(heat);

    tile.addEventListener('click', ()=>{
      openGroupedLetterModal(letter, list);
    });

    container.appendChild(tile);
  });
}

function openGlyphActionsModal(g){
  openModal(
    State.lang === 'he' ? 'פעולות גליף' : 'Glyph actions',
    `
      <p>${State.lang === 'he' ? 'מזהה גליף' : 'Glyph ID'}: ${g.id}</p>
      <p>${State.lang === 'he' ? 'אות' : 'Letter'}: ${g.letter}</p>
      <p>${State.lang === 'he' ? 'סוג' : 'Type'}: ${g.type}</p>
      <p>${State.lang === 'he' ? 'שפה' : 'Language'}: ${g.language}</p>
    `
  );
}

function openGroupedLetterModal(letter, list){
  const count = list.length;
  const avg = list.reduce((s,g)=>s+(g.confidence||0),0)/count;
  const title = State.lang === 'he' ? 'גליפים לאות' : 'Glyphs for letter';

  const countLabel = State.lang === 'he' ? 'מספר גליפים' : 'Total glyphs';
  const avgLabel = State.lang === 'he' ? 'דיוק ממוצע' : 'Average accuracy';

  let html = `
    <div class="modal-sticky-header">
      <h5>${title}: ${letter}</h5>
      <div class="sub">
        ${countLabel}: ${count} • ${avgLabel}: ${Math.round(avg*100)}%
      </div>
    </div>
    <div class="modal-glyph-list">
  `;

  list.forEach(g=>{
    const conf = Math.round((g.confidence||0)*100);
    const accLabel = State.lang === 'he' ? 'דיוק' : 'Accuracy';
    const idLabel = State.lang === 'he' ? 'מזהה' : 'ID';
    html += `
      <div class="modal-glyph-item">
        <div class="modal-glyph-left">
          <div class="modal-glyph-canvas">${g.letter || '?'}</div>
          <div class="modal-glyph-meta">
            <div>${idLabel}: ${g.id}</div>
            <div>${accLabel}: ${conf}%</div>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';

  openModal(`${title}: ${letter}`, html);
}

// ---------- SUGGESTIONS: FROM glyph_suggestions VIEW + PENDING COUNT ----------

async function loadSuggestionsFromDb(){
  const container = $('suggestionsList');
  if(!container) return;
  container.innerHTML = '';

  const { data, error } = await supabase
    .from('glyph_suggestions')
    .select('*')
    .eq('user_id', CURRENT_USER.id);

  if(error){
    console.error('Error loading suggestions', error);
    container.innerHTML = '<div class="sub">Failed to load suggestions.</div>';
    return;
  }

  State._suggestions = data || [];
  renderSuggestions();
}

function renderSuggestions(){
  const container = $('suggestionsList');
  const badge = $('suggestBadge');
  if(!container) return;

  const list = (State._suggestions || []).filter(s => true);

  // Pending suggestions count in badge
  if(badge){
    if(list.length > 0){
      badge.textContent = list.length;
      badge.style.display = 'inline-block';
    } else {
      badge.textContent = '';
      badge.style.display = 'none';
    }
  }

  container.innerHTML = '';

  if(!list.length){
    container.innerHTML = State.lang === 'he'
      ? '<div class="sub">אין הצעות כרגע.</div>'
      : '<div class="sub">No suggestions at the moment.</div>';
    return;
  }

  list.forEach(s=>{
    const row = document.createElement('div');
    row.className = 'suggestion-row';
    const title = State.lang === 'he'
      ? `גליף ${s.letter || '?'}`
      : `Glyph ${s.letter || '?'}`;
    row.textContent = title;

    const expanded = document.createElement('div');
    expanded.className = 'suggestion-expanded';
    const bodyText = State.lang === 'he'
      ? 'גליף זה דורש תשומת לב לפי תיקונים ודיוק.'
      : 'This glyph needs attention based on corrections and accuracy.';
    expanded.innerHTML = `
      <div class="suggestion-canvas">${s.letter || '?'}</div>
      <div>${bodyText}</div>
      <div class="actions"></div>
    `;

    const actions = expanded.querySelector('.actions');
    const actionsList = State.lang === 'he'
      ? ['בדוק מאוחר יותר','סמן כטופל']
      : ['Review later','Mark as handled'];

    actionsList.forEach(a=>{
      const btn = document.createElement('button');
      btn.className = 'pill';
      btn.textContent = a;
      btn.addEventListener('click', ()=> showSnackbar(`"${a}" ${State.lang === 'he' ? 'הוחל (דמו)' : 'applied (demo)'}`));
      actions.appendChild(btn);
    });

    container.appendChild(row);
    container.appendChild(expanded);
  });
}

// ---------- MODAL ----------

function openModal(title, html){
  const overlay = $('modalOverlay');
  const titleEl = $('modalTitle');
  const bodyEl = $('modalBody');
  if(!overlay || !titleEl || !bodyEl) return;
  titleEl.textContent = title;
  bodyEl.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
}
function closeModal(){
  const overlay = $('modalOverlay');
  if(!overlay) return;
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
}

// ---------- UPLOAD (SIMULATED) ----------

function setupUpload(){
  const drop = $('dropZone');
  const fileInput = $('fileInput');
  if(!drop || !fileInput) return;

  drop.addEventListener('click', ()=> fileInput.click());
  drop.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      fileInput.click();
    }
  });

  drop.addEventListener('dragover', e=>{
    e.preventDefault();
    drop.classList.add('drag-over');
  });
  drop.addEventListener('dragleave', e=>{
    e.preventDefault();
    drop.classList.remove('drag-over');
  });
  drop.addEventListener('drop', e=>{
    e.preventDefault();
    drop.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files||[]);
    if(files.length) simulateUpload(files[0]);
  });

  fileInput.addEventListener('change', ()=>{
    const files = Array.from(fileInput.files||[]);
    if(files.length) simulateUpload(files[0]);
  });
}

function renderUploadThumbs(){
  const container = $('uploadThumbs');
  if(!container) return;
  container.innerHTML = '';
  State.uploads.forEach(u=>{
    const div = document.createElement('div');
    div.className = 'upload-thumb';
    const canvas = document.createElement('canvas');
    canvas.width = 80; canvas.height = 80;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,80,80);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#a855f7');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,80,80);
    ctx.fillStyle = '#f9fafb';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(u.shortName, 40, 40);
    div.appendChild(canvas);

    const label = document.createElement('div');
    label.className = 'upload-thumb-label';
    label.textContent = u.shortName;
    div.appendChild(label);

    container.appendChild(div);
  });
}

function simulateUpload(file){
  setProgress(5, State.lang === 'he' ? 'מעלה קובץ…' : 'Uploading file…');
  const editor = $('translation');
  const aiExplain = $('aiExplain');
  if(editor) editor.value = '';
  if(aiExplain) aiExplain.textContent = '';
  setAccuracy(0);

  const shortName = (file.name || 'Upload').slice(0,10);
  State.uploads.unshift({ name:file.name, shortName });
  renderUploadThumbs();

  let pct = 5;
  const modes = ['glyph-first','fallback-ocr','line-restore','guess'];
  const chosenMode = modes[Math.floor(Math.random()*modes.length)];
  State.lastAiMode = chosenMode;

  const timer = setInterval(async ()=>{
    pct += 15;
    if(pct >= 100){
      pct = 100;
      clearInterval(timer);
      setProgress(100, State.lang === 'he' ? 'OCR הושלם.' : 'OCR complete.');

      if(editor){
        editor.value =
          `Demo OCR result (${State.lang === 'he' ? 'Hebrew' : 'English'}) for: ${file.name}\n\nThis is placeholder text showing how the translation area will be filled.`;
      }

      setAccuracy(80 + Math.random()*15);
      updateAiExplain(chosenMode);

      try{
        const { data, error } = await supabase
          .from('ocr_jobs')
          .insert({
            user_id: CURRENT_USER.id,
            title: file.name.replace(/\.[^/.]+$/,'') || 'Uploaded document',
            language: State.lang,
            raw_text: editor ? editor.value : '',
          })
          .select()
          .single();
        if(!error && data){
          State.jobs.unshift(data);
          renderJobs();
        }
      }catch(e){
        console.warn('Could not create demo job', e);
      }
    }else{
      setProgress(pct, State.lang === 'he'
        ? 'מעבד עם AI וגליפים…'
        : 'Processing with AI and glyphs…');
    }
  }, 350);
}

// ---------- UI SETUP ----------

function setupUI(){
  const hamburger = $('hamburger');
  if(hamburger){
    hamburger.addEventListener('click', ()=>{
      hamburger.classList.toggle('open');
      const open = hamburger.classList.contains('open');
      const drawer = $('drawer');
      if(drawer){
        drawer.classList.toggle('open', open);
        drawer.setAttribute('aria-hidden', !open);
      }
    });
  }

  const pill = $('langPill');
  if(pill){
    pill.addEventListener('click', ()=>{
      State.lang = State.lang === 'en' ? 'he' : 'en';
      localStorage.setItem('dashboardLang', State.lang);
      applyLang();
    });
    pill.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        State.lang = State.lang === 'en' ? 'he' : 'en';
        localStorage.setItem('dashboardLang', State.lang);
        applyLang();
      }
    });
  }

  const themeToggle = $('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      State.theme = State.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
    });
  }

  const modalClose = $('modalClose');
  const modalOverlay = $('modalOverlay');
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalOverlay){
    modalOverlay.addEventListener('click', e=>{
      if(e.target === modalOverlay) closeModal();
    });
  }

  const btnExport = $('btnExport');
  if(btnExport) btnExport.addEventListener('click', handleExportClick);

  const glyphSearch = $('glyphSearch');
  if(glyphSearch) glyphSearch.addEventListener('input', renderGlyphs);

  const viewModeToggle = $('viewModeToggle');
  if(viewModeToggle){
    viewModeToggle.addEventListener('click', ()=>{
      State.viewMode = State.viewMode === 'grouped' ? 'all' : 'grouped';
      updateViewModeButton();
      renderGlyphs();
    });
  }

  const glyphStatsBtn = $('glyphStatsBtn');
  if(glyphStatsBtn){
    glyphStatsBtn.addEventListener('click', ()=>{
      const filtered = State.glyphs.filter(g=>g.language === State.lang);
      const total = filtered.length;
      const byType = ['letter','number','symbol'].map(type=>{
        const list = filtered.filter(g=>g.type===type);
        const count = list.length;
        const avg = count ? (list.reduce((s,g)=>s+(g.confidence||0),0)/count) : 0;
        return { type, count, avg };
      });
      let html = `<p>${State.lang === 'he'
        ? 'סך כל הגליפים'
        : 'Total glyphs'} (${State.lang === 'he' ? 'עברית' : 'English'}): ${total}</p><ul>`;
      byType.forEach(ti=>{
        const label = State.lang === 'he'
          ? (ti.type === 'letter' ? 'אותיות' : ti.type === 'number' ? 'מספרים' : 'סימנים')
          : ti.type;
        html += `<li>${label}: ${ti.count} (avg confidence ${Math.round(ti.avg*100)}%)</li>`;
      });
      html += '</ul>';
      openModal(State.lang === 'he' ? 'סטטיסטיקת גליפים' : 'Glyph statistics', html);
    });
  }

  const toggleGlyphHighlight = $('toggleGlyphHighlight');
  if(toggleGlyphHighlight){
    toggleGlyphHighlight.addEventListener('click', ()=> showSnackbar(State.lang === 'he'
      ? 'הדגשת גליפים (דמו).'
      : 'Glyph highlight toggle (demo).'));
  }

  const suggestToggle = $('suggestToggle');
  const suggestionsList = $('suggestionsList');
  if(suggestToggle && suggestionsList){
    suggestToggle.addEventListener('click', ()=>{
      const isExpanded = suggestionsList.classList.contains('expanded');
      suggestionsList.classList.toggle('expanded', !isExpanded);
      suggestToggle.classList.toggle('open', !isExpanded);
    });
  }

  setupUpload();
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', async ()=>{
  const savedTheme = localStorage.getItem('dashboardTheme');
  if(savedTheme === 'dark' || savedTheme === 'light') State.theme = savedTheme;
  const savedLang = localStorage.getItem('dashboardLang');
  if(savedLang === 'en' || savedLang === 'he') State.lang = savedLang;

  applyTheme();
  applyLang();

  CURRENT_USER = await requireAuth();
  if(!CURRENT_USER) return;

  await loadJobsFromDb();
  await loadGlyphsFromDb();
  await loadSuggestionsFromDb();

  setupUI();
});