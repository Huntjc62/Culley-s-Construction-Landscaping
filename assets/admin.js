import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const login = document.querySelector("#login");
const dashboard = document.querySelector("#dash");
const form = document.querySelector("#loginform");
const loginMessage = document.querySelector("#loginmsg");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const count = document.querySelector("#count");
const list = document.querySelector("#list");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "Signing in…";

  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );
    passwordInput.value = "";
  } catch (error) {
    console.error("Culley's admin sign-in failed:", error);
    loginMessage.textContent = "Unable to sign in. Please check your email and password.";
  }
});

document.querySelector("#logout")?.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    login.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadEnquiries();
  } else {
    login.classList.remove("hidden");
    dashboard.classList.add("hidden");
    list.innerHTML = "";
    count.textContent = "0";
  }
});

function loadEnquiries() {
  const enquiriesQuery = query(
    collection(db, "enquiries"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(
    enquiriesQuery,
    (snapshot) => {
      count.textContent = snapshot.size;
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p>No enquiries yet.</p>";
        return;
      }

      snapshot.forEach((documentSnapshot) => {
        const enquiry = documentSnapshot.data();
        const article = document.createElement("article");
        article.className = "enquiry";

        const date = enquiry.createdAt?.toDate
          ? enquiry.createdAt.toDate().toLocaleString("en-GB")
          : "Just now";

        article.innerHTML = `
          <div class="enqtop">
            <div>
              <h3>${escapeHtml(enquiry.name)}</h3>
              <small>${escapeHtml(enquiry.email)}</small>
            </div>
            <button type="button">Delete</button>
          </div>
          <div class="enqmeta">
            ${escapeHtml(enquiry.service)} ·
            ${escapeHtml(enquiry.phone)} ·
            ${date}
          </div>
          <p>${escapeHtml(enquiry.message)}</p>
        `;

        article.querySelector("button").addEventListener("click", async () => {
          if (!confirm("Delete this enquiry?")) return;

          try {
            await deleteDoc(doc(db, "enquiries", documentSnapshot.id));
          } catch (error) {
            console.error("Could not delete enquiry:", error);
            alert("The enquiry could not be deleted.");
          }
        });

        list.appendChild(article);
      });
    },
    (error) => {
      console.error("Could not load enquiries:", error);
      list.innerHTML = "<p>Unable to load enquiries. Check your Firestore security rules.</p>";
    }
  );
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}
