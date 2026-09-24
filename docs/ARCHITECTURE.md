# CampusIQ System Architecture Documentation

## 1. High-Level System Architecture

```mermaid
graph TD
    Client[Browser Client Next.js / Tailwind CSS / Recharts]
    
    subgraph "CampusIQ Application Layer"
        Navbar[Global Navigation & Quick Role Switcher]
        CommandBar[Cmd+K Unified Command Center]
        StudentPortal[Student Portal /student]
        FacultyPortal[Faculty Portal /faculty]
        AdminPortal[Administrator Command /admin]
    end

    subgraph "Intelligent Services Layer"
        CopilotRouter[AI Context-Aware Query Router]
        RAGEngine[Hybrid RAG & Semantic Chunk Search]
        AcademicEngine[Explainable Academic Intelligence & Gaps]
        ComplaintEngine[AI Triage, Priority Reasoner & Router]
        AnalyticsEngine[Ask Campus Data NL Read-Only Engine]
    end

    subgraph "Data & Persistence Layer"
        PrismaORM[Prisma 6 Client ORM]
        Database[(SQLite dev.db / PostgreSQL)]
        DocStore[University Knowledge Documents & Chunks]
        AuditStream[Immutable Security Audit Trail]
    end

    Client --> Navbar
    Navbar --> StudentPortal
    Navbar --> FacultyPortal
    Navbar --> AdminPortal
    
    StudentPortal --> CopilotRouter
    FacultyPortal --> CopilotRouter
    AdminPortal --> CopilotRouter

    CopilotRouter --> RAGEngine
    CopilotRouter --> AcademicEngine
    CopilotRouter --> ComplaintEngine
    CopilotRouter --> AnalyticsEngine

    RAGEngine --> DocStore
    AcademicEngine --> PrismaORM
    ComplaintEngine --> PrismaORM
    AnalyticsEngine --> PrismaORM
    PrismaORM --> Database
    PrismaORM --> AuditStream
```

---

## 2. RAG (Retrieval-Augmented Generation) Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Faculty / Admin
    participant Router as Copilot Router
    participant RAG as RAG Semantic Engine
    participant DB as Knowledge Documents & Chunks
    participant LLM as AI Provider / Grounded Synthesizer

    User->>Router: "What is the attendance requirement?"
    Router->>Router: Intent Classification: UNIVERSITY_POLICY_RAG
    Router->>RAG: searchKnowledgeBase(query)
    RAG->>DB: Fetch Document Chunks & Metadata
    RAG->>RAG: Hybrid Tokenization & Relevance Scoring
    RAG->>RAG: Select Top Chunks & Extract Citations
    RAG->>LLM: Ground with Verified Chunk Content
    LLM-->>User: Grounded Answer + Source Citation (Attendance_Policy.pdf, Page 1)
```

---

## 3. Context-Aware AI Query Routing Flow

```mermaid
flowchart TD
    Prompt[User Input Prompt] --> Router{Classify Intent}
    
    Router -->|Attendance Policy / Regulations| RAG[Pillar 1: Knowledge RAG]
    Router -->|My Attendance / Grades / Study Focus| Academics[Pillar 2: Student Academic Engine]
    Router -->|Wi-Fi Down / Room Broken / Leak| Complaint[Pillar 3: AI Complaint Triage]
    Router -->|Department Stats / Trend Questions| Analytics[Pillar 4: NL Campus Analytics]

    RAG --> Citations[Output Grounded Answer + Source Citations]
    Academics --> Gaps[Output Learning Gaps + Targeted Study Actions]
    Complaint --> PreFill[Auto-Tag Category, Priority, Dept & Pre-Fill Ticket]
    Analytics --> Chart[Synthesize Summary + Recharts Visualizations]
```

---

## 4. Intelligent Complaint Lifecycle & SLA Escalation

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED: Student logs complaint (AI Auto-Tags Dept & Priority)
    SUBMITTED --> UNDER_REVIEW: Admin Dispatcher reviews ticket
    UNDER_REVIEW --> IN_PROGRESS: Technician dispatched / work order created
    IN_PROGRESS --> RESOLVED: Technician submits resolution report
    RESOLVED --> CLOSED: Student confirms satisfaction
    
    note right of SUBMITTED
      CRITICAL: <6h SLA
      HIGH: <48h SLA
      MEDIUM: <5 days SLA
      LOW: <10 days SLA
    end note
```
