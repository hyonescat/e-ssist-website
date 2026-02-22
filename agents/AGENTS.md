# Agency Sub-Agents

Complete roster of specialized agents for the Product Design Agency.

## Discovery Agents

| Agent | Name | Specialty | Emoji |
|-------|------|-----------|-------|
| **research-user** | EmPath | User research, interviews, personas | 🎭 |
| **research-market** | Scout | Market analysis, competitive intel | 🎯 |

## Design Agents

| Agent | Name | Specialty | Emoji |
|-------|------|-----------|-------|
| **ux-designer** | Wayfinder | UX architecture, flows, wireframes | 🧭 |
| **ui-designer** | Pixel | Visual design, design systems | 🎨 |
| **prototyper** | Flux | Interactive prototypes, motion | ⚡ |
| **content-designer** | Verba | UX writing, content strategy | ✍️ |

## Software House Agents

| Agent | Name | Specialty | Emoji |
|-------|------|-----------|-------|
| **software-architect** | Keystone | System design, architecture | 🏛️ |
| **frontend-dev** | Render | UI implementation, React/Vue | 💻 |
| **backend-dev** | Core | APIs, server logic, databases | ⚙️ |
| **fullstack-dev** | Bridge | End-to-end features | 🔗 |
| **mobile-dev** | Pocket | iOS/Android/React Native | 📱 |
| **devops-engineer** | Pipeline | CI/CD, infrastructure | 🚀 |
| **qa-engineer** | Proof | Testing, quality assurance | ✅ |
| **security-engineer** | Shield | Security reviews, compliance | 🛡️ |
| **database-engineer** | Schema | Data modeling, optimization | 🗄️ |

## Delivery Agents

| Agent | Name | Specialty | Emoji |
|-------|------|-----------|-------|
| **design-ops** | System | Design QA, systems maintenance | 🔄 |
| **dev-handoff** | Bridge | Specs, assets, documentation | 🌉 |
| **presenter** | Narrative | Presentations, storytelling | 🎭 |

---

## Spawning Agents

```bash
# From main session
sessions_spawn --agentId research-user --task "Analyze user needs for [project]"
sessions_spawn --agentId software-architect --task "Design system architecture for [platform]"
```

Each agent has their own SOUL.md at `~/workspace/agents/{agent-name}/SOUL.md`

## Agent Communication

Agents can message each other:
```bash
sessions_send --agentId ux-designer "Wireframes ready for review"
```

## Escalation Path

When blocked, agents escalate:
- Design questions → design-ops or ui-designer
- Technical architecture → software-architect
- Implementation blocks → devops-engineer or security-engineer
- Presentation needs → presenter
