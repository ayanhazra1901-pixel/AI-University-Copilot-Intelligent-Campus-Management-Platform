# CampusIQ — Official Challenge #4 Submission Briefing

> **Project Name:** CampusIQ  
> **Tagline:** One Intelligent Layer for the Entire University.  
> **Challenge:** 30-Day Innovation Challenge #4 — AI University Copilot & Intelligent Campus Management Platform  
> **Product Architecture:** Full-Stack Next.js 16 (App Router), TypeScript, Prisma ORM, SQLite/PostgreSQL, Tailwind CSS, Recharts, Grounded RAG & Modular AI Abstraction.

---

## 1. Executive Summary & Problem Statement

Traditional university operations rely on fragmented legacy software: one disconnected portal for marks, another for hostel maintenance, physical paper submissions for leaves, and siloed administrative spreadsheets. Students face bureaucratic friction, faculty face administrative burden, and university leadership lacks actionable real-time campus intelligence.

**CampusIQ is not merely a chatbot or a superficial ERP.**  
It is an **AI-powered operating layer** that sits above university knowledge, academic databases, and operational services. When a student asks a question, CampusIQ understands their role, retrieves verified policy documents with source citations, analyzes authorized academic data, and triggers automated workflows (such as complaints or leave filings) across campus departments.

---

## 2. The Four Challenge Pillars & Implementation Verification

### Pillar 1: AI University Copilot & Grounded RAG Knowledge Base
- **Capabilities:** Conversational assistant that operates on an auditable RAG pipeline: Document Ingestion → Text Extraction → Cleaning → Chunking → Semantic/Keyword Vector Storage → Hybrid Retrieval → LLM Grounding → Verifiable Source Citations.
- **Source Verification:** Every policy answer explicitly displays source document name, page number, and relevance match percentage (e.g., `University_Attendance_Policy_2024_25.pdf, Page 1`).
- **Safety Safeguard:** Never invents or hallucinates regulations. If information is absent, returns: *"I couldn't find this information in the available university documents."*
- **Context-Aware Routing:** Distinguishes between general policy questions (RAG), personal grades (Academic Database), grievance reports (Complaint Triage), and administrative analytics (Ask Campus Data).

### Pillar 2: Academic Intelligence & Student Support
- **Explainable Learning Gap Analysis:** Analyzes assessment patterns, midterms, quizzes, and practical assignments to identify specific conceptual topics needing attention (e.g., Computer Networks: VLSM / CIDR subnetting at 58%).
- **Supportive Early Alerts:** Detects courses with attendance below the 75% university examination threshold (e.g., CS204 at 70%) and triggers supportive advisories without ungrounded predictions like "You will fail."
- **Targeted Study Priorities:** Provides actionable learning recommendations, practice modules, and faculty office hour connections.

### Pillar 3: Intelligent Complaint Management
- **Instant AI Triage:** When a student logs an issue (e.g., *"Wi-Fi is not working in Hostel Block B, 3rd Floor"*), the AI immediately evaluates:
  - **Category & Subcategory:** Hostel / IT & Internet
  - **Department Routing:** Auto-assigned to IT Services Network Ops
  - **Priority Evaluation:** HIGH (with human-readable safety justification)
  - **Executive Summary:** Synthesized report for campus engineers
- **Full 5-Stage Lifecycle Tracking:** `SUBMITTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`.
- **Auditing & Notifications:** Status progressions immediately trigger student notification updates and immutable audit logs.

### Pillar 4: AI Campus Analytics & Decision Support
- **"Ask Campus Data":** Natural language query interface allowing administrators to ask complex operational questions (e.g., *"Which department has the most unresolved complaints?"*).
- **Strict Read-Only Execution:** Safe querying abstraction preventing arbitrary database modifications while instantly synthesizing interactive Bar, Line, or Pie charts.
- **Reporting:** Export one-click CSV reports for complaints, attendance, and department statistics.

---

## 3. Demo Credentials & Verified Live Walkthrough

| Role | Email | Password | Persona Details |
|---|---|---|---|
| **Student** | `student@campusiq.edu` | `student123` | Aarav Sharma &bull; B.Tech CSE &bull; Semester 4 &bull; Roll: `CSE-2023-042` |
| **Faculty** | `faculty@campusiq.edu` | `faculty123` | Dr. Sunita Rao &bull; Assoc. Professor &bull; HoD Academics |
| **Administrator** | `admin@campusiq.edu` | `admin123` | Prof. Rajesh Verma &bull; Dean of Campus Administration |

*(Note: The platform also features a 1-Click Role Switcher bar in the top navigation for immediate testing during live judge presentations).*

---

## 4. 5–7 Minute Live Demo Script (Step-by-Step)

1. **Step 1 — Student Login & RAG Copilot:**
   - Launch platform and click **Student (Aarav)**.
   - Open **AI Copilot** and ask: *"What is the attendance requirement?"*
   - Verify grounded response citing **University_Attendance_Policy_2024_25.pdf (Page 1)** with the 75% rule and medical condonation policy.
2. **Step 2 — Explainable Academic Intelligence:**
   - Ask Copilot: *"What should I focus on academically?"* or click **Academics & Gaps**.
   - Review the **Explainable Learning Gap** card highlighting CS204 Subnetting (58%) and the **Early Alert** for 70% attendance in Computer Networks.
3. **Step 3 — Intelligent Complaint Submission:**
   - In Copilot or Complaint Desk, enter: *"Wi-Fi is not working in Hostel Block B, 3rd Floor"*.
   - Watch the live AI triage automatically tag: Category `Hostel`, Priority `HIGH`, Department `IT Services`, and generate an executive summary.
   - Click **Submit Grievance**.
4. **Step 4 — Admin Triage & Status Progression:**
   - Click **Admin (Prof. Rajesh)** on the top switcher.
   - Open **Complaint Command**. Notice the new ticket is properly routed to IT Services.
   - Click **Progress Status** to move it from `SUBMITTED` to `IN PROGRESS` with a technician note.
5. **Step 5 — Natural Language Campus Analytics:**
   - Open **Campus Analytics**.
   - In **Ask Campus Data**, ask: *"Which department has the most unresolved complaints?"*
   - Observe the instant executive summary, interactive bar chart, and department breakdown.
6. **Step 6 — Knowledge Base & Document Management:**
   - Open **Knowledge Base**.
   - Review indexed documents, chunk counts, and search capabilities.

---

## 5. Security, Data Privacy & Reliability Highlights
- **100% Deterministic Fallback Mode:** Works completely offline without external API keys, ensuring flawless live judge presentations.
- **RBAC:** Strict isolation between Student, Faculty, and Admin endpoints. Students cannot view other students' records or confidential admin queues.
- **Read-Only Analytics:** AI NL queries cannot run arbitrary mutations (`DROP`, `DELETE`, `UPDATE`), eliminating data loss risks.
