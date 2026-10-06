import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import './style.css';

const MAX_FILES = 30;
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

const I18N = {
  en: {
    app: 'Tender Package Builder', subtitle: 'Check, match and generate a submission-ready PDF package',
    loadReq: 'Load requirements.json', choosePdf: 'Upload PDF files', tender: 'Tender details',
    requirements: 'Required documents', files: 'Uploaded files', status: 'Status', file: 'File',
    pages: 'Pages', expiry: 'Expiry date', match: 'Match to document', actions: 'Actions', remove: 'Remove',
    undo: 'Undo match', noMatch: 'Unmatched', generate: 'Generate package', download: 'Download package',
    exportCsv: 'Export checklist CSV', clear: 'Clear workspace', language: 'বাংলা', included: 'Included documents',
    ready: 'Ready to generate', blocked: 'Package blocked', missing: 'Missing', expiryNeeded: 'Expiry date needed',
    expired: 'Expired', notProvided: 'Not provided', ok: 'OK', mandatory: 'Required', optional: 'Optional',
    hasExpiry: 'Expiry check', yes: 'Yes', no: 'No', id: 'ID', order: 'Order', title: 'Document',
    bidder: 'Bidder', entity: 'Procuring entity', deadline: 'Submission deadline', packageDate: 'Package date',
    cover: 'Cover', index: 'Index', duplicate: 'Exact duplicate', duplicateBlocked: 'This exact duplicate is already matched to another document.',
    loaded: 'Requirements loaded successfully.', invalidReq: 'Please select a valid requirements.json file.',
    pdfOnly: 'Only PDF files are accepted.', tooMany: 'Maximum 30 PDFs allowed.', tooLarge: 'Total PDF size cannot exceed 50 MB.',
    badPdf: 'Could not read this PDF. It may be damaged or password-protected.',
    noReq: 'Load requirements.json first.', noFiles: 'Upload the tender PDFs to begin matching.',
    allClear: 'All blocking checks are clear. You can generate the package.',
    whyBlocked: 'Resolve these blocking items before generating:',
    generated: 'Package generated successfully.', demo: 'Demo status view',
    demoHint: 'This demo is only for the contest screenshot. Load your own requirements.json and PDFs for real processing.',
    start: 'Start by loading the tender requirements.',
    choose: 'Choose', matched: 'Matched',
  },
  bn: {
    app: 'টেন্ডার প্যাকেজ বিল্ডার', subtitle: 'ডকুমেন্ট যাচাই, ম্যাচ এবং একত্র করে সাবমিশন প্যাকেজ তৈরি করুন',
    loadReq: 'requirements.json লোড করুন', choosePdf: 'PDF ফাইল আপলোড করুন', tender: 'টেন্ডারের তথ্য',
    requirements: 'প্রয়োজনীয় ডকুমেন্ট', files: 'আপলোড করা ফাইল', status: 'স্ট্যাটাস', file: 'ফাইল',
    pages: 'পৃষ্ঠা', expiry: 'মেয়াদ শেষের তারিখ', match: 'ডকুমেন্টের সাথে ম্যাচ', actions: 'অ্যাকশন', remove: 'সরান',
    undo: 'ম্যাচ বাতিল', noMatch: 'ম্যাচ নেই', generate: 'প্যাকেজ তৈরি করুন', download: 'প্যাকেজ ডাউনলোড',
    exportCsv: 'চেকলিস্ট CSV', clear: 'ওয়ার্কস্পেস পরিষ্কার', language: 'English', included: 'অন্তর্ভুক্ত ডকুমেন্ট',
    ready: 'তৈরি করার জন্য প্রস্তুত', blocked: 'প্যাকেজ ব্লকড', missing: 'অনুপস্থিত', expiryNeeded: 'মেয়াদ শেষের তারিখ প্রয়োজন',
    expired: 'মেয়াদ শেষ', notProvided: 'দেওয়া হয়নি', ok: 'ঠিক আছে', mandatory: 'আবশ্যিক', optional: 'ঐচ্ছিক',
    hasExpiry: 'মেয়াদ যাচাই', yes: 'হ্যাঁ', no: 'না', id: 'আইডি', order: 'ক্রম', title: 'ডকুমেন্ট',
    bidder: 'বিডার', entity: 'প্রকিউরিং প্রতিষ্ঠান', deadline: 'সাবমিশন ডেডলাইন', packageDate: 'প্যাকেজ তৈরির তারিখ',
    cover: 'কভার', index: 'সূচিপত্র', duplicate: 'একই কনটেন্ট', duplicateBlocked: 'এই একই কনটেন্টের অন্য ফাইল ইতিমধ্যে অন্য ডকুমেন্টে ম্যাচ করা আছে।',
    loaded: 'Requirements সফলভাবে লোড হয়েছে।', invalidReq: 'সঠিক requirements.json ফাইল নির্বাচন করুন।',
    pdfOnly: 'শুধুমাত্র PDF ফাইল গ্রহণ করা হয়।', tooMany: 'সর্বোচ্চ ৩০টি PDF আপলোড করা যাবে।', tooLarge: 'মোট PDF সাইজ ৫০ MB-এর বেশি হতে পারবে না।',
    badPdf: 'এই PDF পড়া যায়নি। ফাইলটি নষ্ট বা পাসওয়ার্ড-সুরক্ষিত হতে পারে।',
    noReq: 'আগে requirements.json লোড করুন।', noFiles: 'ম্যাচিং শুরু করতে টেন্ডারের PDF আপলোড করুন।',
    allClear: 'সব blocking সমস্যা সমাধান হয়েছে। এখন প্যাকেজ তৈরি করতে পারবেন।',
    whyBlocked: 'প্যাকেজ তৈরি করার আগে এগুলো ঠিক করুন:',
    generated: 'প্যাকেজ সফলভাবে তৈরি হয়েছে।', demo: 'ডেমো স্ট্যাটাস ভিউ',
    demoHint: 'এই ডেমো শুধু কনটেস্ট স্ক্রিনশটের জন্য। বাস্তব কাজের জন্য নিজের requirements.json ও PDF আপলোড করুন।',
    start: 'প্রথমে টেন্ডারের requirements লোড করুন।', choose: 'নির্বাচন', matched: 'ম্যাচ হয়েছে',
  }
};

