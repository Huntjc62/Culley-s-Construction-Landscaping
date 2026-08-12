import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, adminEmail } from "./firebase-config.js";

const login = document.querySelector("#login");
const dashboard = document.querySelector("#dash");
const form = document.querySelector("#loginform");
const loginMessage = document.querySelector("#loginmsg");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logout");
const count = document.querySelector("#count");
const list = document.querySelector("#list");
const firebaseWarning = document.querySelector("#firebaseWarning");

emailInput.value = adminEmail;

let auth;
let db;
let unsubscribeEnquiries = null;

function showError(message) {
  loginMessage.textContent = message;
  loginMessage.className = "loginmsg error";
}

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      login.classList.add("hidden");
      dashboard.classList.remove("hidden");
      logoutButton.classList.remove("hidden");
      loadEnquiries();
    } else {
      login.classList.remove("hidden");
      dashboard.classList.add("hidden");
      logoutButton.classList.add("hidden");
      if (unsubscribeEnquiries) {
        unsubscribeEnquiries();
        unsubscribeEnquiries = null;
      }
      list.innerHTML = "";
      count.textContent = "0";
    }
  });
} catch (error) {
  console.error("Firebase initialisation failed:", error);
  firebaseWarning.classList.remove("hidden");
  showError("The admin system could not connect to Firebase. Check the Firebase setup.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!auth) {
    showError("Firebase is not connected yet. Check the Firebase setup.");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Signing in…";
  loginMessage.textContent = "";

  try {
    await signInWithEmailAndPassword(
      auth,
      adminEmail,
      passwordInput.value
    );
    passwordInput.value = "";
  } catch (error) {
    console.error("Admin sign-in failed:", error);

    const code = error?.code || "";

    if (code.includes("invalid-credential") || code.includes("wrong-password")) {
      showError("Incorrect admin password.");
    } else if (code.includes("user-not-found")) {
      showError("The Culley's admin account has not been created in Firebase Authentication yet.");
    } else if (code.includes("operation-not-allowed")) {
      showError("Email/password sign-in is not enabled in Firebase Authentication.");
    } else if (code.includes("unauthorized-domain")) {
      showError("This website address is not authorised in Firebase Authentication.");
      firebaseWarning.classList.remove("hidden");
    } else {
      showError("Unable to sign in. Please check the Firebase setup.");
    }
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign in →";
  }
});

logoutButton.addEventListener("click", async () => {
  if (auth) await signOut(auth);
});

function loadEnquiries() {
  const enquiriesQuery = query(
    collection(db, "enquiries"),
    orderBy("createdAt", "desc")
  );

  unsubscribeEnquiries = onSnapshot(
    enquiriesQuery,
    (snapshot) => {
      count.textContent = snapshot.size;
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = '<div class="empty-state"><h3>No enquiries yet.</h3><p>New website enquiries will appear here automatically.</p></div>';
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
              <small><a class="enquiry-email" href="mailto:${encodeURIComponent(enquiry.email || "")}">${escapeHtml(enquiry.email)}</a></small>
            </div>
            <button type="button" class="delete-enquiry">Delete</button>
          </div>
          <div class="enqmeta">
            ${escapeHtml(enquiry.service)} · <a class="enquiry-phone" href="tel:${encodeURIComponent(enquiry.phone || "")}">${escapeHtml(enquiry.phone)}</a> · ${date}
          </div>
          <p>${escapeHtml(enquiry.message)}</p>
        `;

        article.querySelector(".delete-enquiry").addEventListener("click", async () => {
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
      console.error("Ordered enquiry query failed:", error);

      // Fall back to an unordered collection read. This also handles
      // older/test documents that may not contain createdAt.
      if (unsubscribeEnquiries) {
        unsubscribeEnquiries();
      }

      unsubscribeEnquiries = onSnapshot(
        collection(db, "enquiries"),
        (snapshot) => {
          count.textContent = snapshot.size;
          list.innerHTML = "";

          if (snapshot.empty) {
            list.innerHTML = '<div class="empty-state"><h3>No enquiries yet.</h3><p>New website enquiries will appear here automatically.</p></div>';
            return;
          }

          const documents = [...snapshot.docs].sort((a, b) => {
            const aTime = a.data().createdAt?.toMillis?.() || 0;
            const bTime = b.data().createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          });

          documents.forEach((documentSnapshot) => {
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
                <button type="button" class="delete-enquiry">Delete</button>
              </div>
              <div class="enqmeta">
                ${escapeHtml(enquiry.service)} · <a class="enquiry-phone" href="tel:${encodeURIComponent(enquiry.phone || "")}">${escapeHtml(enquiry.phone)}</a> · ${date}
              </div>
              <p>${escapeHtml(enquiry.message)}</p>
            `;

            article.querySelector(".delete-enquiry").addEventListener("click", async () => {
              if (!confirm("Delete this enquiry?")) return;
              try {
                await deleteDoc(doc(db, "enquiries", documentSnapshot.id));
              } catch (deleteError) {
                console.error("Could not delete enquiry:", deleteError);
                alert("The enquiry could not be deleted.");
              }
            });

            list.appendChild(article);
          });
        },
        (fallbackError) => {
          console.error("Could not load enquiries:", fallbackError);
          list.innerHTML = '<div class="empty-state"><h3>Unable to load enquiries.</h3><p>Your admin login is working, but Firestore is not allowing this account to read the enquiries. Check the Firestore rules.</p></div>';
        }
      );
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
