import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const doctorContainer = document.getElementById("doctorCardsContainer");
  const bookingModal = document.getElementById("bookingModal");
  const closeBtn = bookingModal.querySelector(".close");

  // Modal input fields
  const modalDoctorName = document.getElementById("modalDoctorName");
  const modalDoctorDay = document.getElementById("modalDoctorDay");
  const modalDoctorTime = document.getElementById("modalDoctorTime");

  const bookingForm = document.getElementById("bookingForm");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const reasonInput = document.getElementById("reason");
  const bookingError = document.getElementById("bookingError");
  const timeSlotSelect = document.getElementById("timeSlot");

  let selectedDoctorSpecialization = "";

  const SLOT_MAP = {
    "": { days: "", time: "" },
    "MWF_9AM_11AM": { days: "Mon, Wed, Fri", time: "9am - 11am" },
    "MWF_7PM_9PM": { days: "Mon, Wed, Fri", time: "7pm - 9pm" },
    "TTS_9AM_11AM": { days: "Tue, Thu, Sat", time: "9am - 11am" },
    "TTS_7PM_9PM": { days: "Tue, Thu, Sat", time: "7pm - 9pm" },
  };

  const { data: doctors, error } = await supabase.from("doctors").select("*");
  if (error) {
    console.error("Error fetching doctors:", error);
    return;
  }

  doctors.forEach((doc) => {
    const card = document.createElement("div");
    card.classList.add("doctor_card1");
    card.dataset.days = doc.available_days;
    card.dataset.time = doc.available_time;

    card.innerHTML = `
      <div class="doc_image">
        <img src="${doc.image_url}" alt="${doc.name}" />
      </div>
      <div class="doc_info">
        <div class="doc_name">${doc.name}</div>
        <div class="doc_kind">${doc.specialization}</div>
      </div>
      <div class="doc_info2">
        <div><span>Experience:</span> ${doc.experience} years</div>
        <div><span>Available Days:</span> ${doc.available_days}</div>
      </div>
      <div class="doc_timing">
        <div><span>Available Time Slots:</span></div>
        <div>${doc.available_time}</div>
      </div>
      <div class="bookapp_btn">
        <button class="bookDoctorBtn">Book Appointment</button>
      </div>
    `;

    const bookBtn = card.querySelector(".bookDoctorBtn");
    bookBtn.addEventListener("click", () => {
      modalDoctorName.value = doc.name;
      modalDoctorDay.value = doc.available_days;
      modalDoctorTime.value = doc.available_time;

      selectedDoctorSpecialization = doc.specialization;

      bookingModal.style.display = "flex";
      document.body.classList.add("modal-open");
    });

    doctorContainer.appendChild(card);
  });

  timeSlotSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    const { days, time } = SLOT_MAP[val] || {};

    document.querySelectorAll(".doctor_card1").forEach((card) => {
      const cardDays = card.dataset.days;
      const cardTime = card.dataset.time;

      if (!val) {
        card.style.display = "";
      } else if (cardDays === days && cardTime === time) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });

  const closeModal = () => {
    bookingModal.style.display = "none";
    document.body.classList.remove("modal-open");
    bookingForm.reset();
    bookingError.textContent = "";
    bookingError.style.color = "red";
  };

  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === bookingModal) closeModal();
  });

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    bookingError.textContent = "";
    bookingError.style.color = "red";

    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const reason = reasonInput.value.trim();
    const doctorName = modalDoctorName.value;
    const doctorDay = modalDoctorDay.value;
    const doctorTime = modalDoctorTime.value;

    if (userName.length < 3) {
      bookingError.textContent = "Name must be at least 3 characters long.";
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(userEmail)) {
      bookingError.textContent = "Please enter a valid email address.";
      return;
    }

    if (reason.length < 10) {
      bookingError.textContent = "Reason should be at least 10 characters.";
      return;
    }

    if (!doctorName || !doctorDay || !doctorTime) {
      bookingError.textContent = "Doctor details are missing.";
      return;
    }

    const { error: insertError } = await supabase.from("appointments").insert([
      {
        doctor_name: doctorName,
        doctor_day: doctorDay,
        doctor_time: doctorTime,
        doctor_specialization: selectedDoctorSpecialization,
        user_name: userName,
        user_email: userEmail,
        reason: reason,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      bookingError.textContent = "Failed to book appointment. Try again.";
      return;
    }

    bookingError.style.color = "green";
    bookingError.textContent = "Appointment booked successfully!";

    setTimeout(() => {
      closeModal();
    }, 1500);
  });
});
