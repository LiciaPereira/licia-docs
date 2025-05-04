import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import {
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { throttle } from "lodash";
import "react-quill-new/dist/quill.snow.css";
import "../style/text-editor.css";

//defines the shape of the props that TextEditor expects to receive
interface TextEditorProps {
  documentId: string;
  //function that's called when the user clicks the back button
  onBack: () => void;
}

function TextEditor({ documentId, onBack }: TextEditorProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [userUid, setUserUid] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const quillRef = useRef<ReactQuill>(null);
  const documentRef = doc(db, "documents", documentId);

  //track if a change was made by the local user
  const isLocalChange = useRef(false);

  //set up authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserUid(user ? user.uid : null); //update the userUid with the current user's ID
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    //when user logs in, create a presence document to track active users in the document
    if (!userUid) return;
    //create a reference to the presence documtn for the current user
    const presenceRef = doc(db, "documents", documentId, "presence", userUid);
    setDoc(presenceRef, { uid: userUid, lastSeen: serverTimestamp() });
    const presenceCol = collection(db, "documents", documentId, "presence");

    const unsubscribePresence = onSnapshot(presenceCol, (snap) => {
      //update the activeUsers state with the list of active users
      setActiveUsers(snap.docs.map((d) => d.data().uid));
    });

    //when the component is unmounted, remove the presence document
    return () => {
      unsubscribePresence();
      deleteDoc(presenceRef).catch(console.error);
    };
  }, [documentId, userUid]);

  //save content to firestore with throttle
  const saveContent = throttle(() => {
    if (quillRef.current && isLocalChange.current) {
      const content = quillRef.current.getEditor().getContents();

      //set the document in firestore with the updated content
      setDoc(
        documentRef,
        { content: content.ops, updatedAt: serverTimestamp() },
        { merge: true }
      )
        .then(() => console.log("Content saved successfully"))
        .catch(console.error);

      isLocalChange.current = false; //reset local change flag after saving
    }
  }, 1000);

  useEffect(() => {
    if (quillRef.current) {
      //load initial content from firestore
      getDoc(documentRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as { content?; title?: string };
            const savedContent = data.content;
            if (savedContent) {
              quillRef.current.getEditor().setContents(savedContent);
            }
            setTitle(data.title || "");
          } else {
            console.log("No doc found, starting with an empty editor.");
          }
        })
        .catch(console.error);

      //losten for firestore document updates in real time
      const unsubscribe = onSnapshot(documentRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as { content?; title?: string };
          const newContent = data.content;

          if (!isEditing) {
            const editor = quillRef.current.getEditor();
            const currentCursorPosition = editor.getSelection()?.index || 0;

            editor.setContents(newContent, "silent");
            editor.setSelection(currentCursorPosition);
          }
          setTitle(data.title || "");
        }
      });

      const editor = quillRef.current.getEditor();
      editor.on("text-change", (_, __, source) => {
        if (source === "user") {
          isLocalChange.current = true;
          setIsEditing(true);
          saveContent();

          setTimeout(() => setIsEditing(false), 5000);
        }
      });

      return () => {
        unsubscribe();
        editor.off("text-change");
      };
    }
  }, []);

  return (
    <div className="licia-text-editor">
      <div className="editor-header">
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Back to documents"
        >
          ←
        </button>
        <input
          type="text"
          className="doc-title-input"
          value={title}
          placeholder="Untitled"
          aria-label="Document title"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() =>
            setDoc(
              documentRef,
              { title, updatedAt: serverTimestamp() },
              { merge: true }
            ).catch(console.error)
          }
        />
        <div className="user-icons" role="group" aria-label="Active users">
          {activeUsers.map((uid) => (
            <span key={uid} className="user-icon" title={uid}>
              {uid.charAt(0).toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="licia-docs-editor" role="region" aria-label="Text editor">
        <ReactQuill ref={quillRef} />
      </div>
    </div>
  );
}

export default TextEditor;
