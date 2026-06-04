# PROJECT REQUIREMENT & COMPLETION (PRC) DOCUMENT

**Project Title:** Smart Campus Event Management System (SCEMS)  
**Document Type:** Project Requirement & Completion Report  
**Date:** May 2026  
**Status:** Completed & Production-Ready  

---

## 1. PROJECT OVERVIEW

### 1.1 Objective
The objective of the Smart Campus Event Management System (SCEMS) is to provide a unified, automated, and immersive digital ecosystem for the management and discovery of university events. It aims to eliminate manual inefficiencies, centralize event information across departments, and enhance student engagement through modern web technologies and real-time interaction.

### 1.2 Problem Statement
Traditional campus event management is plagued by:
- **Fragmented Communication:** Events are announced via disparate channels (notice boards, WhatsApp groups, emails).
- **Manual Overhead:** Registration and payment tracking often rely on manual spreadsheets or physical forms.
- **Poor User Experience:** Existing university portals are often non-responsive and visually outdated.
- **Lack of Real-Time Data:** Administrators lack instant insights into registration trends and capacity metrics.

### 1.3 Scope
SCEMS covers the end-to-end lifecycle of an event, including creation, discovery, multi-event registration (cart system), simulated real-time payment synchronization, AI-driven support, and post-event feedback. It supports two primary roles: Students (Consumers) and Administrators (Managers).

### 1.4 Target Users & Use Case
- **Students:** To discover workshops, cultural fests, and sports events; to register and manage their event calendar.
- **Administrators:** To manage event logistics, track student participation, and analyze engagement metrics.
- **Real-World Use Case:** A student browsing for a technical workshop and a cultural dance fest, adding both to a cart, scanning a QR code on their phone to "pay" on their laptop, and receiving an automated receipt in their campus inbox.

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture
SCEMS follows a **3-Tier Decoupled Architecture**:
1.  **Frontend (Presentation Layer):** A React-based Single Page Application (SPA) providing a dynamic and responsive user interface.
2.  **Backend (Application Layer):** A Spring Boot REST API orchestrating business logic, security, and data flow.
3.  **Database (Data Layer):** An H2 In-Memory Database (for development) with a MySQL-compatible schema for persistent storage.
4.  **External APIs:** Integration with QR Code generation services and OpenStreetMap for enhanced functionality.

### 2.2 Technology Stack & Justification
| Component | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | High-speed performance, component-based reusability, and rich ecosystem for state management. |
| **Styling** | Vanilla CSS / Tailwind | Maximum flexibility for implementing "Glassmorphism" and premium dark themes. |
| **Backend** | Spring Boot | Enterprise-grade stability, easy REST API creation, and robust JPA support. |
| **Database** | H2 / MySQL | Rapid prototyping with H2; structured relational storage for complex registrations. |
| **Animations** | Framer Motion | Provides fluid, "app-like" transitions that enhance perceived performance. |
| **Mapping** | Leaflet.js | Lightweight and open-source solution for interactive geographic visualizations. |

### 2.3 Data Flow & Workflow
1.  **User Authentication:** JWT-based flow where the client stores the token in `localStorage`.
2.  **Event Discovery:** Client fetches events via REST; local filtering/sorting logic handles UI updates.
3.  **Registration Flow:** Event IDs added to Cart Context -> Checkout page generates a unique Transaction ID -> Backend status polling starts.
4.  **Mobile Sync:** Mobile device triggers a status change on the backend; the desktop poller detects the change and completes the flow.

---

## 3. FEATURES & FUNCTIONALITIES

### 3.1 Module Breakdown
#### A. Event Discovery Module
- Categorized browsing (Technical, Cultural, Sports, etc.).
- Real-time search and multi-criteria filtering (Department, Date, Availability).
- High-performance media loading using optimized WebP assets.

#### B. Registration & Cart System
- Multi-event "Amazon-style" cart.
- Persistent cart state across browser refreshes.
- Capacity check logic (prevents over-registration).

#### C. Real-Time Payment Simulation
- Dynamic QR code generation for UPI simulation.
- Cross-device synchronization via backend polling (Phone-to-Laptop bridge).
- Automated receipt generation and storage.

#### D. Student Dashboard
- Personalized view of upcoming, completed, and cancelled events.
- "Unregister" capability for upcoming events.
- MockMail inbox for viewing registration confirmations and certificates.

#### E. AI Support Chatbot
- Intelligent query mapping for registration and navigation assistance.
- Simulated typing animations and quick-reply triggers.

#### F. Admin Panel
- Comprehensive Analytics (Recharts-based registration trends).
- Event CRUD (Full management of event metadata).
- Registration management with Excel/CSV export capabilities.

---

## 4. IMPLEMENTATION DETAILS

### 4.1 Database Schema
- **User Table:** Handles RBAC (Role-Based Access Control).
- **Event Table:** Contains `eventId`, title, venue coordinates (for maps), and seat availability.
- **Registration Table:** Tracks the junction between User and Event with `status` (Upcoming, Completed, Cancelled).

### 4.2 Key Logic: The Polling Algorithm
To implement real-time payment sync without WebSockets, SCEMS uses a high-frequency polling mechanism:
1.  **Client:** `setInterval(() => checkStatus(txnId), 2000)`
2.  **Backend:** Stores `PaymentStatus` in a concurrent HashMap.
3.  **Mobile:** `POST /api/payments/success/{txnId}` updates the state.

---

## 5. UI/UX DESIGN

### 5.1 Design Approach
- **Glassmorphism:** Use of semi-transparent backgrounds with backdrop-filters for a futuristic aesthetic.
- **Micro-interactions:** Hover effects on cards, loading skeletons, and toast notifications (react-hot-toast).
- **Responsive Design:** Mobile-first layout ensuring accessibility on student smartphones.

### 5.2 Page-wise Description
- **Landing Page:** High-impact hero section with value propositions and trending events.
- **Event Detail:** Immersive view with banner colors derived from category metadata and interactive Leaflet map.
- **Admin Dashboard:** Data-dense layout with collapsible sidebars for professional management.

---

## 6. DEVELOPMENT PROCESS

### 6.1 Workflow
1.  **Phase 1 (Foundation):** Spring Boot backend setup and H2 schema definition.
2.  **Phase 2 (Core UI):** React routing, Context providers, and basic event listing.
3.  **Phase 4 (Advanced):** QR payment sync, Leaflet maps, and Chatbot integration.
4.  **Phase 5 (Polish):** Performance optimization (WebP migration) and report generation.

---

## 7. TESTING & VALIDATION

### 7.1 Testing Methods
- **Manual Functional Testing:** Verification of CRUD, Cart, and Checkout flows.
- **Integration Testing:** Ensuring the mobile payment page correctly updates the desktop client.
- **UI/UX Auditing:** Cross-browser and cross-device responsiveness checks.

---

## 8. RESULTS & OUTCOMES
- **Capability:** A fully functional, full-stack system capable of handling concurrent student registrations.
- **Outcome:** A production-ready prototype that demonstrates the convergence of aesthetics and engineering.

---

## 9. FUTURE ENHANCEMENTS
- **Blockchain Ticketing:** Implementing smart contracts for non-transferable event passes.
- **Push Notifications:** Integrating Firebase Cloud Messaging (FCM) for real-time mobile alerts.

---

## 10. CONCLUSION
SCEMS represents a paradigm shift in campus administration. By prioritizing the student experience and leveraging modern full-stack methodologies, the system provides a scalable and robust solution to a long-standing university challenge.

---
**END OF DOCUMENT**
