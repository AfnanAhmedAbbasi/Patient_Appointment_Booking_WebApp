import { supabase } from "./supabase.js";

const appointmentsContainer = document.getElementById("appointmentsContainer");

document.getElementById("homeLink").onclick = () => (window.location.href = "index.html");
document.getElementById("bookAppointmentLink").onclick = () => (window.location.href = "book_appointment.html");
document.getElementById("appointmentsLink").onclick = () => (window.location.href = "appointments.html");

async function fetchAppointments() {
    const { data, error } = await supabase.from("appointments").select("*");

    if (error) {
        console.error("Error fetching appointments:", error.message);
        return;
    }

    renderAppointments(data);
}

function renderAppointments(appointments) {
    appointmentsContainer.innerHTML = "";

    if (!appointments || appointments.length === 0) {
        appointmentsContainer.innerHTML = `<p>No appointments found.</p>`;
        return;
    }

    appointments.forEach((appt) => {
        const date = new Date(appt.created_at);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        console.log(formattedDate);
        
        const card = document.createElement("div");
        card.classList.add("appointment-card");

        card.innerHTML = `
      <div class="card-header">${appt.doctor_name}</div>
      <div class="card-details">
        <p><strong>User Name:</strong> ${appt.user_name}</p>
        <p><strong>Email:</strong> ${appt.user_email}</p>
        <p><strong>Doctor:</strong> ${appt.doctor_name}</p>
        <p><strong>Specialization:</strong> ${appt.doctor_specialization || "General"}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Status:</strong> <span class="status">Booked</span></p>
      </div>
      <button class="delete-btn" data-id="${appt.id}">Cancel</button>
    `;

        card.querySelector(".delete-btn").addEventListener("click", async () => {
            await deleteAppointment(appt.id);
        });

        appointmentsContainer.appendChild(card);
    });
}

async function deleteAppointment(id) {
    const confirmDelete = confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
        alert("Error deleting appointment.");
        console.error(error.message);
        return;
    }
    alert("Appointment deleted!");
    fetchAppointments(); 
}

setInterval(fetchAppointments, 100000);

fetchAppointments();
