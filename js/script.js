// BukuRuang - penghubung data, DOM, formulir, dan Local Storage.

const $ = (id) => document.getElementById(id);

const rupiahAngka = (nilai) => {
    return Number(String(nilai ?? 0).replace(/[^0-9]/g, "")) || 0;
};

function formatRupiah(nilai) {
    return "Rp " + rupiahAngka(nilai).toLocaleString("id-ID");
}


function simpanSemua() {
    localStorage.setItem("br_pengguna", JSON.stringify(dataPengguna));
    localStorage.setItem("br_katalog", JSON.stringify(dataKatalogBuku));
    localStorage.setItem("br_tracking", JSON.stringify(dataTracking));
    localStorage.setItem("br_transaksi", JSON.stringify(dataTransaksi));
}


try {
    const users = JSON.parse(localStorage.getItem("br_pengguna"));

    if (Array.isArray(users)) {
        dataPengguna.splice(0, dataPengguna.length, ...users);
    }

    const books = JSON.parse(localStorage.getItem("br_katalog"));

    if (Array.isArray(books)) {
        dataKatalogBuku.splice(0, dataKatalogBuku.length, ...books);
    }

    const tracking = JSON.parse(localStorage.getItem("br_tracking"));

    if (tracking && typeof tracking === "object") {
        Object.assign(dataTracking, tracking);
    }

} catch (error) {
    console.warn(
        "Data tersimpan tidak dapat dibaca, memakai data awal.",
        error
    );
}


let dataTransaksi = [];

try {
    dataTransaksi =
        JSON.parse(localStorage.getItem("br_transaksi")) || [];
} catch (_) {
    dataTransaksi = [];
}


function daftarTransaksi() {
    const hasil = Object.values(dataTracking).map((item) => ({
        nomorDO: item.nomorDO,
        nama: item.nama,
        buku: item.namaBarang || "Pesanan buku",
        total: rupiahAngka(item.total),
        pembayaran: item.pembayaran || "-",
        status: item.status,
        ekspedisi: item.ekspedisi,
        tanggal: item.tanggalKirim,
        paket: item.paket
    }));

    const gabung = new Map(
        hasil.map((item) => [item.nomorDO, item])
    );

    dataTransaksi.forEach((item) => {
        gabung.set(item.nomorDO, item);
    });

    return [...gabung.values()];
}



function bukaModal(id) {
    const el = $(id);

    if (el) {
        el.classList.add("show");
    }
}


function tutupModal(id) {
    const el = $(id);

    if (el) {
        el.classList.remove("show");
    }
}


function logout() {
    localStorage.removeItem("br_user_aktif");
    window.location.href = "login.html";
}


const formLogin = $("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = $("email").value.trim().toLowerCase();
        const password = $("password").value;

        const akun = dataPengguna.find(
            (user) =>
                user.email.toLowerCase() === email &&
                user.password === password
        );

        if (!akun) {
            alert("Email atau password yang dimasukkan belum sesuai.");
            return;
        }

        localStorage.setItem(
            "br_user_aktif",
            JSON.stringify({
                id: akun.id,
                nama: akun.nama,
                role: akun.role
            })
        );

        window.location.href = "dashboard.html";
    });
}



function kirimReset() {
    const email = $("emailLupa")?.value.trim().toLowerCase();

    if (!email) {
        alert("Email harus diisi.");
        return;
    }

    const akun = dataPengguna.find(
        (user) => user.email.toLowerCase() === email
    );

    alert(
        akun
            ? "Akun ditemukan. Fitur pengiriman reset password masih berupa simulasi."
            : "Email belum terdaftar."
    );

    if (akun) {
        tutupModal("modalLupa");
    }
}


function daftarAkun() {
    const nama = $("namaDaftar")?.value.trim();
    const email = $("emailDaftar")?.value.trim().toLowerCase();
    const password = $("passwordDaftar")?.value;

    if (!nama || !email || !password) {
        alert("Semua data wajib diisi.");
        return;
    }

    if (
        dataPengguna.some(
            (user) => user.email.toLowerCase() === email
        )
    ) {
        alert("Email sudah terdaftar.");
        return;
    }

    dataPengguna.push({
        id: Date.now(),
        nama,
        email,
        password,
        role: "User"
    });

    simpanSemua();

    alert(
        "Pendaftaran berhasil. Silakan masuk menggunakan akun yang baru dibuat."
    );

    tutupModal("modalDaftar");
}

