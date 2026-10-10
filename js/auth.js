import { auth, setCurrentUser, db, firebaseReady, currentUser } from './firebase-config.js';
import { saveCart } from './cart.js';
import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, GoogleAuthProvider, onAuthStateChanged,
    signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

function showFieldError(inputId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(inputId + 'Err');
    if (input) input.classList.add('error');
    if (err) { err.textContent = msg; err.classList.add('show'); }
}

function clearErrors() {
    document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    document.querySelectorAll('.form-error').forEach(e => { e.textContent = ''; e.classList.remove('show'); });
}

function updateAuthUI(user) {
    setCurrentUser(user);
    const btn = document.getElementById('authBtn');
    const ml = document.getElementById('mobileAuthLink');
    if (user) {
        const name = user.displayName || 'Account';
        if (btn) btn.innerHTML = `<i class="fas fa-user-check"></i><span class="btn-text">${name}</span>`;
        if (ml) {
            ml.textContent = 'Logout';
            ml.href = '#';
            ml.onclick = (e) => { e.preventDefault(); handleLogout(); if (typeof window.closeMobile === 'function') window.closeMobile(); };
        }
    } else {
        if (btn) btn.innerHTML = `<i class="fas fa-user"></i><span class="btn-text">Login</span>`;
        if (ml) { ml.textContent = 'Login'; ml.href = 'login.html'; ml.onclick = null; }
    }
}

function syncCartAfterLogin(user) {
    if (firebaseReady && db) {
        const cartRef = ref(db, 'carts/' + user.uid);
        get(cartRef).then(snap => {
            if (snap.exists() && snap.val()) {
                const saved = snap.val();
                if (Array.isArray(saved) && saved.length) {
                    localStorage.setItem('cart_' + user.uid, JSON.stringify(saved));
                }
            } else {
                const guestCart = localStorage.getItem('cart_guest');
                if (guestCart) {
                    localStorage.setItem('cart_' + user.uid, guestCart);
                    set(ref(db, 'carts/' + user.uid), JSON.parse(guestCart)).catch(() => {});
                    localStorage.removeItem('cart_guest');
                }
            }
        }).catch(() => {});
    }
}

function onAuthSuccess(user) {
    updateAuthUI(user);
    syncCartAfterLogin(user);
    if (typeof Swal !== 'undefined') {
        Swal.fire({ icon:'success', title:'Welcome!', text:user.displayName ? `Hello, ${user.displayName}` : 'Logged in successfully', confirmButtonColor:'#0284C7', timer:2000, timerProgressBar:true, showConfirmButton:false, background:'#fff' });
    }
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
}

function handleLogin(e) {
    e.preventDefault();
    clearErrors();
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    let valid = true;
    if (!email) { showFieldError('loginEmail', 'Email is required'); valid = false; }
    if (!password) { showFieldError('loginPassword', 'Password is required'); valid = false; }
    if (!valid) return;

    signInWithEmailAndPassword(auth, email, password)
        .then(c => onAuthSuccess(c.user))
        .catch(err => {
            if (err.code === 'auth/invalid-email') {
                showFieldError('loginEmail', 'Invalid email format.');
            } else if (err.code === 'auth/too-many-requests') {
                showFieldError('loginPassword', 'Too many attempts. Wait 1 minute and try again.');
            } else {
                // invalid-credential, wrong-password, user-not-found — sab ke liye ek hi message
                showFieldError('loginPassword', 'Incorrect email or password. If new, please sign up first.');
            }
        });
}

function handleSignup(e) {
    e.preventDefault();
    clearErrors();
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    let valid = true;
    if (!name) { showFieldError('signupName', 'Name is required'); valid = false; }
    if (!email) { showFieldError('signupEmail', 'Email is required'); valid = false; }
    if (!password) { showFieldError('signupPassword', 'Password is required'); valid = false; }
    else if (password.length < 6) { showFieldError('signupPassword', 'Minimum 6 characters required'); valid = false; }
    if (!valid) return;
    createUserWithEmailAndPassword(auth, email, password)
        .then(c => updateProfile(c.user, { displayName: name }).then(() => onAuthSuccess(c.user)))
        .catch(err => {
            const code = err.code;
            if (code === 'auth/email-already-in-use') showFieldError('signupEmail', 'This email is already registered. Try logging in.');
            else if (code === 'auth/weak-password') showFieldError('signupPassword', 'Password is too weak.');
            else if (code === 'auth/invalid-email') showFieldError('signupEmail', 'Invalid email format.');
            else showFieldError('signupEmail', 'Signup failed. Please try again.');
        });
}

function handleGoogleLogin() {
    signInWithPopup(auth, new GoogleAuthProvider())
        .then(r => onAuthSuccess(r.user))
        .catch(err => {
            if (err.code === 'auth/popup-closed-by-user') return;
            if (typeof Swal !== 'undefined') {
                let msg = 'Google login failed. Try again.';
                if (err.code === 'auth/popup-blocked') msg = 'Popup was blocked. Allow popups for this site.';
                if (err.code === 'auth/cancelled-popup-request') msg = 'Another popup is already open.';
                Swal.fire({ icon:'error', title:'Error', text:msg, confirmButtonColor:'#0284C7', background:'#fff' });
            }
        });
}

function handleLogout() {
    signOut(auth).then(() => {
        updateAuthUI(null);
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon:'success', title:'Logged Out', timer:1500, timerProgressBar:true, showConfirmButton:false, confirmButtonColor:'#0284C7', background:'#fff' });
        }
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
    }).catch(() => {});
}

function handleAuthClick() {
    if (currentUser) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title:'My Account',
                html:`<p style="color:#64748B;font-size:.9rem;">Logged in as<br><strong style="color:#0F172A;font-size:1rem;">${currentUser.displayName || currentUser.email}</strong></p>`,
                background:'#fff', color:'#0F172A',
                showCancelButton:true,
                confirmButtonText:'<i class="fas fa-sign-out-alt"></i> Logout',
                cancelButtonText:'Cancel',
                confirmButtonColor:'#EF4444',
                cancelButtonColor:'#64748B'
            }).then(r => { if (r.isConfirmed) handleLogout(); });
        }
    } else {
        window.location.href = 'login.html';
    }
}

onAuthStateChanged(auth, user => updateAuthUI(user));

export { handleLogin, handleSignup, handleGoogleLogin, handleLogout, handleAuthClick, showFieldError, clearErrors };