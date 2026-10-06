# Tender Document Package Builder

**Name:** Sajjad Hossain  
**Registration Number:** 242-16-040  
**Live Link:** _Add final HTTPS deployment URL here_

## How to run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Main features

- Load and validate `requirements.json`.
- Sort requirements by `order` and show tender details.
- Upload up to 30 PDFs with a 50 MB total limit.
- Reject non-PDF files and safely handle unreadable/password-protected PDFs.
- Count PDF pages in the browser.
- Match one PDF to one requirement and prevent one requirement from receiving multiple files.
- SHA-256 exact duplicate detection independent of filenames.
- Prevent duplicate copies from being matched to different requirements.
- Expiry-date checking against the submission deadline.
- Live statuses: Missing, Expiry date needed, Expired, Not provided, OK.
- Generate button remains disabled while any blocking status exists.
- Generate ordered combined PDF with English cover, index, all matched pages and page footers.
- Download as `<tender_id>_Package.pdf`.
- Export the checklist as CSV.
- English/Bangla UI and requirement titles.

## Bonus features

- Document index page.
- Filename-based workflow support through manual matching UI.
- CSV checklist export.
- Demo status view for presentation/screenshot.
- Clear damaged/password-protected PDF error handling.

## Known limitations

- Browser memory is used for PDF processing; very large PDFs may be limited by the device.
- The app intentionally uses no participant-controlled backend or database.
- PDF cover text is English as required by the problem statement.

## AI tools used

- AI coding assistant / ChatGPT during contest development.

## Most useful prompt

> Build a frontend-only Tender Document Package Builder from the supplied problem statement. Use Vite and pdf-lib, load requirements.json, upload and validate PDFs, count pages, detect exact duplicates using SHA-256, match files to requirements, check expiry dates against the tender deadline, show the five required statuses, disable generation while blocked, and generate a correctly ordered combined PDF with an English cover, index, all original pages and `<tender_id> | Page X of Y` footers. Keep all processing in the browser and support English/Bangla UI.

## Contest compliance

- Frontend only; no participant backend, database, Firebase, Supabase or Appwrite.
- MIT licensed.
- Static hosting compatible.
