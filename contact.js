import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig); const db=getFirestore(app);
const form=document.getElementById("contactForm"), status=document.getElementById("formStatus");
form?.addEventListener("submit",async e=>{e.preventDefault();const btn=form.querySelector("button");btn.disabled=true;status.textContent="Sending enquiry…";const data=Object.fromEntries(new FormData(form).entries());data.createdAt=serverTimestamp();data.status="New";try{await addDoc(collection(db,"enquiries"),data);form.reset();status.textContent="Thanks — your enquiry has been sent. We'll be in touch."; }catch(err){console.error(err);status.textContent="Sorry, we couldn't send your enquiry. Please call us instead."}finally{btn.disabled=false}});