if ($("greeting")) {
    const jam = new Date().getHours();

    const sapaan =
        jam >= 4 && jam < 11
            ? "Selamat pagi"
            : jam >= 11 && jam < 15
                ? "Selamat siang"
                : jam >= 15 && jam < 18
                    ? "Selamat sore"
                    : "Selamat malam";

    let nama = "Pembaca";

    try {
        const aktif = JSON.parse(
            localStorage.getItem("br_user_aktif")
        );

        if (aktif?.nama) {
            nama = aktif.nama.split(" ")[0];
        }
    } catch (_) {}

    $("greeting").innerHTML = `${sapaan}, <em>${nama}.</em>`;

    $("tanggalHariIni").textContent =
        new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}



function buatKodeBaru() {
    return "BR" + String(Date.now()).slice(-6);
}


function tampilkanKatalog() {
    const cards = $("kartuKatalog");
    const tbody = $("tabelBuku");

    if (cards) {
        cards.innerHTML = "";

        dataKatalogBuku.forEach((buku) => {
            const card = document.createElement("article");
            card.className = "book-card";

            const cover = document.createElement("div");
            cover.className = "cover-placeholder";
            cover.textContent = buku.namaBarang;

            if (buku.cover) {
                const image = document.createElement("img");

                image.className = "book-cover-img";
                image.src = buku.cover;
                image.alt = `Sampul ${buku.namaBarang}`;

                image.onerror = () => image.remove();

                cover.appendChild(image);
            }

            const info = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = buku.namaBarang;

            const meta = document.createElement("p");
            meta.className = "book-meta";
            meta.textContent =
                `${buku.jenisBarang} • Edisi ${buku.edisi} • ${buku.kodeBarang}`;

            const price = document.createElement("div");
            price.className = "book-price";
            price.textContent = formatRupiah(buku.harga);

            const stock = document.createElement("div");
            stock.className = "stock-label";
            stock.textContent = `Tersedia ${buku.stok} buku`;

            info.append(
                title,
                meta,
                price,
                stock
            );

            card.append(
                cover,
                info
            );

            cards.appendChild(card);
        });
    }

    if (tbody) {
        tbody.innerHTML = "";

        dataKatalogBuku.forEach((buku) => {
            const row = document.createElement("tr");

            [
                buku.kodeBarang,
                buku.namaBarang,
                `${buku.jenisBarang} / ${buku.edisi}`,
                formatRupiah(buku.harga),
                buku.stok
            ].forEach((value) => {
                const cell = document.createElement("td");

                cell.textContent = value;
                row.appendChild(cell);
            });


            const action = document.createElement("td");

            const del = document.createElement("button");

            del.className = "table-action";
            del.textContent = "Hapus";

            del.addEventListener("click", () => {
                hapusBuku(buku.kodeBarang);
            });

            action.appendChild(del);
            row.appendChild(action);

            tbody.appendChild(row);
        });


        if (!dataKatalogBuku.length) {
            tbody.innerHTML =
                '<tr><td colspan="6" class="empty-row">Belum ada buku dalam katalog.</td></tr>';
        }
    }


    if ($("jumlahKoleksi")) {
        $("jumlahKoleksi").textContent =
            `${dataKatalogBuku.length} judul`;
    }
}


function hapusBuku(kode) {
    if (!confirm("Hapus buku ini dari katalog?")) {
        return;
    }

    const index = dataKatalogBuku.findIndex(
        (buku) => buku.kodeBarang === kode
    );

    if (index >= 0) {
        dataKatalogBuku.splice(index, 1);

        simpanSemua();
        tampilkanKatalog();
        isiPilihanBuku();
    }
}


if ($("tabelBuku") || $("kartuKatalog")) {
    tampilkanKatalog();
}



const formBuku = $("formBuku");

