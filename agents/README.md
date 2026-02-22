# Product Design Agency — Agent Roster

This directory contains 17 specialized sub-agents, each with their own persona, expertise, and trigger phrases.

## Quick Reference

### To spawn an agent:
```bash
sessions_spawn --agentId {agent-name} --task "{description}"
```

### To message an agent:
```bash
sessions_send --agentId {agent-name} "{message}"
```

### To check agent status:
```bash
sessions_list --kinds sub-agent
```

## Agent Directory Structure

```
agents/
├── AGENTS.md              # This file — master roster
├── README.md              # Usage guide
├── research-user/
│   └── SOUL.md           # EmPath — User research
├── research-market/
│   └── SOUL.md           # Scout — Market analysis
├── ux-designer/
│   └── SOUL.md           # Wayfinder — UX design
├── ui-designer/
│   └── SOUL.md           # Pixel — Visual design
├── prototyper/
│   └── SOUL.md           # Flux — Prototyping
├── content-designer/
│   └── SOUL.md           # Verba — UX writing
├── software-architect/
│   └── SOUL.md           # Keystone — Architecture
├── frontend-dev/
│   └── SOUL.md           # Render — Frontend
├── backend-dev/
│   └── SOUL.md           # Core — Backend
├── fullstack-dev/
│   └── SOUL.md           # Bridge — Full-stack
├── mobile-dev/
│   └── SOUL.md           # Pocket — Mobile
├── devops-engineer/
│   └── SOUL.md           # Pipeline — DevOps
├── qa-engineer/
│   └── SOUL.md           # Proof — QA
├── security-engineer/
│   └── SOUL.md           # Shield — Security
├── database-engineer/
│   └── SOUL.md           # Schema — Database
├── design-ops/
│   └── SOUL.md           # System — Design ops
├── dev-handoff/
│   └── SOUL.md           # Bridge — Handoff
└── presenter/
    └── SOUL.md           # Narrative — Presentations
```

## Agent Naming Convention

Each agent has:
- **Code name** (kebab-case): `ux-designer`, `backend-dev`
- **Persona name** (proper name): Wayfinder, Core, Shield
- **Emoji identity**: For quick visual recognition
- **Specialty**: Clear area of expertise

## Working with Agents

### Example: Starting a project

```bash
# 1. Research phase
sessions_spawn --agentId research-user --task "Conduct user interviews for fintech app"
sessions_spawn --agentId research-market --task "Analyze competitors in personal finance space"

# 2. Design phase
sessions_spawn --agentId ux-designer --task "Create user flows based on research findings"
sessions_spawn --agentId ui-designer --task "Design visual system for fintech app"

# 3. Development phase
sessions_spawn --agentId software-architect --task "Design microservices architecture"
sessions_spawn --agentId frontend-dev --task "Build React components for dashboard"
sessions_spawn --agentId backend-dev --task "Create API for transaction processing"

# 4. Delivery phase
sessions_spawn --agentId design-ops --task "QA review of all design deliverables"
sessions_spawn --agentId dev-handoff --task "Prepare specs and assets for development"
sessions_spawn --agentId presenter --task "Create client presentation deck"
```

### Example: Agent-to-agent communication

```bash
# UX designer sends wireframes to UI designer
sessions_send --agentId ui-designer "Wireframes ready at /projects/acme/ux/flows.pdf"

# Frontend dev asks architect for clarification
sessions_send --agentId software-architect "Question on API pagination strategy"
```

## Agent Autonomy

Each agent:
- Has their own SOUL.md defining personality and standards
- Operates independently once spawned
- Can escalate to other agents when blocked
- Reports back to the coordinator (you or me)

## Quality Assurance

Before spawning, agents read their SOUL.md to embody their persona. This ensures consistent character and expertise across sessions.
