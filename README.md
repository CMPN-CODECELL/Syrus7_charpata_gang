# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


# Flow-Guard AI

> **"Predict the bottleneck. Prevent the cascade."**  
> **Domain:** Sustainability — Healthcare | **Problem Statement:** PS1 — Predictive Hospital Bottleneck Intelligence  
> **SDG Alignment:** SDG 3 (Good Health and Well-being: 3.8, 3.d) & SDG 9 (Industry, Innovation and Infrastructure: 9.1)

---

## Executive Summary

Hospital tools typically reveal operational congestion only after queues form, causing critical delays to cascade across diagnostics, inpatient beds, and patient discharge. **Flow-Guard AI** is a decision-support platform that forecasts where bottlenecks emerge, when, and how severe[cite: 5, 8]. It explains root-cause drivers, traces downstream cascade propagation, simulates operational what-ifs, and suggests preventive interventions[cite: 5, 8]. 

The platform operates on a **two-panel network architecture**: an authorized operator manages inputs from a Central Control Panel, while changes synchronize to read-only departmental display screens across Emergency, Radiology, Pathology, and Wards. Clinicians maintain human-in-the-loop governance for every approved mitigation.

---

## System Architecture

```text
+-----------------------------------------------------------------------------------+
|                           CENTRAL CONTROL PANEL                                   |
|   (Authorised Operator: arrivals, tests, tasks, staff, beds, equipment, season)   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                               SYNC & DATA LAYER                                   |
|       FastAPI API Gateway  *  SQLite/PostgreSQL State Store  *  Audit Logger      |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           FLOWGUARD AI ENGINE                                     |
|  1. PREDICT: Seasonal baseline + Queue-load drift (arrivals vs. service capacity) |
|  2. EXPLAIN: Ranked contributing drivers & empirical backtest confidence bands    |
|  3. SIMULATE: What-if parameter shocks + Directed cascade graph propagation       |
|  4. PREVENT: Ranked actions + Tiered early warnings (WATCH / WARNING / CRITICAL)   |
+--------------------+------------------------------------+-------------------------+
                     |                                    |
                     v                                    v
+-------------------------------------+  +------------------------------------------+
|      SYNCHRONISED VIEW PANELS       |  |          HUMAN DECISION & AUDIT          |
|         (Read-Only Displays)        |  |  Operator approves or rejects action     |
|  * Emergency Department (ED)        |  |  Immutable audit trail:                  |
|  * Radiology & Imaging (CT/X-Ray)   |  |  (Cycle n-1 -> Cycle n -> Cycle n+1)     |
|  * Pathology & Stat Lab             |  |  Directives broadcast to View Panels     |
|  * Ward / ICU Bed Command           |  +------------------------------------------+
+-------------------------------------+