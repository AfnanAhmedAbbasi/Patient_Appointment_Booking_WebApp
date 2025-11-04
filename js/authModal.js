import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const showLogin = document.getElementById("showLogin");
  const showSignup = document.getElementById("showSignup");
  const closeButtons = document.querySelectorAll(".close");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  const signupName = document.getElementById("signupName");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupBtn = document.getElementById("signupBtn");
  const signupError = document.getElementById("signupError");

  const bookLink = document.querySelector(".book_appointment_link"); 

  bookLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "flex";
    document.body.classList.add("modal-open");
  });

  showSignup.addEventListener("click", () => {
    loginModal.style.display = "none";
    signupModal.style.display = "flex";
    loginError.textContent = ""; 
  });

  showLogin.addEventListener("click", () => {
    signupModal.style.display = "none";
    loginModal.style.display = "flex";
    signupError.textContent = ""; 
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      loginModal.style.display = "none";
      signupModal.style.display = "none";
      document.body.classList.remove("modal-open");
      loginError.textContent = "";
      signupError.textContent = "";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal || e.target === signupModal) {
      loginModal.style.display = "none";
      signupModal.style.display = "none";
      document.body.classList.remove("modal-open");
      loginError.textContent = "";
      signupError.textContent = "";
    }
  });

  loginBtn.addEventListener("click", async () => {
    loginError.textContent = "";

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      loginError.textContent = "Please fill in all fields!";
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        loginError.textContent = error.message;
        return;
      }

      window.location.href = "book_appointment.html";
    } catch (err) {
      loginError.textContent = "Something went wrong. Try again!";
      console.error(err);
    }
  });

  signupBtn.addEventListener("click", async () => {
    signupError.textContent = "";

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();

    if (!name || !email || !password) {
      signupError.textContent = "Please fill in all fields!";
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });

      if (error) {
        signupError.textContent = error.message;
        return;
      }

      signupModal.style.display = "none";
      loginModal.style.display = "flex";
      loginEmail.value = email;
      loginPassword.value = password;
      signupError.textContent = "";
      loginError.textContent = "Account created! Please login.";
    } catch (err) {
      signupError.textContent = "Something went wrong. Try again!";
      console.error(err);
    }
  });
});
