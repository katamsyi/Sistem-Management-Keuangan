const BASE_URL = "http://localhost:5000";
const daftarKategori = document.getElementById("daftar-kategori");
const form = document.getElementById("form-kategori");
const inputNama = document.getElementById("nama-kategori");

let editingId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = inputNama.value.trim();

  try {
    if (editingId) {
      await axios.put(`${BASE_URL}/categories/${editingId}`, { name: nama });
      editingId = null;
    } else {
      await axios.post(`${BASE_URL}/categories`, { name: nama });
    }
    inputNama.value = "";
    tampilkanKategori();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err.message);
  }
});

async function tampilkanKategori() {
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    daftarKategori.innerHTML = "";
    res.data.forEach((kat) => {
      const div = document.createElement("div");
      div.classList.add("kategori-item");
      div.innerHTML = `
        <strong>${kat.name}</strong>
        <button onclick="editKategori(${kat.id}, '${kat.name}')">Edit</button>
        <button onclick="hapusKategori(${kat.id})">Hapus</button>
      `;
      daftarKategori.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal menampilkan kategori:", err.message);
  }
}

window.editKategori = function (id, nama) {
  inputNama.value = nama;
  editingId = id;
};

window.hapusKategori = async function (id) {
  try {
    await axios.delete(`${BASE_URL}/categories/${id}`);
    tampilkanKategori();
  } catch (err) {
    console.error("Gagal menghapus kategori:", err.message);
  }
};

tampilkanKategori();
