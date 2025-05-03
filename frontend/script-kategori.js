const BASE_URL = "http://localhost:5000";
const daftarKategori = document.getElementById("daftar-kategori");
const form = document.getElementById("form-kategori");
const inputNama = document.getElementById("nama-kategori");
const submitBtn = document.getElementById("submit-btn");

let editingId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = inputNama.value.trim();

  if (!nama) {
    alert("Nama kategori tidak boleh kosong.");
    return;
  }

  try {
    if (editingId) {
      await axios.put(`${BASE_URL}/categories/${editingId}`, { name: nama });
      alert("Kategori berhasil diperbarui.");
      editingId = null;
      submitBtn.textContent = "Simpan";
    } else {
      await axios.post(`${BASE_URL}/categories`, { name: nama });
      alert("Kategori berhasil ditambahkan.");
    }
    inputNama.value = "";
    tampilkanKategori();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err.message);
    alert("Terjadi kesalahan saat menyimpan kategori.");
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
        <div class="kategori-nama"><strong>${kat.name}</strong></div>
        <div class="kategori-aksi">
          <button class="btn-edit" onclick="editKategori(${kat.id}, '${kat.name}')">✏️ Edit</button>
          <button class="btn-hapus" onclick="hapusKategori(${kat.id})">🗑️ Hapus</button>
        </div>
      `;
      daftarKategori.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal menampilkan kategori:", err.message);
    alert("Gagal mengambil data kategori.");
  }
}

window.editKategori = function (id, nama) {
  inputNama.value = nama;
  editingId = id;
  submitBtn.textContent = "Update";
};

window.hapusKategori = async function (id) {
  const konfirmasi = confirm("Apakah Anda yakin ingin menghapus kategori ini?");
  if (!konfirmasi) return;

  try {
    await axios.delete(`${BASE_URL}/categories/${id}`);
    alert("Kategori berhasil dihapus.");
    tampilkanKategori();
  } catch (err) {
    console.error("Gagal menghapus kategori:", err.message);
    alert("Terjadi kesalahan saat menghapus kategori.");
  }
};

tampilkanKategori();
