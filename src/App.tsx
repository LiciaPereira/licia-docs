import { useState, useEffect } from "react";
import "./App.css";
import { auth, isFirebaseConfigured } from "./firebase-config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import TextEditor from "./components/text-editor";
import DocumentSelector from "./components/document-selector.tsx";

function App() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    signInAnonymously(auth).catch(() => undefined);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`User signed in: ${user.uid}`);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Licia Docs ツ</h1>
      </header>
      {!selectedDocumentId ? (
        <DocumentSelector onSelect={setSelectedDocumentId} />
      ) : (
        <TextEditor
          documentId={selectedDocumentId}
          onBack={() => setSelectedDocumentId(null)}
        />
      )}
      <footer> Made by Licia Pereira | 2025 </footer>
    </div>
  );
}

export default App;
