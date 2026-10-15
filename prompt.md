# Project Prompts & Conversation History

This file documents the chronological sequence of prompts and instructions used to build and configure the **SG BusLive** application.

---

## Prompt 1: Initial App Concept & Requirements
**Date:** 2026-10-14  
**Request:**
> build a singapore based bus arrival time application that tracks real time bus locations and provides accurate wait estimates for commuters.

**Implementation Summary:**
- Designed and built a full Singapore transit application adhering to official Land Transport Authority (LTA) Datamall standards.
- Real-time bus arrivals with 3 upcoming buses, second-by-second countdowns, load levels (`SEA` Seats Available, `SDA` Standing Available, `LSD` Limited Standing), and fleet deck types (`SD`, `DD` Double Decker, `BD` Bendy, `WAB` Wheelchair Accessible).
- Interactive Leaflet live bus map with moving bus pins, heading arrows, license plates, speed, and telemetry.
- Stop directory with 5-digit LTA stop codes and MRT line interchanges (`NS`, `EW`, `NE`, `CC`, `DT`, `TE`, `BP`).
- Proximity stop radar with GPS location and distance/walking time calculations.
- Commuter arrival alarms with synthesized Web Audio API two-tone chimes.
- Singapore distance-based fare calculator and route visualizer.

---

## Prompt 2: Scope Clarification (Frontend Focus)
**Date:** 2026-10-14  
**Request:**
> build just the front end for now, i will include the backend connection later

**Implementation Summary:**
- Formatted data contracts and state management to align 1:1 with official Singapore LTA DataMall v3 API schemas (`/v3/BusArrival`).
- Implemented high-fidelity client-side real-time simulation engine that advances buses along Singapore road polylines and updates arrival timings dynamically until the backend is connected.
- Added in-app "Backend API" modal detailing endpoint contracts, parameter specifications, and proxy snippets.

---

## Prompt 3: Git Repository Initialization & Remote Push
**Date:** 2026-10-14  
**Request:**
> git push https://[REDACTED_GH_TOKEN] @ https://github.com/flourrey/ltabussybussy.git

**Implementation Summary:**
- Initialized local git repository and configured author credentials.
- Created initial commit containing all project source files, assets, and configurations.
- Configured default branch as `main` and pushed to remote repository at `https://github.com/flourrey/ltabussybussy.git`.
- Sanitized remote configuration to ensure credentials were not persisted in plain text.

---

## Prompt 4: Serverless LTA DataMall Endpoints
**Date:** 2026-10-15  
**Request:**
> add a serverless connection that pulls live data from lta datamall using the following endpoints:
> 
> - store this in /api folder (project root folder) not he src
> - include /health.ts and /busarrival.ts within that subfolder
> - do not hardcode any key, i will include them later
> 
> GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
> # AccountKey: <LTA_ACCOUNT_KEY>
> # accept: application/json

**Implementation Summary:**
- Created `/api/busarrival.ts` in the project root:
  - Proxies requests to `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={code}`.
  - Defaults to `BusStopCode=83139`.
  - Dynamically reads AccountKey from `process.env.LTA_ACCOUNT_KEY` or incoming `AccountKey` headers without hardcoding.
  - Supports CORS and dual runtime signatures (Node.js and Web Request).
- Created `/api/health.ts` in the project root:
  - Returns service status, timestamp, and boolean verification of `ltaKeyConfigured`.
- Configured Vite development middleware to serve `/api/health` and `/api/busarrival` locally on port 3000.
- Updated `.env.example` with `LTA_ACCOUNT_KEY` placeholder.
- Added live endpoint test console to the application UI.
- Committed and pushed changes to GitHub repository.

---

## Prompt 5: Collate Prompts
**Date:** 2026-10-15  
**Request:**
> collate all the prompt thus far and store in a prompt.md

**Implementation Summary:**
- Created this comprehensive `prompt.md` record documenting every user prompt, implementation summary, and technical milestone.
