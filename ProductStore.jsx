import { useState, useEffect } from "react";

const API = "https://fakestoreapi.com/products";

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f5f5; font-family: 'Inter', sans-serif; color: #333; }
  input, textarea, select {
    width: 100%; border: 1px solid #ddd; border-radius: 6px;
    padding: 9px 12px; font-size: 14px; font-family: inherit;
    outline: none; background: #fff; color: #333;
    transition: border-color 0.15s;
  }
  input:focus, textarea:focus, select:focus { border-color: #4CAF50; }
  input::placeholder, textarea::placeholder { color: #bbb; }
  label { font-size: 13px; color: #555; margin-bottom: 5px; display: block; }
  .req::after { content: ' *'; color: #e53935; }
  @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  .skel { animation: pulse 1.5s ease-in-out infinite; background: #ebebeb; border-radius: 4px; }
`;

const Badge = ({ label }) => (
  <span style={{
    display: "inline-block", background: "#e8f5e9", color: "#2e7d32",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
    padding: "3px 8px", borderRadius: 4, textTransform: "uppercase"
  }}>{label}</span>
);

const Stars = ({ rate = 0 }) => {
  const full = Math.round(rate);
  return (
    <span style={{ fontSize: 12 }}>
      {"★".repeat(full).split("").map((s, i) => <span key={i} style={{ color: "#FFC107" }}>★</span>)}
      {"☆".repeat(5 - full).split("").map((s, i) => <span key={i} style={{ color: "#ddd" }}>☆</span>)}
    </span>
  );
};

const BtnGreen = ({ onClick, children }) => (
  <button onClick={onClick} style={{
    background: "#4CAF50", color: "#fff", border: "none",
    borderRadius: 6, padding: "9px 22px", fontSize: 14,
    fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
  }}
    onMouseEnter={e => e.currentTarget.style.background = "#388E3C"}
    onMouseLeave={e => e.currentTarget.style.background = "#4CAF50"}>
    {children}
  </button>
);

/* ──────────── FORM ──────────── */
const ProductForm = ({ initial, onSubmit, onCancel }) => {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial
      ? { title: initial.title || "", price: initial.price || "", category: initial.category || "", image: initial.image || "", description: initial.description || "" }
      : { title: "", price: "", category: "", image: "", description: "" }
  );
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{
      background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8,
      padding: "24px 28px", marginBottom: 28
    }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: isEdit ? "#2e7d32" : "#222" }}>
        {isEdit ? "Edit Product" : "Add New Product"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label className="req">Title</label>
          <input value={form.title} onChange={set("title")} placeholder="Product title" />
        </div>
        <div>
          <label className="req">Price (USD)</label>
          <input value={form.price} onChange={set("price")} placeholder="99.99" type="number" min="0" step="0.01" />
        </div>
        <div>
          <label className="req">Category</label>
          <input value={form.category} onChange={set("category")} placeholder="electronics, clothing, etc" />
        </div>
        <div>
          <label>Image URL</label>
          <input value={form.image} onChange={set("image")} placeholder="https://example.com/image.jpg" />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Description</label>
        <textarea value={form.description} onChange={set("description")}
          placeholder="Product description..." rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <BtnGreen onClick={() => onSubmit(form)}>
          {isEdit ? "Update Product" : "Create Product"}
        </BtnGreen>
        {onCancel && (
          <button onClick={onCancel} style={{
            background: "#f5f5f5", color: "#666", border: "1px solid #ddd",
            borderRadius: 6, padding: "9px 22px", fontSize: 14,
            cursor: "pointer", fontFamily: "inherit"
          }}>Cancel</button>
        )}
      </div>
    </div>
  );
};

/* ──────────── CARD ──────────── */
const ProductCard = ({ product, onEdit, onDelete }) => (
  <div style={{
    background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10,
    overflow: "hidden", display: "flex", flexDirection: "column",
    transition: "box-shadow 0.18s"
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.09)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
  >
    {/* Image area */}
    <div style={{
      background: "#fafafa", height: 180,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      borderBottom: "1px solid #f0f0f0"
    }}>
      <img src={product.image} alt={product.title}
        style={{ maxHeight: 145, maxWidth: "100%", objectFit: "contain" }} />
    </div>

    {/* Body */}
    <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
      {/* Title */}
      <p style={{
        fontSize: 13, fontWeight: 600, color: "#222", lineHeight: 1.45,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>{product.title}</p>

      {/* Badge kategori */}
      <Badge label={product.category} />

      {/* Rating */}
      {product.rating && (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Stars rate={product.rating.rate} />
          <span style={{ fontSize: 11, color: "#aaa" }}>({product.rating.count})</span>
        </div>
      )}

      {/* Harga */}
      <p style={{ fontSize: 21, fontWeight: 700, color: "#4CAF50" }}>${product.price}</p>

      {/* Deskripsi */}
      <p style={{
        fontSize: 12, color: "#888", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>{product.description}</p>

      {/* ID */}
      <p style={{ fontSize: 11, color: "#ccc" }}>ID: {product.id}</p>

      {/* Buttons */}
      <div style={{
        display: "flex", gap: 8, marginTop: "auto",
        paddingTop: 10, borderTop: "1px solid #f0f0f0"
      }}>
        <button onClick={() => onEdit(product)} style={{
          background: "#1976D2", color: "#fff", border: "none",
          borderRadius: 5, padding: "6px 20px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#1565C0"}
          onMouseLeave={e => e.currentTarget.style.background = "#1976D2"}>
          Edit
        </button>
        <button onClick={() => onDelete(product.id)} style={{
          background: "#e53935", color: "#fff", border: "none",
          borderRadius: 5, padding: "6px 20px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit"
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#c62828"}
          onMouseLeave={e => e.currentTarget.style.background = "#e53935"}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ──────────── SKELETON ──────────── */
const SkeletonCard = () => (
  <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
    <div className="skel" style={{ height: 180 }} />
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="skel" style={{ height: 12, width: "90%" }} />
      <div className="skel" style={{ height: 12, width: "60%" }} />
      <div className="skel" style={{ height: 10, width: "40%" }} />
      <div className="skel" style={{ height: 18, width: "35%" }} />
      <div className="skel" style={{ height: 10, width: "80%" }} />
      <div className="skel" style={{ height: 10, width: "70%" }} />
    </div>
  </div>
);

/* ══════════════ APP ══════════════ */
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    fetch(API)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleCreate = form => {
    if (!form.title.trim() || !form.price || !form.category.trim()) {
      notify("Harap isi field yang bertanda *", false); return;
    }
    const p = {
      ...form, id: Date.now(),
      price: parseFloat(form.price),
      rating: { rate: 4.0, count: 0 }
    };
    setProducts(prev => [p, ...prev]);
    notify("Produk berhasil ditambahkan!");
  };

  const handleUpdate = form => {
    if (!form.title.trim() || !form.price || !form.category.trim()) {
      notify("Harap isi field yang bertanda *", false); return;
    }
    setProducts(prev =>
      prev.map(x => x.id === editProduct.id
        ? { ...x, ...form, price: parseFloat(form.price) }
        : x)
    );
    setEditProduct(null);
    notify("Produk berhasil diupdate!");
  };

  const handleDelete = id => {
    setProducts(prev => prev.filter(x => x.id !== id));
    notify("Produk dihapus.");
  };

  return (
    <>
      <style>{CSS}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", top: 18, right: 18, zIndex: 9999,
          background: toast.ok ? "#e8f5e9" : "#ffebee",
          border: `1px solid ${toast.ok ? "#4CAF50" : "#e53935"}`,
          color: toast.ok ? "#2e7d32" : "#c62828",
          padding: "11px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)"
        }}>{toast.msg}</div>
      )}

      {/* ── HEADER hijau ── */}
      <header style={{ background: "#4CAF50" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          height: 56, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: 0.3 }}>
            Product Store
          </h1>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "26px 20px 60px" }}>

        {/* Form Tambah: tampil kalau bukan mode edit */}
        {!editProduct && <ProductForm onSubmit={handleCreate} />}

        {/* Form Edit: tampil di atas list produk */}
        {editProduct && (
          <ProductForm
            initial={editProduct}
            onSubmit={handleUpdate}
            onCancel={() => setEditProduct(null)}
          />
        )}

        {/* All Products header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>All Products</h2>
          <button onClick={load} style={{
            background: "#fff", border: "1px solid #ddd", color: "#555",
            borderRadius: 6, padding: "5px 16px", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4CAF50"; e.currentTarget.style.color = "#4CAF50"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#555"; }}>
            Refresh
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : products.map(p => (
              <ProductCard key={p.id} product={p}
                onEdit={setEditProduct} onDelete={handleDelete} />
            ))
          }
        </div>
      </main>
    </>
  );
}
