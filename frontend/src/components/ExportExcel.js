import React from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function ExportExcel() {
  function handleExport() {
    axios.get("http://localhost:8000/articulos/").then((res) => {
      const ws = XLSX.utils.json_to_sheet(res.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Articulos");
      XLSX.writeFile(wb, "articulos.xlsx");
    });
  }

  return (
    <button onClick={handleExport}>Descargar Excel</button>
  );
}