import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZclMyZvRytrXtP5wNCQfTSHGbxE0QsQQ",
    authDomain: "fm-shoes-28854.firebaseapp.com",
    projectId: "fm-shoes-28854",
    storageBucket: "fm-shoes-28854.firebasestorage.app",
    messagingSenderId: "978621369885",
    appId: "1:978621369885:web:dc54190e9a06359880c0f4",
    measurementId: "G-470LM9KQ4C",
    databaseURL: "https://fm-shoes-28854-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let db = null;
let firebaseReady = false;
try {
    db = getDatabase(app);
    firebaseReady = true;
} catch(e) {
    console.warn("Firebase DB not available — localStorage fallback.", e.message);
}

const WHATSAPP_NUMBER = "923152995797";

const EMAILJS_SERVICE_ID = "service_u0j9tja";
const EMAILJS_TEMPLATE_ID = "template_doxe4xw";
const EMAILJS_PUBLIC_KEY = "dIc-pfo-rSoJgTagJ";

let currentUser = null;
function setCurrentUser(user) { currentUser = user; }

export { auth, db, firebaseReady, WHATSAPP_NUMBER, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, currentUser, setCurrentUser };