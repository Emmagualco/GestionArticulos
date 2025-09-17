import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleForm from "./ArticleForm";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [editItem, setEditItem] = useState(null);

  function fetchArticles() {
    axios.get("http://localhost:8000/articulos/").then((res) => setArticles(res.data));
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  function handleDelete(id) {
    axios.delete(`http://localhost:8000/articulos/${id}/`).then(fetchArticles);
  }

  return (
    <div>
      <h2>Lista de Artículos</h2>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.codigo}</td>
              <td>{a.descripcion}</td>
              <td>{a.precio}</td>
              <td>
                <button onClick={() => setEditItem(a)}>Editar</button>
                <button onClick={() => handleDelete(a.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editItem && (
        <div>
          <h3>Editar Artículo</h3>
          <ArticleForm
            editItem={editItem}
            refreshList={fetchArticles}
            onEditDone={() => setEditItem(null)}
          />
        </div>
      )}
    </div>
  );
}