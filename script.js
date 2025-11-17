const initialProducts = [
  { id: 1, name: "Kopi Gayo", price: 25000, stock: 50 },
  { id: 2, name: "Teh Hitam", price: 18000, stock: 30 },
  { id: 3, name: "Coklat Aceh", price: 30000, stock: 20 }
];

const initialSummary = {
  totalSales: 85,
  totalRevenue: 12500000
};

const STORAGE_KEYS = {
  PRODUCTS: 'uts_products',
  SUMMARY: 'uts_summary',
  LOGGED_IN: 'uts_logged_in'
};

function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    return initialProducts.slice();
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    return initialProducts.slice();
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

const path = window.location.pathname.split('/').pop();

if (path === '' || path === 'index.html') {
  const form = document.getElementById('loginForm');
  const err = document.getElementById('errorMsg');

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      err.textContent = 'Email dan password tidak boleh kosong.';
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      err.textContent = 'Format email tidak valid.';
      return;
    }

    alert('Login berhasil');
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    window.location.href = 'dashboard.html';
  });
}

if (path === 'dashboard.html') {
  if (!localStorage.getItem(STORAGE_KEYS.LOGGED_IN)) {
    window.location.href = 'index.html';
  }

  function formatRupiah(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  const products = loadProducts();
  const totalProducts = products.length;
  const totalSales = initialSummary.totalSales;
  const totalRevenue = initialSummary.totalRevenue;

  const elTotalProducts = document.getElementById('totalProducts');
  const elTotalSales = document.getElementById('totalSales');
  const elTotalRevenue = document.getElementById('totalRevenue');

  elTotalProducts && (elTotalProducts.textContent = totalProducts);
  elTotalSales && (elTotalSales.textContent = totalSales);
  elTotalRevenue && (elTotalRevenue.textContent = formatRupiah(totalRevenue));

  const btnView = document.getElementById('btnViewProducts');
  btnView && btnView.addEventListener('click', () => {
    window.location.href = 'products.html';
  });

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn && logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    window.location.href = 'index.html';
  });
}

if (path === 'products.html') {
  if (!localStorage.getItem(STORAGE_KEYS.LOGGED_IN)) {
    window.location.href = 'index.html';
  }

  const tbody = document.querySelector('#productsTable tbody');

  let products = loadProducts();

  function renderTable() {
    tbody.innerHTML = '';
    if (!products || products.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="5" style="text-align:center; padding:18px;">Tidak ada produk.</td>';
      tbody.appendChild(tr);
      return;
    }

    products.forEach((p, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', p.id);
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td>Rp ${Number(p.price).toLocaleString('id-ID')}</td>
        <td>${p.stock}</td>
        <td>
          <button class="action-btn edit" title="Edit">✏️</button>
          <button class="action-btn delete" title="Delete">🗑️</button>
        </td>
      `;
      const editBtn = tr.querySelector('.edit');
      const delBtn = tr.querySelector('.delete');

      editBtn.addEventListener('click', () => {
        alert('Edit produk: ' + p.name);
      });

      delBtn.addEventListener('click', () => {
        if (confirm('Yakin hapus produk ini?')) {
          products = products.filter(item => item.id !== p.id);
          saveProducts(products);
          tr.remove();
          renderTable();
        }
      });

      tbody.appendChild(tr);
    });
  }

  renderTable();
}
