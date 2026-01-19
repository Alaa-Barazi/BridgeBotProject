<h1 align="center">BridgeBot</h1>
<h3 align="center">An AI assistant built to bridge students, mentors, and real project work</h3>

<p align="center">
  <strong>Transparent. Supervised. Designed for learning.</strong>
</p>

---

## 🌉 What is BridgeBot?

<strong>BridgeBot</strong> is an AI-powered academic assistant designed to support  
<strong>student project teams</strong> and <strong>mentors</strong> throughout the full project lifecycle.

Unlike generic AI chatbots, BridgeBot was built with a clear philosophy:

<ul>
  <li><strong>AI should support learning, not replace it</strong></li>
  <li><strong>Every AI interaction should be transparent and reviewable</strong></li>
  <li><strong>System design should reflect real-world engineering practices</strong></li>
</ul>

BridgeBot combines modern AI with cloud infrastructure to create a supervised, accountable AI experience.

---

## 💡 Why BridgeBot Exists

In academic projects:

<ul>
  <li>Students often rely on AI without understanding its limitations</li>
  <li>Mentors lack visibility into how AI tools are being used</li>
  <li>Documentation and guidance are scattered or underused</li>
</ul>

<strong>BridgeBot closes this gap.</strong>

It transforms AI from a hidden helper into a <strong>guided, auditable learning tool</strong>.

---

## 🚀 Core Capabilities

### 🤖 AI Assistant with Context Awareness
BridgeBot answers questions using a  
<strong>Retrieval-Augmented Generation (RAG)</strong> pipeline.

This means:
<ul>
  <li>Answers are grounded in retrieved project content</li>
  <li>No hallucinated or unsupported responses</li>
  <li>Clear separation between data retrieval and generation</li>
</ul>

---

### 🧠 AI Transparency by Design
Every interaction is:
<ul>
  <li>Logged in real time</li>
  <li>Associated with a specific student and project</li>
  <li>Fully visible to mentors</li>
</ul>

This enables <strong>review, feedback, and ethical AI usage</strong>.

---

### 👥 Clear Role Separation

<strong>Students</strong>
<ul>
  <li>Ask project-related questions</li>
  <li>Receive guided AI explanations</li>
  <li>Learn through supervised interaction</li>
</ul>

<strong>Mentors</strong>
<ul>
  <li>View all AI conversations</li>
  <li>Export Q&A logs to Excel</li>
  <li>Monitor engagement and usage patterns</li>
</ul>

Access control is enforced at both the <strong>application</strong> and <strong>database</strong> levels.

---

### 📊 Mentor Dashboard
Mentors can:
<ul>
  <li>Review all BridgeBot conversations</li>
  <li>Export readable logs for offline analysis</li>
  <li>Observe how teams interact with AI tools</li>
</ul>

This supports informed mentoring and responsible AI adoption.

---

## 🧠 Architectural Philosophy

BridgeBot was built as a <strong>real system</strong>, not a demo.

Design principles include:
<ul>
  <li>Separation of concerns</li>
  <li>Explicit role modeling</li>
  <li>Secure, rule-based data access</li>
  <li>Observability over automation</li>
</ul>

AI is treated as a <strong>tool within the system</strong>, not the system itself.

---

## 🧩 System Architecture (High Level)

<strong>Frontend</strong>
<ul>
  <li>React-based client application</li>
</ul>

<strong>Backend and Infrastructure</strong>
<ul>
  <li>Firebase Authentication for identity management</li>
  <li>Firebase Realtime Database for:
    <ul>
      <li>Role management</li>
      <li>Conversation logging</li>
      <li>Access control enforcement</li>
    </ul>
  </li>
</ul>

<strong>AI Layer</strong>
<ul>
  <li>Google Gemini (Generative AI)</li>
  <li>Retrieval-Augmented Generation pipeline:
    <ul>
      <li>Document retrieval</li>
      <li>Context construction</li>
      <li>Answer generation</li>
    </ul>
  </li>
</ul>

<strong>Data Export</strong>
<ul>
  <li>Excel export using XLSX</li>
</ul>

---

## 🔐 Security and Ethics

BridgeBot enforces:
<ul>
  <li>Authenticated access only</li>
  <li>Strict role-based database rules</li>
  <li>Mentor-only visibility for global AI logs</li>
  <li>Student-level write restrictions</li>
</ul>

<strong>AI decisions are never hidden.</strong>  
Transparency is a core system feature.

---

## 🌐 Live Application

<strong>Live site:</strong>  
<em> https://bridge-bot-project-5h9e.vercel.app/login </em>

---

## 🎓 Academic Context

BridgeBot was developed as part of an academic software engineering project, with emphasis on:
<ul>
  <li>Cloud-based system design</li>
  <li>Secure backend architecture</li>
  <li>Ethical AI integration</li>
  <li>Real-world role and permission modeling</li>
</ul>

---

<p align="center">
  <strong>BridgeBot turns AI from a shortcut into a supervised learning partner.</strong>
</p>
