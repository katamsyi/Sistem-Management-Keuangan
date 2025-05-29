(() => {
  const BASE_URL = "http://localhost:5000";
  const USER_ID = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!token || !USER_ID) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "login.html";
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
  }

  document.getElementById("logout-btn")?.addEventListener("click", logout);

  const form = document.getElementById("form-goal");
  const submitButton = form.querySelector("button[type='submit']");
  const goalList = document.getElementById("goal-list");
  let currentId = null;
  let lastData = [];

  async function getGoals() {
    try {
      const res = await axios.get(`${BASE_URL}/goals/${USER_ID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      lastData = res.data;

      if (!goalList) return;

      if (lastData.length === 0) {
        goalList.innerHTML = "<p>Belum ada target keuangan.</p>";
        return;
      }

      goalList.innerHTML = "";
      lastData.forEach((goal) => {
        const div = document.createElement("div");
        div.className = "goal-item";
        div.innerHTML = `
          <h3>${goal.name}</h3>
          <p>Target: Rp${Number(goal.target_amount).toLocaleString()}</p>
          <p>Saat ini: Rp${Number(goal.current_amount).toLocaleString()}</p>
          <p>Batas waktu: ${goal.due_date}</p>
          <button onclick="editGoal(${goal.id})">✏️ Edit</button>
          <button onclick="deleteGoal(${goal.id})">🗑️ Hapus</button>
        `;
        goalList.appendChild(div);
      });
    } catch (error) {
      console.error("Gagal ambil target:", error);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      user_id: USER_ID,
      name: document.getElementById("name").value.trim(),
      target_amount: document.getElementById("target_amount").value,
      current_amount: document.getElementById("current_amount").value,
      due_date: document.getElementById("due_date").value,
    };

    if (!data.name || !data.target_amount || !data.due_date) {
      alert("Harap lengkapi semua kolom wajib.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = currentId ? "Menyimpan..." : "Menambahkan...";

    try {
      if (currentId) {
        await axios.put(`${BASE_URL}/goals/${currentId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        currentId = null;
      } else {
        await axios.post(`${BASE_URL}/goals`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      form.reset();
      submitButton.textContent = "Simpan";
      getGoals();
      alert("Target keuangan berhasil disimpan.");
    } catch (error) {
      console.error("Gagal simpan target:", error);
      alert("Gagal menyimpan target.");
    } finally {
      submitButton.disabled = false;
    }
  });

  async function deleteGoal(id) {
    if (!confirm("Yakin ingin menghapus target ini?")) return;

    try {
      await axios.delete(`${BASE_URL}/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getGoals();
    } catch (error) {
      console.error("Gagal hapus target:", error);
      alert("Gagal menghapus target.");
    }
  }

  // Buat editGoal sebagai global supaya bisa dipanggil dari HTML
  window.editGoal = function (id) {
    const goal = lastData.find((g) => g.id === id);
    if (!goal) return;

    document.getElementById("name").value = goal.name;
    document.getElementById("target_amount").value = goal.target_amount;
    document.getElementById("current_amount").value = goal.current_amount;
    document.getElementById("due_date").value = goal.due_date;
    currentId = id;
    submitButton.textContent = "Update";
  };

  // Fungsi deleteGoal juga harus global
window.deleteGoal = async function (id) {
  if (!confirm("Yakin ingin menghapus target ini?")) return;

  try {
    await axios.delete(`${BASE_URL}/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getGoals();
  } catch (error) {
    console.error("Gagal hapus target:", error);
    alert("Gagal menghapus target.");
  }
};

  getGoals();
})();
