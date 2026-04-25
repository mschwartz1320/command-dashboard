# MEMORY.md - Long-Term Memory

_Last updated: 2026-04-25_

## The Human

- **Name:** Matthew Schwartz
- **Telegram ID:** 8224590910
- **First contact:** 2026-04-20 17:05 UTC
- **Communication preference:** iMessage (long-term goal), Telegram (current), webchat (fallback)
- **Personality:** Builder mindset, systems thinker, values efficiency over completeness
- **Anti-patterns they self-identify:** Overcomplicating simple things; rushing past important details to execute
- **Goal:** Automate their life end-to-end — everything connected, AI as the hub

## What They Were Doing in Claude

Was using Claude as their primary life-automation hub:
- Everything in their life connected to it
- Automating workflows, tasks, life management
- Wanted to replicate/improve this in OpenClaw

## Their AI Philosophy (from Claude personalizations)

- Concise by default, expand only when decisions/tradeoffs matter
- No narration of tool use — just results
- Honest and direct; challenge bad ideas
- Question the problem before solving it
- Delete/simplify before adding
- Minimum viable → then add complexity if needed
- Long-term compounding > quick wins
- Web search before answering on technical/time-sensitive topics
- Natural human tone in messages/emails
- Accountability to stated goals
- Internalize corrections, don't repeat mistakes

## Architecture Decisions

### Multi-Context Strategy
- Routing agent model: This main agent never does work, spawns specialized subagents
- Each subagent gets scoped tools + appropriate model (cheap for easy, powerful for hard)
- iMessage = primary interaction channel (need setup first)
- Multiple iMessage DMs could be different "contexts" but iMessage only has one-to-one DMs (no multiple bot numbers without hardware)
- **Recommended approach:** Single iMessage DM, but use thread/topic tags or keywords to route to correct subagent context. Main agent routes, subagents execute.

### iMessage Setup Status
- Plugin exists but disabled — needs BlueBubbles or native macOS iMessage bridge
- This server is Linux (Ubuntu) — native iMessage won't work; **BlueBubbles required**
- BlueBubbles needs to run on a Mac; it exposes HTTP API that OpenClaw connects to

## Who Matthew Is

- **Role:** Technical PM at Roots.ai (AI & ML Platform). Prior: CrowdStrike (Platform PM), PwC (IT Program Strategy)
- **Education:** UC Berkeley, Cognitive Science + CS, 2018. Former NCAA D1 Pole Vaulter, Pac-12 qualifier
- **Location:** Upper West Side, NYC
- **Technical level:** Code, SQL, Python, APIs, Snowflake, agentic workflows. Moves fast.
- **Personality:** Builder, efficiency-obsessed, power user. Doesn't naturally gravitate to sales/marketing but loves building and managing people.
- **Watch for:** (1) Overcomplicating simple things; (2) stage-skipping to end-state before validation is done

## Active Projects

### LocalLift
- AI-native digital agency for local businesses (Upper West Side NYC focus)
- Stack: Python + Supabase + Crawl4AI + Claude Haiku + Netlify dashboard
- GitHub: github.com/TheMatthewSchwartz/LocalLift (private)
- Dashboard: locallift-dashboard.netlify.app
- **Current phase:** Phase 0 complete. Pipeline working end-to-end (scout + assessor v2 + dashboard v2)
- **Up next:** Finish batch assessment (~300 remaining), then manual outreach to 10 businesses
- Project files: `~/Projects/LocalLift/` on Mac (NOT `~/LocalLift/` — stale path)
- Supabase: vgydohanbxvvvizvfgxg.supabase.co, n8n at localhost:5678 (admin/locallift2024)

### Misfit Club
- Bar & social club in Mystic CT — multi-page Next.js 16 site
- Testing contract: `npm run check:fast` before commits, `npm run check` before prod deploys
- Design system: 5-color palette (#0A0A0A, #1A1A1A, #2A2A2A, #DA291C, #F5F0E8)
- Project: `~/Projects/misfit-club/` on Mac

### LA28 Olympics
- Ticket logistics with mom Yvonne — cost discrepancy unresolved

## Custom Skills (ported from Claude)
Full skill docs in `memory/skills/`
- **interview-prep** — briefing docs before interviews (web + Gmail + calendar + resume)
- **followup-drafter** — post-interview thank-yous as Gmail drafts, never auto-sends
- **financial-snapshot** — Copilot Money analysis, frames against burn rate + runway
- **frontend-design** — production-grade distinctive UI, never generic AI aesthetics

## Scheduled Tasks (need to port to OpenClaw cron)
| Task | Schedule | Description |
|---|---|---|
| daily-morning-update | 8:10 AM daily | Gmail/calendar/messages scan, surface priorities |
| weekly-memory-refresh | Fri 7:09 PM | Prune tasks, sync job search, enrich memory |
| weekly-review | Sat 9:10 AM | Blind spots, patterns, next-week recs |
| weekly-tooling-audit | Sun 6:02 PM | AI stack audit, skill candidates, HTML report |
Note: Prompt bodies not exported from Claude — need to write from scratch.

## Job Search
- Active: Technical PM roles
- References requested for Gorgias; reference check is the last step before offer.
- Upcoming interviews: Gorgias Mon Apr 27 (1pm case study review, 3pm leadership call with Maxime Pruvost) and Alpine Tue Apr 28 screening with Juliette Callam.
- Other active pipeline: Justworks, LangChain, Millennium follow-up, Hightouch, Rogo/Profound, Red Ventures.
- Resume: `~/Documents/Claude/Projects/Job search/Matthew_Schwartz_Resume_Updated.docx`

## People
- **Yvonne** — Matthew's mom
- **Dr. Belloir** — Psychiatrist
- **Dr. Epstein** — Psychologist/therapist, weekly sessions

## Mac Filesystem Rules
- Documents → `~/Documents/{category}/`
- Code → `~/Projects/`, loose scripts → `~/Projects/_scripts/`
- Never dump in Downloads, Desktop, or home root

## Pending Setup Items

1. [ ] iMessage via BlueBubbles (user needs to install BlueBubbles on Mac)
2. [ ] Port 4 scheduled tasks to OpenClaw cron (write prompts from scratch)
3. [ ] Obsidian vault setup — shared knowledge base
4. [ ] Find job search pipeline location on Mac

## Notes

- Running on Linux (can't use native macOS iMessage bridge)
- BlueBubbles is the right path for iMessage on Linux servers
- User wants to pull them in for decisions/manual steps only — otherwise autonomous

## Writing Style

Full profile in `memory/writing-style.md`. Key summary:
- Semi-formal professional — warm but efficient, never sycophantic
- Very short replies: 1–4 sentences for most professional email
- Greeting: "Hi [First name]," always; never "I hope this email finds you well"
- Sign-offs: "Best," (primary), "Cheers," (warmer), "— Matthew" (casual)
- Signature: Matthew Schwartz / Product Manager | NYC / (818) 434-4327 / LinkedIn
- Plain everyday vocabulary; polite hedges ("would it be possible")
- No exclamation points, emojis, buzzwords, or long preambles in emails
- Replies get shorter as a thread progresses

## Principles

- **Always use the best available tool/skill** — no hacky workarounds in production
- **Clean up superseded tools immediately** when a better one is in place
- **Track temporary hacks** (ngrok, workarounds) and remove them as soon as the proper path exists
- **Minimum viable → upgrade**, not the reverse
