# licia-docs

A live collaborative text editor built with React, TypeScript, Vite, and Firebase.

Hosted at: https://licia-docs.web.app/

## Features

- Real-time collaboration: multiple users can edit the same document simultaneously and see changes instantly.
- Active anonymous user avatars: view who else is in the document via their avatars in the header.
- Document management: create new documents, and delete only the documents you created.

## Getting Started

1. Clone:
   ```bash
   git clone https://github.com/yourusername/licia-docs.git
   cd licia-docs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase:
   - Paste your Firebase config into `src/firebase-config.ts`.
   - Enable Firestore and Authentication.
4. Run the development server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to start editing documents.

## Usage

- Select or create a document from the sidebar.
- Edit text collaboratively; changes sync in real time.
- See active collaborators via avatars in the header.
- Delete your own documents using the delete button next to each entry.

## Contributing

Contributions are welcome! Fork the repo, make changes, and submit a pull request.
