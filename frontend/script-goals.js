//const USER_ID = localStorage.getItem("user_id");
if (!USER_ID) {
  alert("Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

const form = document.getElementById("form-goal");
const goalList = document.getElementById("goal-list");

let currentId = null;

async function getGoals() {
  try {
    const res = await axios.get(`${BASE_URL}/goals/${USER_ID}`);
    const goals = res.data;
    goalList.innerHTML = "";

    if (goals.length === 0) {
      goalList.innerHTML = "<p>Belum ada target keuangan.</p>";
      return;
    }

    goals.forEach((goal) => {
      const div = document.createElement("div");
      div.className = "goal-item";
      div.innerHTML = `
        <p><strong>${goal.name}</strong> | Target: Rp${Number(
        goal.target_amount
      ).toLocaleString()} | 
        Saat ini: Rp${Number(goal.current_amount).toLocaleString()} <br/>
        Tanggal Target: ${goal.due_date}</p>
        <div class="actions">
          <button onclick="editGoal(${goal.id})">Edit</button>
          <button onclick="deleteGoal(${goal.id})">Hapus</button>
        </div>
      `;
      goalList.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal ambil data goals:", err.message);
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
    if (currentId) {
      await axios.put(`${BASE_URL}/goals/${currentId}`, data);
      currentId = null;
    } else {
      await axios.post(`${BASE_URL}/goals`, data);
    }

    form.reset();
    document.querySelector("button[type='submit']").textContent = "Simpan";
    getGoals();
  } catch (err) {
    console.error("Gagal simpan goal:", err.message);
  }
});

function editGoal(id) {
  axios
    .get(`${BASE_URL}/goals/${USER_ID}`)
    .then((res) => {
      const goal = res.data.find((g) => g.id === id);
      if (!goal) return;

      document.getElementById("name").value = goal.name;
      document.getElementById("target_amount").value = goal.target_amount;
      document.getElementById("current_amount").value = goal.current_amount;
      document.getElementById("due_date").value = goal.due_date;
      currentId = id;

      document.querySelector("button[type='submit']").textContent = "Update";
    })
    .catch((err) => {
      console.error("Gagal ambil data goal:", err.message);
    });
}

function deleteGoal(id) {
  axios
    .delete(`${BASE_URL}/goals/${id}`)
    .then(() => getGoals())
    .catch((err) => console.error("Gagal hapus goal:", err.message));
}

function logout() {
  localStorage.removeItem("user_id");
  window.location.href = "login.html";
}

// Inisialisasi
getGoals();
