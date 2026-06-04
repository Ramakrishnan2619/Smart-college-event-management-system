# PROJECT REPORT: SMART CAMPUS EVENT MANAGEMENT SYSTEM (SCEMS)

**Degree of Bachelor of Technology in Computer Science & Engineering**

---

## 1. ABSTRACT
The management of large-scale campus events traditionally relies on fragmented communication, manual spreadsheets, and physical registrations, leading to significant informational gaps and administrative delays. This report presents the **Smart Campus Event Management System (SCEMS)**, a comprehensive digital ecosystem designed to centralize and automate the lifecycle of university events.

SCEMS utilizes a modern 3-tier decoupled architecture, integrating a high-performance **React.js** frontend with a robust **Spring Boot** backend. The system introduces advanced features such as **Real-Time QR-based Mobile Payment Synchronization**, an **AI-powered Support Chatbot**, and **Interactive Venue Mapping** using Leaflet.js. By leveraging a centralized H2/MySQL database infrastructure, SCEMS provides administrators with real-time analytics and capacity management, while offering students a personalized "Glassmorphism" dashboard for seamless discovery and registration. 

---

# CHAPTER 1: INTRODUCTION

### 1.1 Introduction
In the contemporary academic landscape, university campuses are vibrant hubs of extracurricular activity. These activities range from technical symposiums, hackathons, and industrial workshops to cultural festivals, dance competitions, and sporting tournaments. However, the administrative burden of managing these events often falls on manual systems.

The **Smart Campus Event Management System (SCEMS)** is conceptualized as a "Digital Campus Nerve Center." It is not merely a registration portal but a sophisticated platform that bridges the gap between event organizers and the student body.

### 1.2 Aim of the Project
The primary aim of SCEMS is to modernize the university event ecosystem. Specifically, the project aims to:
- **Centralize Information:** Provide a single source of truth for every event.
- **Simplify Registration:** Implement an "Amazon-style" cart system.
- **Simulate Real-World Fintech:** Real-time QR-to-Mobile payment bridge.
- **Provide 24/7 Support:** AI chatbot technology for student support.

### 1.3 Scope of the Project
- **Functional Scope for Students:** Discovery, search, cart, QR payments, receipts.
- **Functional Scope for Admins:** CRUD operations, real-time analytics, data exports.
- **Technical Scope:** React state management, Spring Boot REST APIs, JPA persistence.

---

# CHAPTER 2: SURVEY OF SIMILAR APPLICATIONS

### 2.1 Market Analysis
- **Eventbrite:** Robust but lacks campus role-based access.
- **Meetup.com:** Community focus but lacks academic departmental structure.
- **Traditional University Portals:** Non-responsive and visually outdated.

### 2.2 Gap Identification
1. **The Aesthetic Gap:** Modern students prefer dark mode/glassmorphism.
2. **The Interaction Gap:** Need for real-time status and AI support.
3. **The Payment Sync Gap:** Bridging desktop and mobile for simulations.

---

# CHAPTER 3: FRAMEWORK DESCRIPTION

### 3.1 Frontend Implementation
Built with **React.js** and **Vite**.
- **State Management:** Context API (Auth, Cart, Theme).
- **Styling:** Tailwind CSS & Framer Motion.
- **Icons:** Lucide-React.

### 3.2 Backend Implementation
Built with **Spring Boot** and **Java 26**.
- **Architecture:** Controller-Service-Repository pattern.
- **Persistence:** Spring Data JPA.
- **Database:** H2 (Development) / MySQL compatible.

### 3.3 Database Implementation
- **Users:** RBAC and profile data.
- **Events:** Venue, dates, and seat tracking.
- **Registrations:** Payment and status history.

---

# CHAPTER 4: METHODOLOGIES

### 4.1 Project Architecture
**3-Tier Decoupled Architecture**:
- Presentation (React SPA)
- Application (Spring Boot REST)
- Data (H2 Database)

### 4.2 Key Algorithms

#### A. Cross-Device Synchronization Algorithm
Uses a high-frequency polling pattern:
1. Desktop generates `txnId` and polls.
2. Mobile device triggers success `POST`.
3. Desktop detects change and completes checkout.

#### B. AI Chatbot Pattern
Uses Keyword-Weighted Mapping to deliver contextual support based on student intents.

---

# CHAPTER 5: RESULTS AND DISCUSSIONS

### 5.1 System Visualizations
Includes Landing Page, Checkout Flow, Venue Maps, and Admin Analytics. Optimized with WebP media for high-performance loading.

---

# CHAPTER 6: CONCLUSION & FUTURE ENHANCEMENTS

### 6.1 Conclusion
SCEMS successfully solves the problem of manual event management using modern full-stack development methodologies.

### 6.2 Future Enhancements
- **Blockchain Ticketing** for security.
- **ML Recommendations** for event personalization.
- **Firebase Push Notifications**.

---
**END OF REPORT**
