import React from "react";
import ArticleList from "./components/ArticleList";
import ArticleForm from "./components/ArticleForm";
import ImportExcel from "./components/ImportExcel";
import ExportExcel from "./components/ExportExcel";

function App() {
  // Puedes agregar lógica aquí si quieres refrescar la lista desde el formulario
  return (
    <div>
      <h1>Gestión de Artículos</h1>
      <ArticleForm refreshList={() => window.location.reload()} />
      <ImportExcel refreshList={() => window.location.reload()} />
      <ExportExcel />
      <ArticleList />
    </div>
  );
}

export default App;