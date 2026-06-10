# Licia Docs

A real-time collaborative document editor built with React, TypeScript, Vite, Firebase Authentication, and Firestore.

Live site: https://licia-docs.web.app/

## Why This Project Matters

This project demonstrates a richer frontend application than a static portfolio piece: real-time data syncing, document ownership, authentication, routing between document states, and a text editor experience built with reusable React components.

## Tech Stack

- React
- TypeScript
- Vite
- Firebase Authentication
- Firestore
- Quill editor

## Features

- Real-time document editing with synced Firestore updates.
- Anonymous authentication for quick access.
- Document list with created and edited timestamps.
- Document creation and deletion.
- Rich text editing through Quill.
- Firebase hosting deployment.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_firebase_auth_domain
VITE_PROJECTID=your_firebase_project_id
VITE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Development Notes

The most important implementation details are the Firebase-backed document state, editor integration, and TypeScript/Vite project setup. This project is a good frontend signal because it goes beyond static UI and includes persistent real-time behavior.
