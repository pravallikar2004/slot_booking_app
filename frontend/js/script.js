const API_URL = "http://127.0.0.1:5000/api";

// Load slots based on selected date
function loadSlots() {
  const container = document.getElementById("slots");
  const date = document.getElementById("datePicker").value;

  // ❗ check if date selected
  if (!date) {
    alert("Please select a date");
    return;
  }

  // clear previous data
  container.innerHTML = "";

  fetch(API_URL + "/slots?date=" + date)
    .then(res => res.json())
    .then(data => {

      // ❗ if no slots
      if (data.length === 0) {
        container.innerHTML = "<p>No slots available for this date</p>";
        return;
      }

      // create UI
      data.forEach(slot => {
        let div = document.createElement("div");
        div.className = "card";

        if (slot.booked) {
          div.innerHTML = `
            <strong>${slot.time_slot}</strong>
            <p class="booked">Booked by ${slot.booked_by}</p>
          `;
        } else {
          div.innerHTML = `
            <strong>${slot.time_slot}</strong><br>
            <input type="text" placeholder="Your name" id="name-${slot.id}">
            <button onclick="bookSlot(${slot.id})">Book</button>
          `;
        }

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Error loading slots</p>";
    });
}


// Book slot
function bookSlot(id) {
  const nameInput = document.getElementById(`name-${id}`);
  const name = nameInput.value;

  if (!name) {
    alert("Please enter your name");
    return;
  }

  fetch(API_URL + "/book/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    loadSlots(); // reload slots
  })
  .catch(err => console.error(err));
}
// Load booked slots
function loadBookedSlots() {
  const container = document.getElementById("bookedSlots");
  const date = document.getElementById("datePicker").value;

  if (!date) {
    alert("Please select a date");
    return;
  }

  container.innerHTML = "";

  fetch(API_URL + "/slots?date=" + date)
    .then(res => res.json())
    .then(data => {

      const booked = data.filter(slot => slot.booked);

      if (booked.length === 0) {
        container.innerHTML = "<p>No booked slots</p>";
        return;
      }

      booked.forEach(slot => {
        let div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <strong>${slot.time_slot}</strong>
          <p class="booked">Booked by ${slot.booked_by}</p>
        `;

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Error loading booked slots</p>";
    });
}

// OPTIONAL: auto-load today's date
window.onload = () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("datePicker").value = today;
};