import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import "../style/document-selector.css";
import { getDocumentName } from "../utils/document-name";

//define the props interface for the document selector component
interface DocumentSelectorProps {
  onSelect: (docId: string) => void;
}

//define the DocumentSelector component
function DocumentSelector({ onSelect }: DocumentSelectorProps) {
  const [documents, setDocuments] = useState<
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
    }[]
  >([]);
  const [userUid, setUserUid] = useState<string | null>(null);

  // get current user UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserUid(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  //define a function to fetch documents from the firestore db
  const fetchDocuments = async () => {
    const docsSnapshot = await getDocs(collection(db, "documents"));

    //map over the documents in the snapshot and extract their data
    const docs = docsSnapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      //get the doc name from the data, or if there's none, generate a default name
      const name = getDocumentName(data.title as string, data.content);

      //return the doc data
      const created = data.createdAt?.toDate?.() ?? null;
      const updated = data.updatedAt?.toDate?.() ?? null;
      const creator = (data.createdBy as string) || null;
      return {
        id: docSnap.id,
        name,
        createdAt: created ? created.toLocaleDateString() : "-",
        updatedAt: updated ? updated.toLocaleDateString() : "-",
        createdBy: creator,
      };
    });

    //update the documents state with the fetched documents
    setDocuments(docs);
  };

  //use the useEffect hook to fetch documents when the component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  const createNewDocument = async () => {
    const newDocRef = await addDoc(collection(db, "documents"), {
      content: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userUid,
    });
    await fetchDocuments();
    onSelect(newDocRef.id);
  };

  // delete a document (only by creator)
  const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, "documents", id));
    await fetchDocuments();
  };

  return (
    <div
      className="document-selector"
      role="region"
      aria-label="Document selector"
    >
      <h3>Select a Document</h3>
      <ul>
        <li className="doc-list-header">
          <span className="col-name">Name</span>
          <span className="col-created">Created</span>
          <span className="col-edited">Edited</span>
        </li>
        {documents.map((doc) => (
          <li key={doc.id} className="doc-list-item">
            <button
              onClick={() => onSelect(doc.id)}
              className="col-name btn-doc"
            >
              {doc.name.length > 20 ? `${doc.name.slice(0, 17)}...` : doc.name}
            </button>
            <span className="col-delete">
              {userUid === doc.createdBy && (
                <button
                  className="btn-delete-doc"
                  aria-label="Delete document"
                  onClick={() => deleteDocument(doc.id)}
                >
                  Delete
                </button>
              )}
            </span>
            <span className="col-created">{doc.createdAt}</span>
            <span className="col-edited">{doc.updatedAt}</span>
          </li>
        ))}
      </ul>
      <button onClick={createNewDocument} className="btn-new-doc">
        Create New Document
      </button>
    </div>
  );
}

export default DocumentSelector;
