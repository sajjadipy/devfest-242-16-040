import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const pack = path.join(root, 'sample-pack');
const req = JSON.parse(await fs.readFile(path.join(pack, 'requirements.json'), 'utf8'));
const docs = path.join(pack, 'documents');
const pick = {
  R01:'trade_license_2026.pdf', R02:'03_tin_certificate.pdf', R03:'04_vat_certificate.pdf',
  R04:'bank_solvency.pdf', R05:'experience_cert.pdf', R08:'02_technical_proposal.pdf',
  R09:'01_financial_proposal.pdf', R10:'scan_0042.pdf'
};
const included = req.requirements.filter(r=>pick[r.id]).sort((a,b)=>a.order-b.order);
const out = await PDFDocument.create();
const font = await out.embedFont(StandardFonts.Helvetica);
const bold = await out.embedFont(StandardFonts.HelveticaBold);
const cover = out.addPage([595.28,841.89]);
cover.drawText('TENDER DOCUMENT PACKAGE',{x:52,y:760,size:23,font:bold,color:rgb(.08,.12,.2)});
cover.drawText('Submission-ready document checklist',{x:52,y:732,size:11,font,color:rgb(.35,.4,.48)});
let y=680;
for (const [k,v] of [['Tender ID',req.tender.tender_id],['Tender Title',req.tender.title],['Procuring Entity',req.tender.procuring_entity],['Bidder',req.tender.bidder],['Submission Deadline',req.tender.submission_deadline],['Package Date',new Date().toISOString().slice(0,10)]]) { cover.drawText(`${k}:`,{x:52,y,size:9,font:bold}); cover.drawText(v,{x:175,y,size:10,font}); y-=24; }
y-=10; cover.drawText('Included Documents',{x:52,y,size:13,font:bold}); y-=22;
included.forEach((r,i)=>{cover.drawText(`${i+1}. ${r.title_en}`,{x:65,y,size:9.5,font});y-=18;});
const index=out.addPage([595.28,841.89]);
index.drawText('DOCUMENT INDEX',{x:52,y:770,size:22,font:bold});
let cursor=3; let iy=720;
for(const r of included){const src=await PDFDocument.load(await fs.readFile(path.join(docs,pick[r.id]))); index.drawText(`${r.order}. ${r.title_en}`,{x:55,y:iy,size:10,font});index.drawText(String(cursor),{x:500,y:iy,size:10,font:bold});iy-=22;cursor+=src.getPageCount();}
for(const r of included){const src=await PDFDocument.load(await fs.readFile(path.join(docs,pick[r.id])));const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));}
const total=out.getPageCount();
for(let i=0;i<total;i++){const p=out.getPage(i);const {width}=p.getSize();p.drawRectangle({x:0,y:0,width,height:18,color:rgb(1,1,1),opacity:.96});const txt=`${req.tender.tender_id} | Page ${i+1} of ${total}`;const tw=font.widthOfTextAtSize(txt,7);p.drawText(txt,{x:(width-tw)/2,y:5,size:7,font,color:rgb(.22,.25,.3)});}
await fs.mkdir(path.join(root,'output'),{recursive:true});
await fs.writeFile(path.join(root,'output',`${req.tender.tender_id}_Package.pdf`),await out.save());
console.log('Generated sample output.');
