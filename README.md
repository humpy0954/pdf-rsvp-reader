# PDF RSVP Reader

Speed read any PDF with Rapid Serial Visual Presentation. Upload a PDF and read it one word at a time with adjustable speed, ORP alignment, and more.

All processing happens locally in the browser. No PDFs or text are uploaded to any server.

## Features

- **PDF upload** with drag-and-drop and file picker
- **Text extraction** using pdf.js (pdfjs-dist) — per-page streaming extraction
- **RSVP playback** with drift-corrected timing engine
- **ORP alignment** (Optimal Recognition Point) — highlighted fixation character, toggleable
- **Adjustable speed** — 100 to 1200 WPM with slider and keyboard shortcuts
- **Pause profiles** — Light / Normal / Heavy punctuation pause weighting
- **Progress scrubbing** — clickable progress bar, skip forward/back 10 words
- **Font size control** — adjustable display font size
- **Dark mode** — toggle with system preference detection
- **Keyboard shortcuts** — Space (play/pause), arrows (skip/speed), Home (restart)
- **Responsive** — works on mobile and desktop

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- pdfjs-dist for client-side PDF text extraction

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

This project is ready for Vercel deployment:

1. Push to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Deploy — no configuration needed

The `postinstall` script automatically copies the pdf.js worker file to the `public/` directory.

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with dark mode script
    page.tsx            # Main page — upload, extraction, player states
    globals.css         # Tailwind + custom styles
  components/
    PdfUploader.tsx     # Drag-and-drop + file picker
    ExtractionProgress.tsx  # Progress bar, error states, file info
    WordDisplay.tsx     # RSVP word rendering with ORP alignment
    Controls.tsx        # Transport, WPM slider, progress, settings
    RsvpPlayer.tsx      # Player container with keyboard shortcuts
    DarkModeToggle.tsx  # Light/dark mode toggle
  hooks/
    usePdfExtractor.ts  # PDF loading + text extraction via pdfjs-dist
    useRsvpEngine.ts    # RSVP timing engine with drift correction
  lib/
    tokenizer.ts        # Text normalization + tokenization + pause weighting
    types.ts            # TypeScript interfaces
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| Left Arrow | Back 10 words |
| Right Arrow | Forward 10 words |
| Up Arrow | +25 WPM |
| Down Arrow | -25 WPM |
| Home | Jump to start |

## Limitations of PDF Text Extraction

- **Scanned PDFs** (image-only) will not produce any text. OCR is not supported.
- **Complex layouts** — multi-column PDFs, tables, and footnotes may produce text in unexpected order. pdfjs-dist extracts text in the order it appears in the PDF content stream, which may not match visual reading order.
- **Password-protected PDFs** are not supported (a user-friendly error is shown).
- **Ligatures and special characters** may not always be preserved depending on font embedding.
- **Mathematical formulas and equations** often extract poorly.
- **Right-to-left text** (Arabic, Hebrew) is not specifically handled for RSVP presentation.
- **Headers, footers, and page numbers** are extracted as regular text and will appear in the word stream.

## License

MIT
