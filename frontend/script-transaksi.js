//const USER_ID = localStorage.getItem("user_id");
if (!USER_ID) {
  alert("Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "login.html"; // redirect jika belum login
}

console.log("USER_ID:", USER_ID);

const form = document.getElementById("form-transaksi");
const listContainer = document.getElementById("transaction-list");

let currentId = null;
let lastData = [];

async function loadCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    const categories = res.data;
    console.log("Kategori dari backend:", categories); // 👈 CEK INI DI CONSOLE

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

// Ambil & tampilkan transaksi
async function getTransactions() {
  try {
    const res = await axios.get(`${BASE_URL}/transactions/${USER_ID}`);
    const data = res.data;
    lastData = data;

    console.log("DATA DARI BACKEND:", data);

    listContainer.innerHTML = "";

    if (data.length === 0) {
      listContainer.innerHTML = "<p>Belum ada transaksi.</p>";
      tampilkanRingkasan([]);
      return;
    }

    data.forEach((trx) => {
      const div = document.createElement("div");

      // ambil nama kategori dari relasi jika ada
      const kategori = trx.category ? trx.category.name : "-";

      div.innerHTML = `
        <p><strong>${trx.tanggal}</strong> - ${trx.type} - Rp${Number(
        trx.amount
      ).toLocaleString()} - ${trx.description} 
        <em>(${kategori})</em></p>
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

// Tambah atau update
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

  try {
    if (currentId) {
      await axios.put(`${BASE_URL}/transactions/${currentId}`, data);
      currentId = null;
    } else {
      await axios.post(`${BASE_URL}/transactions`, data);
    }

    form.reset();
    document.querySelector("button[type='submit']").textContent = "Simpan";
    getTransactions();
  } catch (err) {
    console.error("Gagal simpan:", err.message);
  }
});

// Hapus
async function deleteTransaction(id) {
  try {
    await axios.delete(`${BASE_URL}/transactions/${id}`);
    getTransactions();
  } catch (err) {
    console.error("Gagal hapus:", err.message);
  }
}

// Edit
function editTransaction(id) {
  const trx = lastData.find((t) => t.id === id);
  if (!trx) {
    console.error("Transaksi tidak ditemukan:", id);
    return;
  }

  console.log("Edit klik untuk ID:", id);

  document.getElementById("tanggal").value = trx.tanggal;
  document.getElementById("type").value = trx.type;
  document.getElementById("amount").value = trx.amount;
  document.getElementById("description").value = trx.description;

  currentId = id;
  document.querySelector("button[type='submit']").textContent = "Update";
}

// Ringkasan saldo
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

// Muat saat pertama
getTransactions();
loadCategories(); // langsung panggil saja
console.log("loadCategories dipanggil!");
