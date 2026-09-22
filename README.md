# 🧠 NEXUS — AI Operations & Knowledge Platform

## 📌 About

NEXUS is a support ticketing platform I built to show how an AI-powered system
can actually help a team without taking decisions away from them. Tickets get
classified automatically, the system searches an internal knowledge base and
drafts a suggested reply along with the sources it used — but a human always
decides whether to accept, edit, or reject that suggestion before it goes out.

I built this from scratch: auth, database, four separate places where AI
actually does something, tests, CI/CD, and a real production deployment.

## 🌍 Live demo

<a href="https://nexus-nine-psi-67.vercel.app/" target="_blank">🌐 nexus-nine-psi-67.vercel.app</a>

The login screen has quick-login buttons for demo accounts, or you can use
these credentials directly:

| Role | Email | Password |
|---|---|---|
| Admin | admin@nexus.dev | Password123! |
| Manager | manager@nexus.dev | Password123! |
| Agent | agent@nexus.dev | Password123! |
| Viewer | viewer@nexus.dev | Password123! |

## 🚀 What's in here

- 🤖 Ticket classification via Claude — category, priority, and how confident the model actually is
- 📚 A knowledge base with semantic search (pgvector + Voyage AI) that shows which documents an answer came from
- 🧑‍⚖️ Every AI suggestion goes through review — an agent can accept it, edit it, or reject it, and those decisions actually feed the analytics
- 🎙️ You can create a ticket by voice — record a description of the issue and AI pulls out a title, category, and priority
- 📄 PDF support in the knowledge base, not just plain text
- 📊 Dashboards with real numbers (suggestion acceptance rate, AI cost in dollars), always with the sample size shown — if something is based on 3 data points, it says so
- 📥 An AI Inbox showing what's waiting on someone's decision
- 🔐 Four user roles with permissions that actually make sense
- 🛡️ A few security details that are easy to skip: rate limiting on AI calls, prompt injection mitigations, an activity log on every ticket
- 📱 Works reasonably well on a phone too

## 🛠️ Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Server Actions), React, TypeScript
- **Database:** PostgreSQL + pgvector, Prisma ORM (Neon in production)
- **AI:** Claude (Anthropic) — classification and suggestions; Voyage AI — embeddings
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS, shadcn/ui (Radix)
- **Tests:** Vitest, React Testing Library, Playwright (E2E)
- **CI/CD:** GitHub Actions (lint → typecheck → tests → build → E2E)
- **Hosting:** Vercel

## 📧Contact

Built by <a href="https://www.linkedin.com/in/adam-giszter/" target="_blank">Adam Giszter</a> — feel free to reach out with any questions about this project.

📩 [a.m.giszter@gmail.com](mailto:a.m.giszter@gmail.com)
🔗 [github.com/Giszta](https://github.com/Giszta)
