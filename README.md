# Taxfix-commitment

A personal, non-commercial UI clone of the [Taxfix](https://www.taxfix.de) "choose tax tool" and tax-question wizard flow, built with Next.js + Tailwind CSS as a frontend prototyping exercise.

> **Disclaimer:** This project is unaffiliated with, unendorsed by, and not sponsored by Taxfix / TaxScouts. The Taxfix name and logo are used here for visual reference purposes only, to replicate a UI pattern for personal practice. It is not deployed as a public product and is not intended to compete with or impersonate the real service.

## What's here

- `/choose-tax-tool` — the initial "what brings you here today" reason picker
- `/income-sources` — an Add/Remove checklist of income sources, with a confirm modal
- `/tax-years/2025/question` — the step-by-step question wizard (sidebar + active question card), covering a self-employment and a property-income flow
- `/done` — a summary of everything answered

State is held in memory via [Zustand](https://github.com/pmndrs/zustand) — nothing is persisted or sent anywhere.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- Zustand
