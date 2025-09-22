import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportExcel = ({ data }) => {
  const handleExport = async () => {
    try {
      if (!data || data.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Artículos");
  // Encabezados
      const headerMap = {
        codigo: "codigo",
        descripcion: "descripcion",
        precio: "precio"
      };
      const headers = Object.keys(headerMap);
      worksheet.addRow(headers);

  // Datos
      data.forEach((item) => {
        const row = headers.map((header) => item[header]);
        worksheet.addRow(row);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "articulos.xlsx");
    } catch (error) {
      console.error("Error al exportar el Excel:", error);
    }
  };

  return <button className="edit-btn" onClick={handleExport}>Exportar a Excel</button>;
};

export default ExportExcel;

