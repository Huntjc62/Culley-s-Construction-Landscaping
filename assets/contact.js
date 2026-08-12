import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.querySelector("#enquiryForm");
const message = document.querySelector("#formMessage");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = form.querySelector("button");
  button.disabled = true;
  message.className = "";
  message.textContent = "Sending your enquiry…";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    await addDoc(collection(db, "enquiries"), {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      service: data.service,
      message: data.message.trim(),
      status: "New",
      createdAt: serverTimestamp()
    });

    form.reset();
    message.className = "success";
    message.textContent = "Thanks — your enquiry has been sent. We will be in touch.";
  } catch (error) {
    console.error("Culley's enquiry submission failed:", error);
    message.className = "error";
    message.textContent = "We could not send your enquiry. Please call us instead.";
  } finally {
    button.disabled = false;
  }
});
