import React, { useState } from "react";
import axios from "axios";

const initialState = { codigo: "", descripcion: "", precio: "" };

export default function ArticleForm({ refreshList, editItem, onEditDone }) {
  const [form, setForm] = useState(editItem || initialState);

  React.useEffect(() => {
    setForm(editItem || initialState);
  }, [editItem]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editItem) {
      await axios.put(`http://localhost:8000/articulos/${editItem.id}/`, form);
      if (onEditDone) onEditDone();
    } else {
      await axios.post("http://localhost:8000/articulos/", form);
    }
    setForm(initialState);
    refreshList();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="codigo"
        value={form.codigo}
        onChange={handleChange}
        placeholder="Código"
        required
      />
      <input
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        required
      />
      <input
        name="precio"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
        type="number"
        step="0.01"
        required
      />
      <button type="submit">{editItem ? "Actualizar" : "Crear"}</button>
      {editItem && (
        <button type="button" onClick={onEditDone}>
          Cancelar
        </button>
      )}
    </form>
  );
}