if (formBuku) {
    formBuku.addEventListener("submit", (event) => {
        event.preventDefault();

        const bukuBaru = {
            kodeBarang: buatKodeBaru(),
            namaBarang: $("judulBuku").value.trim(),
            jenisBarang: $("jenisBuku").value.trim(),
            edisi: String($("edisiBuku").value),
            stok: Number($("stokBuku").value),
            harga: formatRupiah($("hargaBuku").value),
            cover: ""
        };

        if (
            !bukuBaru.namaBarang ||
            !bukuBaru.jenisBarang ||
            rupiahAngka(bukuBaru.harga) <= 0
        ) {
            alert("Periksa kembali data buku.");
            return;
        }

        dataKatalogBuku.push(bukuBaru);

        simpanSemua();
        tampilkanKatalog();
        isiPilihanBuku();

        formBuku.reset();

        $("jenisBuku").value = "Buku Ajar";
        $("edisiBuku").value = 1;

        alert("Buku berhasil ditambahkan ke katalog.");
    });
}


const pilihBuku = $("pilihBuku");


function isiPilihanBuku() {
    if (!pilihBuku) {
        return;
    }

    const pilihanSebelumnya = pilihBuku.value;

    pilihBuku.innerHTML =
        '<option value="">Pilih buku</option>';

    dataKatalogBuku.forEach((buku) => {
        const option = document.createElement("option");

        option.value = buku.kodeBarang;

        option.textContent =
            `${buku.namaBarang} — ${formatRupiah(buku.harga)} (stok ${buku.stok})`;

        pilihBuku.appendChild(option);
    });


    if (
        dataKatalogBuku.some(
            (buku) => buku.kodeBarang === pilihanSebelumnya
        )
    ) {
        pilihBuku.value = pilihanSebelumnya;
    }
}


if (pilihBuku) {
    isiPilihanBuku();
}


function hitungTotal() {
    if (
        !pilihBuku ||
        !$("jumlahPesan") ||
        !$("totalHarga")
    ) {
        return;
    }

    const buku = dataKatalogBuku.find(
        (item) => item.kodeBarang === pilihBuku.value
    );

    $("totalHarga").textContent = formatRupiah(
        buku
            ? rupiahAngka(buku.harga) *
              Number($("jumlahPesan").value || 0)
            : 0
    );
}


if (pilihBuku) {
    pilihBuku.addEventListener("change", hitungTotal);
}

if ($("jumlahPesan")) {
    $("jumlahPesan").addEventListener("input", hitungTotal);
}

if (pilihBuku) {
    hitungTotal();
}


