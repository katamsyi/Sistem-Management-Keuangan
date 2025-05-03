const USER_ID = localStorage.getItem("user_id");
if (!USER_ID) {
  alert("Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

const form = document.getElementById("form-transaksi");
const listContainer = document.getElementById("transaction-list");
const submitButton = form.querySelector("button[type='submit']");
let currentId = null;
let lastData = [];

async function loadCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    const categories = res.data;
    const categorySelect = document.getElementById("category_id");
    categorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Gagal ambil kategori:", err.message);
  }
}

async function getTransactions() {
  try {
    const res = await axios.get(`${BASE_URL}/transactions/${USER_ID}`);
    const data = res.data;
    lastData = data;
    listContainer.innerHTML = "";

    if (data.length === 0) {
      listContainer.innerHTML = "<p>Belum ada transaksi.</p>";
      tampilkanRingkasan([]);
      return;
    }

    data.forEach((trx) => {
      const kategori = trx.category ? trx.category.name : "-";
      const div = document.createElement("div");
      div.className = `transaction ${trx.type}`;
      div.innerHTML = `
        <p><strong>${trx.tanggal}</strong> - ${trx.type} - Rp${Number(
        trx.amount
      ).toLocaleString()} - ${trx.description} <em>(${kategori})</em></p>
        <button onclick="editTransaction(${trx.id})">Edit</button>
        <button onclick="deleteTransaction(${trx.id})">Hapus</button>
      `;
      listContainer.appendChild(div);
    });

    tampilkanRingkasan(data);
  } catch (err) {
    console.error("Gagal ambil transaksi:", err.message);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    user_id: USER_ID,
    tanggal: document.getElementById("tanggal").value,
    type: document.getElementById("type").value,
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value,
    category_id: document.getElementById("category_id").value,
  };

  if (!data.tanggal || !data.type || !data.amount || !data.category_id) {
    alert("Harap lengkapi semua kolom.");
    return;
  }

  if (parseFloat(data.amount) <= 0) {
    alert("Jumlah harus lebih dari 0.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = currentId ? "Menyimpan..." : "Menambahkan...";

  try {
    if (currentId) {
      await axios.put(`${BASE_URL}/transactions/${currentId}`, data);
      currentId = null;
    } else {
      await axios.post(`${BASE_URL}/transactions`, data);
    }

    form.reset();
    submitButton.textContent = "Simpan";
    getTransactions();
    window.scrollTo({ top: 0, behavior: "smooth" });
    alert("Transaksi berhasil disimpan.");
  } catch (err) {
    console.error("Gagal simpan:", err.message);
    alert("Gagal menyimpan transaksi.");
  } finally {
    submitButton.disabled = false;
  }
});

async function deleteTransaction(id) {
  const yakin = confirm("Yakin ingin menghapus transaksi ini?");
  if (!yakin) return;

  try {
    await axios.delete(`${BASE_URL}/transactions/${id}`);
    getTransactions();
  } catch (err) {
    console.error("Gagal hapus:", err.message);
  }
}

function editTransaction(id) {
  const trx = lastData.find((t) => t.id === id);
  if (!trx) return;

  document.getElementById("tanggal").value = trx.tanggal;
  document.getElementById("type").value = trx.type;
  document.getElementById("amount").value = trx.amount;
  document.getElementById("description").value = trx.description;
  document.getElementById("category_id").value = trx.category_id;
  currentId = id;
  submitButton.textContent = "Update";
}

function tampilkanRingkasan(data) {
  let income = 0;
  let expense = 0;

  data.forEach((trx) => {
    if (trx.type === "income") income += parseFloat(trx.amount);
    else if (trx.type === "expense") expense += parseFloat(trx.amount);
  });

  const saldo = income - expense;

  document.getElementById("total-income").textContent =
    "Rp" + income.toLocaleString();
  document.getElementById("total-expense").textContent =
    "Rp" + expense.toLocaleString();
  document.getElementById("saldo-akhir").textContent =
    "Rp" + saldo.toLocaleString();
}

getTransactions();
loadCategories();
