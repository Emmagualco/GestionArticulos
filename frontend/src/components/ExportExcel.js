
import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";

const ExportExcel = () => {
  const handleExport = async () => {
    try {
    
      let allArticulos = [];
      let page = 1;
      let pageSize = 100;
      let hasMore = true;
      while (hasMore) {
        const res = await axios.get(`/api/articulos/?page=${page}&page_size=${pageSize}`);
        allArticulos = allArticulos.concat(res.data.results);
        hasMore = !!res.data.next;
        page++;
      }
      if (!allArticulos || allArticulos.length === 0) {
        alert("No hay datos para exportar");
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Artículos");
      const headerMap = {
        codigo: "Código",
        descripcion: "Descripción",
        precio: "Precio",
        fecha_creacion: "Fecha creación",
        fecha_modificacion: "Fecha modificación",
        usuario_creador: "Usuario creador",
        usuario_modificador: "Usuario modificador"
      };
      const headers = Object.values(headerMap);
      worksheet.addRow(headers);
      allArticulos.forEach((item) => {
        const row = Object.keys(headerMap).map((key) => item[key] || "");
        worksheet.addRow(row);
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "articulos.xlsx");
    } catch (error) {
      console.error("Error al exportar el Excel:", error);
    }
  };
  return <button className="form-panel-button" onClick={handleExport}>Exportar a Excel</button>;
};

export default ExportExcel;

