// script-goals.js
const USER_ID = localStorage.getItem("user_id");
if (!USER_ID) {
  alert("Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

const form = document.getElementById("goal-form");
const list = document.getElementById("goal-list");
let currentGoalId = null;

async function fetchGoals() {
  try {
    const res = await axios.get(`${BASE_URL}/goals/${USER_ID}`);
    const data = res.data;
    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = "<p>Belum ada target keuangan.</p>";
      return;
    }

    data.forEach((goal) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${
          goal.name
        }</strong> - Target: Rp${goal.target_amount.toLocaleString()} - Terkumpul: Rp${goal.current_amount.toLocaleString()} - Jatuh Tempo: ${
        goal.due_date
      }</p>
        <button onclick="editGoal(${goal.id})">Edit</button>
        <button onclick="deleteGoal(${goal.id})">Hapus</button>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal ambil goals:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    user_id: USER_ID,
    name: document.getElementById("name").value,
    target_amount: document.getElementById("target_amount").value,
    current_amount: document.getElementById("current_amount").value,
    due_date: document.getElementById("due_date").value,
  };

  try {
    if (currentGoalId) {
      await axios.put(`${BASE_URL}/goals/${currentGoalId}`, data);
      currentGoalId = null;
    } else {
      await axios.post(`${BASE_URL}/goals`, data);
    }
    form.reset();
    document.querySelector("button[type='submit']").textContent = "Simpan";
    fetchGoals();
  } catch (err) {
    console.error("Gagal simpan goal:", err);
  }
});

function editGoal(id) {
  axios.get(`${BASE_URL}/goals/${USER_ID}`).then((res) => {
    const goal = res.data.find((g) => g.id === id);
    if (!goal) return;
    document.getElementById("name").value = goal.name;
    document.getElementById("target_amount").value = goal.target_amount;
    document.getElementById("current_amount").value = goal.current_amount;
    document.getElementById("due_date").value = goal.due_date;
    currentGoalId = id;
    document.querySelector("button[type='submit']").textContent = "Update";
  });
}

async function deleteGoal(id) {
  try {
    await axios.delete(`${BASE_URL}/goals/${id}`);
    fetchGoals();
  } catch (err) {
    console.error("Gagal hapus goal:", err);
  }
}

function logout() {
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", fetchGoals);