const state = {
  lang: 'en',
  tender: null,
  requirements: [],
  files: [],
  message: '',
  messageType: 'info',
  generating: false,
  demo: false,
};

const $ = (s) => document.querySelector(s);
const t = (key) => I18N[state.lang][key] ?? key;

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(state.lang === 'bn' ? 'bn-BD' : 'en-GB', {day:'2-digit', month:'short', year:'numeric'});
}

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0,10);
}

function showMessage(message, type='info') {
  state.message = message;
  state.messageType = type;
  render();
}

async function sha256(buffer) {
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
}

function getDuplicateGroup(file) {
  if (!file.hash) return [];
  return state.files.filter(f => f.hash && f.hash === file.hash);
}

function isDuplicateConflict(file) {
  const group = getDuplicateGroup(file);
  const otherMatched = group.find(f => f.id !== file.id && f.matchId);
  return Boolean(otherMatched);
}

function getStatus(req) {
  const file = state.files.find(f => f.matchId === req.id);
  if (!file) return req.mandatory ? {key:'missing', blocking:true} : {key:'notProvided', blocking:false};
  if (req.has_expiry && !file.expiry) return {key:'expiryNeeded', blocking:true};
  if (req.has_expiry && file.expiry && file.expiry < state.tender.submission_deadline) return {key:'expired', blocking:true};
  return {key:'ok', blocking:false};
}

function statusLabel(status) { return t(status.key); }

