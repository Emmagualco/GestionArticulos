import React from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ImportExcel({ refreshList }) {
  function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const articles = XLSX.utils.sheet_to_json(sheet);
      // Enviar artículos al backend
      axios
        .post("http://localhost:8000/articulos/import_excel/", { data: articles })
        .then(refreshList);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div>
      <h3>Importar Excel</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}