function tampilkanTransaksi() {
    const tbody = $("tabelTransaksi");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    daftarTransaksi().forEach((item) => {
        const row = document.createElement("tr");

        [
            item.nomorDO,
            item.nama,
            item.buku,
            formatRupiah(item.total),
            item.pembayaran || "-"
        ].forEach((value) => {
            const cell = document.createElement("td");

            cell.textContent = value;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });


    if (!tbody.children.length) {
        tbody.innerHTML =
            '<tr><td colspan="5" class="empty-row">Belum ada transaksi.</td></tr>';
    }
}


tampilkanTransaksi();



const formCheckout = $("formCheckout");

if (formCheckout) {
    formCheckout.addEventListener("submit", (event) => {
        event.preventDefault();

        const buku = dataKatalogBuku.find(
            (item) => item.kodeBarang === pilihBuku.value
        );

        const jumlah = Number(
            $("jumlahPesan").value
        );


        if (!buku) {
            alert("Silakan pilih buku terlebih dahulu.");
            return;
        }

        if (
            jumlah < 1 ||
            jumlah > Number(buku.stok)
        ) {
            alert(
                "Jumlah pesanan tidak valid atau stok tidak mencukupi."
            );
            return;
        }


        const nextNumber =
            String(
                +(
                    Object.keys(dataTracking)
                        .sort()
                        .at(-1) || "20230013"
                ) + 1
            );

        const now = new Date();

        const tanggal =
            now.toISOString().slice(0, 10);

        const nomorDO = nextNumber;

        const total =
            rupiahAngka(buku.harga) * jumlah;


        const transaksi = {
            nomorDO,
            nama: $("namaPemesan").value.trim(),
            buku: buku.namaBarang,
            total,
            pembayaran: $("metodeBayar").value,
            status: "Pesanan diproses",
            ekspedisi: "JNE",
            tanggal,
            paket: "Reguler",
            telepon: $("teleponPemesan").value.trim(),
            alamat: $("alamatPemesan").value.trim()
        };


        buku.stok =
            Number(buku.stok) - jumlah;


        dataTracking[nomorDO] = {
            nomorDO,
            nama: transaksi.nama,
            status: transaksi.status,
            ekspedisi: transaksi.ekspedisi,
            tanggalKirim: tanggal,
            paket: transaksi.paket,
            total: formatRupiah(total),

            perjalanan: [
                {
                    waktu: `${tanggal} ${now.toLocaleTimeString(
                        "id-ID",
                        {
                            hour12: false
                        }
                    )}`,

                    keterangan:
                        "Pesanan diterima dan sedang dipersiapkan oleh BukuRuang."
                }
            ]
        };


        dataTransaksi.push(transaksi);

        simpanSemua();
        tampilkanKatalog();
        isiPilihanBuku();
        tampilkanTransaksi();

        alert(
            `Pesanan berhasil dibuat! Simpan nomor DO: ${nomorDO}`
        );

        formCheckout.reset();

        hitungTotal();
    });
}


function isiContohTracking(nomor) {
    if ($("nomorDO")) {
        $("nomorDO").value = nomor;
        $("formTracking").requestSubmit();
    }
}


function tampilkanTracking(nomor) {
    const hasil = $("hasilTracking");

    if (!hasil) {
        return;
    }

    const item = dataTracking[nomor];


    if (!item) {
        hasil.innerHTML =
            '<div class="error-message">Nomor Delivery Order tidak ditemukan. Periksa kembali nomor yang dimasukkan.</div>';

        return;
    }


    const detail = document.createElement("section");
    detail.className = "tracking-result";


    // Header tracking
    const head = document.createElement("div");
    head.className = "tracking-result-head";

    const identity = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = item.nama;

    const sub = document.createElement("p");
    sub.className = "subtle";
    sub.textContent = `Nomor DO: ${item.nomorDO}`;

    identity.append(
        title,
        sub
    );


    const status = document.createElement("span");
    status.className = "status-pill";
    status.textContent = item.status;

    head.append(
        identity,
        status
    );

    detail.appendChild(head);


    const details = document.createElement("div");
    details.className = "tracking-details";

    [
        ["Ekspedisi", item.ekspedisi],
        ["Tanggal kirim", item.tanggalKirim],
        ["Jenis paket", item.paket],
        ["Total pesanan", item.total],
        ["Kode paket", item.paket],
        ["Penerima", item.nama]
    ].forEach(([label, value]) => {
        const box = document.createElement("div");

        const l = document.createElement("span");
        l.className = "detail-label";
        l.textContent = label;

        const v = document.createElement("span");
        v.className = "detail-value";
        v.textContent = value || "-";

        box.append(
            l,
            v
        );

        details.appendChild(box);
    });

    detail.appendChild(details);


    // Riwayat perjalanan
    const journey = document.createElement("div");
    journey.className = "journey";

    const heading = document.createElement("h3");
    heading.textContent = "Riwayat perjalanan paket";

    journey.appendChild(heading);


    (item.perjalanan || []).forEach((event) => {
        const line = document.createElement("div");
        line.className = "journey-item";

        const dot = document.createElement("span");
        dot.className = "journey-dot";

        const time = document.createElement("span");
        time.className = "journey-time";
        time.textContent = event.waktu;

        const desc = document.createElement("span");
        desc.className = "journey-desc";
        desc.textContent = event.keterangan;

        line.append(
            dot,
            time,
            desc
        );

        journey.appendChild(line);
    });


    detail.appendChild(journey);

    hasil.replaceChildren(detail);
}


// ==================================================
// FORM TRACKING
// ==================================================

const formTracking = $("formTracking");

if (formTracking) {
    formTracking.addEventListener("submit", (event) => {
        event.preventDefault();

        tampilkanTracking(
            $("nomorDO").value.trim()
        );
    });
}