function render() {
  const root = $('#app');
  const reqCount = state.requirements.length;
  const blocking = state.requirements.map(getStatus).filter(s => s.blocking).length;
  const matched = state.files.filter(f => f.matchId).length;
  const totalSize = state.files.reduce((sum,f)=>sum+f.size,0);

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand-wrap">
          <div class="brand-mark">TP</div>
          <div><h1>${t('app')}</h1><p>${t('subtitle')}</p></div>
        </div>
        <div class="top-actions">
          <button class="btn btn-ghost" id="langBtn">${t('language')}</button>
          <button class="btn btn-ghost" id="clearBtn">${t('clear')}</button>
        </div>
      </header>

      ${state.message ? `<div class="toast ${state.messageType}">${escapeHtml(state.message)}</div>` : ''}

      <main>
        <section class="hero-card">
          <div>
            <span class="eyebrow">AI DEVFEST · TENDER WORKFLOW</span>
            <h2>${state.tender ? escapeHtml(state.tender.title) : t('start')}</h2>
            <p>${state.tender ? `${escapeHtml(state.tender.tender_id)} · ${formatDate(state.tender.submission_deadline)}` : 'Frontend-only document validation and package generation.'}</p>
          </div>
          <div class="hero-actions">
            <label class="btn btn-primary file-btn">${t('loadReq')}<input type="file" id="reqInput" accept="application/json,.json" hidden></label>
            <label class="btn btn-secondary file-btn ${!state.tender ? 'disabled' : ''}">${t('choosePdf')}<input type="file" id="pdfInput" accept="application/pdf,.pdf" multiple hidden ${!state.tender ? 'disabled' : ''}></label>
          </div>
        </section>

        ${state.demo ? `<div class="demo-banner"><strong>${t('demo')}</strong> — ${t('demoHint')}</div>` : ''}

        ${state.tender ? renderTender() : ''}
        ${state.tender ? renderRequirements(blocking) : ''}
        ${state.tender ? renderFiles(matched, totalSize) : ''}
        ${state.tender ? renderGenerate(blocking) : ''}
      </main>

      <footer>Frontend-only · PDF processing stays in your browser · No participant backend</footer>
    </div>`;

  bindEvents();
}

function renderTender() {
  const d = state.tender;
  return `<section class="panel tender-panel">
    <div class="section-heading"><div><span class="eyebrow">01</span><h3>${t('tender')}</h3></div><span class="pill pill-blue">${escapeHtml(d.tender_id)}</span></div>
    <div class="tender-grid">
      <div><span>${t('title')}</span><strong>${escapeHtml(d.title)}</strong></div>
      <div><span>${t('entity')}</span><strong>${escapeHtml(d.procuring_entity)}</strong></div>
      <div><span>${t('bidder')}</span><strong>${escapeHtml(d.bidder)}</strong></div>
      <div><span>${t('deadline')}</span><strong>${formatDate(d.submission_deadline)}</strong></div>
    </div>
  </section>`;
}

function renderRequirements(blocking) {
  return `<section class="panel">
    <div class="section-heading"><div><span class="eyebrow">02</span><h3>${t('requirements')}</h3></div><span class="count-badge">${state.requirements.length}</span></div>
    <div class="status-summary ${blocking ? 'has-blockers' : 'clear'}">
      <div><span class="summary-dot"></span><strong>${blocking ? t('blocked') : t('ready')}</strong><span>${blocking ? `${blocking} ${blocking === 1 ? 'item' : 'items'}` : t('allClear')}</span></div>
      <div class="summary-progress"><span style="width:${state.requirements.length ? Math.round((state.requirements.length-blocking)/state.requirements.length*100) : 0}%"></span></div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>${t('order')}</th><th>${t('id')}</th><th>${t('title')}</th><th>${t('mandatory')}</th><th>${t('hasExpiry')}</th><th>${t('file')}</th><th>${t('expiry')}</th><th>${t('status')}</th></tr></thead>
      <tbody>${state.requirements.map(req => renderRequirementRow(req)).join('')}</tbody>
    </table></div>
  </section>`;
}

function renderRequirementRow(req) {
  const file = state.files.find(f => f.matchId === req.id);
  const s = getStatus(req);
  return `<tr class="${s.blocking ? 'row-blocked' : ''}">
    <td><span class="order-chip">${req.order}</span></td>
    <td><code>${escapeHtml(req.id)}</code></td>
    <td><div class="doc-title"><strong>${escapeHtml(state.lang === 'bn' ? req.title_bn : req.title_en)}</strong><small>${escapeHtml(req.title_en)}</small></div></td>
    <td>${req.mandatory ? `<span class="tag required">${t('mandatory')}</span>` : `<span class="tag optional">${t('optional')}</span>`}</td>
    <td>${req.has_expiry ? t('yes') : t('no')}</td>
    <td>${file ? `<div class="matched-file"><strong>${escapeHtml(file.name)}</strong><small>${file.pages} ${t('pages')}</small></div>` : `<span class="muted">—</span>`}</td>
    <td>${file && req.has_expiry ? `<input class="expiry-input" data-file-id="${file.id}" type="date" value="${file.expiry || ''}" min="1900-01-01">` : '<span class="muted">—</span>'}</td>
    <td><span class="status ${s.key}">${statusLabel(s)}</span></td>
  </tr>`;
}

function renderFiles(matched, totalSize) {
  return `<section class="panel">
    <div class="section-heading"><div><span class="eyebrow">03</span><h3>${t('files')}</h3></div><span class="count-badge">${state.files.length}/30</span></div>
    <div class="file-meta"><span>${matched} ${t('matched')}</span><span>${formatBytes(totalSize)} / 50 MB</span></div>
    ${state.files.length === 0 ? `<div class="empty-state"><div class="empty-icon">PDF</div><strong>${t('noFiles')}</strong></div>` : ''}
    <div class="file-list">${state.files.map(renderFileRow).join('')}</div>
  </section>`;
}

function renderFileRow(file) {
  const matchedReq = state.requirements.find(r => r.id === file.matchId);
  const duplicateGroup = getDuplicateGroup(file);
  const duplicate = duplicateGroup.length > 1;
  const conflict = isDuplicateConflict(file);
  const usedReqIds = new Set(state.files.filter(f=>f.id!==file.id && f.matchId).map(f=>f.matchId));
  const options = state.requirements.map(req => {
    const disabled = usedReqIds.has(req.id) || (duplicate && conflict && file.matchId !== req.id);
    return `<option value="${escapeHtml(req.id)}" ${file.matchId===req.id?'selected':''} ${disabled?'disabled':''}>${req.order}. ${escapeHtml(state.lang==='bn'?req.title_bn:req.title_en)}</option>`;
  }).join('');
  return `<div class="file-card ${duplicate ? 'is-duplicate' : ''}">
    <div class="file-main">
      <div class="pdf-icon">PDF</div>
      <div class="file-name"><strong title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</strong><span>${file.pages} ${t('pages')} · ${formatBytes(file.size)}</span></div>
      ${duplicate ? `<span class="duplicate-badge">${t('duplicate')}</span>` : ''}
    </div>
    <div class="file-controls">
      <select class="match-select" data-file-id="${file.id}">
        <option value="">${t('noMatch')}</option>${options}
      </select>
      ${matchedReq && matchedReq.has_expiry ? `<input class="expiry-input" data-file-id="${file.id}" type="date" value="${file.expiry || ''}" aria-label="${t('expiry')}">` : ''}
      <button class="icon-btn remove-file" data-file-id="${file.id}" title="${t('remove')}">×</button>
    </div>
    ${conflict ? `<div class="inline-warning">${t('duplicateBlocked')}</div>` : ''}
  </div>`;
}

function renderGenerate(blocking) {
  return `<section class="generate-panel">
    <div><span class="eyebrow">04 · FINAL PACKAGE</span><h3>${blocking ? t('whyBlocked') : t('allClear')}</h3>
      ${blocking ? `<ul class="block-list">${state.requirements.filter(getStatus).map(req=>({req,s:getStatus(req)})).filter(x=>x.s.blocking).map(x=>`<li><strong>${escapeHtml(x.req.id)}</strong> — ${escapeHtml(state.lang==='bn'?x.req.title_bn:x.req.title_en)}: ${statusLabel(x.s)}</li>`).join('')}</ul>` : '<p>Cover + index + documents + page footers will be assembled in order.</p>'}
    </div>
    <div class="generate-actions">
      <button class="btn btn-ghost" id="csvBtn">${t('exportCsv')}</button>
      <button class="btn btn-primary big" id="generateBtn" ${blocking || state.generating ? 'disabled' : ''}>${state.generating ? 'Generating…' : t('generate')}</button>
    </div>
  </section>`;
}

function bindEvents() {
  $('#langBtn')?.addEventListener('click', () => { state.lang = state.lang === 'en' ? 'bn' : 'en'; render(); });
  $('#clearBtn')?.addEventListener('click', () => { if(confirm(state.lang==='bn'?'সব ডেটা মুছে ফেলবেন?':'Clear all workspace data?')) { state.tender=null; state.requirements=[]; state.files=[]; state.message=''; render(); }});
  $('#reqInput')?.addEventListener('change', e => loadRequirements(e.target.files?.[0]));
  $('#pdfInput')?.addEventListener('change', e => addPdfFiles([...e.target.files]));
  document.querySelectorAll('.remove-file').forEach(btn => btn.addEventListener('click', () => removeFile(btn.dataset.fileId)));
  document.querySelectorAll('.match-select').forEach(sel => sel.addEventListener('change', () => matchFile(sel.dataset.fileId, sel.value)));
  document.querySelectorAll('.expiry-input').forEach(inp => inp.addEventListener('change', () => setExpiry(inp.dataset.fileId, inp.value)));
  $('#generateBtn')?.addEventListener('click', generatePackage);
  $('#csvBtn')?.addEventListener('click', exportCSV);
}

async function loadRequirements(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.tender || !Array.isArray(data.requirements) || !data.tender.submission_deadline) throw new Error('invalid');
    state.tender = data.tender;
    state.requirements = data.requirements.slice().sort((a,b)=>Number(a.order)-Number(b.order));
    state.files = [];
    showMessage(t('loaded'), 'success');
  } catch {
    showMessage(t('invalidReq'), 'error');
  }
}

async function addPdfFiles(files) {
  if (!state.tender) return showMessage(t('noReq'), 'error');
  if (state.files.length + files.length > MAX_FILES) return showMessage(t('tooMany'), 'error');
  const currentSize = state.files.reduce((s,f)=>s+f.size,0);
  const incomingSize = files.reduce((s,f)=>s+f.size,0);
  if (currentSize + incomingSize > MAX_TOTAL_BYTES) return showMessage(t('tooLarge'), 'error');
  for (const file of files) {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) { state.message = `${file.name}: ${t('pdfOnly')}`; state.messageType='error'; continue; }
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: false });
      const pages = pdf.getPageCount();
      const hash = await sha256(buffer);
      state.files.push({ id: crypto.randomUUID(), name:file.name, size:file.size, pages, hash, buffer, matchId:'', expiry:'' });
      state.message = `${file.name}: ${pages} ${t('pages')}`; state.messageType='success';
    } catch {
      state.message = `${file.name}: ${t('badPdf')}`; state.messageType='error';
    }
  }
  render();
}

function removeFile(id) {
  state.files = state.files.filter(f => f.id !== id);
  render();
}

function matchFile(fileId, reqId) {
  const file = state.files.find(f=>f.id===fileId);
  if (!file) return;
  if (reqId && isDuplicateConflict(file)) {
    state.message = t('duplicateBlocked'); state.messageType='error'; render(); return;
  }
  const already = state.files.find(f => f.id !== file.id && f.matchId === reqId && reqId);
  if (already) {
    state.message = 'That requirement is already matched to another file.'; state.messageType='error'; render(); return;
  }
  file.matchId = reqId;
  if (!reqId) file.expiry = '';
  render();
}

function setExpiry(fileId, value) {
  const file = state.files.find(f=>f.id===fileId);
  if (file) file.expiry = value;
  render();
}

function includedRequirements() {
  return state.requirements.filter(req => state.files.some(f=>f.matchId===req.id)).sort((a,b)=>a.order-b.order);
}

async function generatePackage() {
  if (!state.tender || state.requirements.some(r=>getStatus(r).blocking)) return;
  state.generating = true; render();
  try {
    const output = await buildPackagePDF();
    const blob = new Blob([output], {type:'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download=`${state.tender.tender_id}_Package.pdf`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    state.message=t('generated'); state.messageType='success';
  } catch (err) {
    console.error(err); state.message=`PDF generation failed: ${err.message || err}`; state.messageType='error';
  } finally { state.generating=false; render(); }
}

function drawFooter(page, tenderId, pageNo, totalPages, font) {
  const { width } = page.getSize();
  const text = `${tenderId} | Page ${pageNo} of ${totalPages}`;
  const size = 7;
  const textWidth = font.widthOfTextAtSize(text,size);
  page.drawRectangle({x:0,y:0,width,height:18,color:rgb(1,1,1),opacity:0.96});
  page.drawText(text,{x:(width-textWidth)/2,y:5,size,font,color:rgb(0.22,0.25,0.3)});
}

async function buildPackagePDF() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const cover = pdf.addPage([595.28,841.89]);
  const {width,height}=cover.getSize();
  cover.drawText('TENDER DOCUMENT PACKAGE',{x:52,y:760,size:23,font:bold,color:rgb(0.08,0.12,0.2)});
  cover.drawText('Submission-ready document checklist',{x:52,y:732,size:11,font,color:rgb(0.35,0.4,0.48)});
  cover.drawRectangle({x:52,y:700,width:491,height:1,color:rgb(0.78,0.82,0.88)});
  const meta=[['Tender ID',state.tender.tender_id],['Tender Title',state.tender.title],['Procuring Entity',state.tender.procuring_entity],['Bidder',state.tender.bidder],['Submission Deadline',state.tender.submission_deadline],['Package Date',todayISO()]];
  let y=670;
  for (const [label,value] of meta){ cover.drawText(`${label}:`,{x:52,y,size:9,font:bold,color:rgb(0.25,0.3,0.38)}); cover.drawText(String(value),{x:175,y,size:10,font,color:rgb(0.08,0.12,0.2)}); y-=24; }
  y-=12; cover.drawText('Included Documents',{x:52,y,size:13,font:bold,color:rgb(0.08,0.12,0.2)}); y-=22;
  includedRequirements().forEach((req,i)=>{ const line=`${i+1}. ${req.title_en}`; cover.drawText(line,{x:65,y,size:9.5,font,color:rgb(0.16,0.19,0.24)}); y-=18; });

  const included = includedRequirements();
  const index = pdf.addPage([595.28,841.89]);
  index.drawText('DOCUMENT INDEX',{x:52,y:770,size:22,font:bold,color:rgb(0.08,0.12,0.2)});
  index.drawText('Start page of each included requirement',{x:52,y:742,size:10,font,color:rgb(0.35,0.4,0.48)});
  let pageCursor=3; // cover + index, first document begins on page 3 (1-based)
  const starts=[];
  for (const req of included){ const file=state.files.find(f=>f.matchId===req.id); starts.push({req,file,start:pageCursor}); pageCursor += file.pages; }
  let iy=700;
  for (const item of starts){ index.drawText(`${item.req.order}. ${item.req.title_en}`,{x:55,y:iy,size:10,font,color:rgb(0.12,0.15,0.2)}); index.drawText(String(item.start),{x:500,y:iy,size:10,font:bold,color:rgb(0.08,0.12,0.2)}); iy-=22; }

  for (const req of included){
    const file=state.files.find(f=>f.matchId===req.id);
    const src=await PDFDocument.load(file.buffer);
    const pages=await pdf.copyPages(src,src.getPageIndices());
    pages.forEach(p=>pdf.addPage(p));
  }
  const total=pdf.getPageCount();
  pdf.getPages().forEach((page,i)=>drawFooter(page,state.tender.tender_id,i+1,total,font));
  return await pdf.save();
}

function exportCSV() {
  if (!state.tender) return;
  const rows=[['Document','File name','Pages','Expiry date','Status']];
  for (const req of state.requirements){ const file=state.files.find(f=>f.matchId===req.id); const s=getStatus(req); rows.push([req.title_en,file?.name||'',file?.pages||'',file?.expiry||'',statusLabel(s)]); }
  const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${state.tender.tender_id}_Checklist.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function loadDemo() {
  state.demo=true;
  state.tender={tender_id:'T-2026-0417',title:'Supply of IT Equipment',procuring_entity:'Directorate of Sample Services',bidder:'Meghna Tech Solutions Ltd.',submission_deadline:'2026-10-20'};
  state.requirements=[
    ['R01',1,'Trade License','ট্রেড লাইসেন্স',true,true,'ok'],
    ['R02',2,'TIN Certificate','টিআইএন সনদ',true,false,'ok'],
    ['R03',3,'VAT Registration Certificate','ভ্যাট নিবন্ধন সনদ',true,false,'ok'],
    ['R04',4,'Bank Solvency Certificate','ব্যাংক সচ্ছলতা সনদ',true,true,'expired'],
    ['R05',5,'Experience Certificate','অভিজ্ঞতার সনদ',true,false,'ok'],
    ['R06',6,'Audited Financial Statement','নিরীক্ষিত আর্থিক বিবরণী',false,false,'notProvided'],
    ['R07',7,"Manufacturer's Authorization",'প্রস্তুতকারকের অনুমোদনপত্র',false,true,'notProvided'],
    ['R08',8,'Technical Proposal','কারিগরি প্রস্তাব',true,false,'ok'],
    ['R09',9,'Financial Proposal','আর্থিক প্রস্তাব',true,false,'ok'],
    ['R10',10,'Signed Declaration','স্বাক্ষরিত ঘোষণাপত্র',true,false,'ok']
  ].map(([id,order,title_en,title_bn,mandatory,has_expiry])=>({id,order,title_en,title_bn,mandatory,has_expiry}));
  state.files=[];
  render();
}

if (new URLSearchParams(location.search).get('demo') === '1') loadDemo(); else render();
