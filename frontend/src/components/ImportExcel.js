import React from "react";
import ExcelJS from "exceljs";
import axios from "axios";

const ImportExcel = () => {
  const [feedback, setFeedback] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const fileInputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);

  const handleFileUpload = async (e) => {
    setFeedback("");
    setLoading(true);
    try {
      const file = e.target.files[0];
      if (!file) return;
      const validExtensions = ['.xlsx', '.xls'];
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(ext)) {
        setFeedback('Error: Formato de archivo no válido. Solo se aceptan archivos .xlsx y .xls');
        setLoading(false);
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      const data = [];

      const headers = worksheet
        .getRow(1)
        .values.slice(1)
        .map((h, i) => (h ? h.toString().toLowerCase().trim() : `column${i + 1}`));


  // Validar formato
      if (headers.length < 3) {
        setFeedback('Error: El formato del archivo es incorrecto. Debe tener al menos las columnas: codigo, descripcion, precio. Formatos válidos: .xlsx, .xls');
        setLoading(false);
        return;
      }
      const required = ['codigo', 'descripcion', 'precio'];
      const missing = required.filter(col => !headers.includes(col));
      if (missing.length > 0) {
        setFeedback(`Error: faltan columnas requeridas (${missing.join(', ')}). Verifica el nombre de las columnas en el archivo Excel.`);
        setLoading(false);
        return;
      }

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rowData = row.values.slice(1);
        const item = {};
        headers.forEach((header, i) => {
          item[header] = rowData[i];
        });
  // Validar campos
        const codigo = item.codigo ? String(item.codigo).trim() : '';
        const descripcion = item.descripcion ? String(item.descripcion).trim() : '';
        let precio = item.precio;
        if (typeof precio === 'string') precio = precio.replace(',', '.');
        precio = parseFloat(precio);
        if (!codigo || !descripcion || isNaN(precio)) return;
        data.push({ codigo, descripcion, precio });
      });

  // Enviar datos
      let successCount = 0;
      let errorCount = 0;
      let errorMessages = [];
      for (const articulo of data) {
        try {
          await axios.post("/api/articulos/", articulo);
          successCount++;
        } catch (err) {
          errorCount++;
          if (err.response && err.response.data && err.response.data.codigo) {
            errorMessages.push(`Ya existe el artículo con código: ${articulo.codigo}`);
          } else {
            errorMessages.push(`Código: ${articulo.codigo} - Error desconocido`);
          }
        }
      }
      if (successCount > 0 && errorCount === 0) {
        setFeedback(`Importación exitosa (${successCount} artículos)`);
      } else if (successCount > 0 && errorCount > 0) {
        setFeedback(`Importados: ${successCount}, errores: ${errorCount}.\n${errorMessages.join('\n')}`);
      } else {
        setFeedback(`Error al importar el archivo.\n${errorMessages.join('\n')}`);
      }
    } catch (error) {
      setFeedback("Error al importar el archivo");
      console.error("Error al importar el Excel:", error);
    }
    setLoading(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const event = { target: { files: [selectedFile] } };
      handleFileUpload(event);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '18px', width: '100%' }}>
        <h2 className="import-title" style={{ margin: 0, flex: 1 }}>Importar Artículos desde Excel</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '12px', width: '100%' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <button type="button" className="form-panel-button" onClick={handleButtonClick}>
          Seleccionar archivo
        </button>
        <span style={{ fontSize: '1rem', color: '#24416b', marginLeft: '0.5rem', fontWeight: 600, fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif' }}>
          {fileName ? fileName : "Sin archivos seleccionados"}
        </span>
        {selectedFile && (
          <button
            type="button"
            className="form-panel-button upload-highlight"
            style={{ marginLeft: '8px', boxShadow: '0 6px 24px #2980b9', background: 'linear-gradient(90deg, #2980b9 0%, #6dd5fa 100%)', fontWeight: '900', border: '2px solid #2980b9', color: '#fff' }}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Importando..." : "Subir archivo"}
          </button>
        )}
        {feedback && (
          <span style={{ marginLeft: '1rem', color: feedback.includes('exitos') || feedback.includes('Importados') ? '#27ae60' : '#c0392b', fontWeight: 700, fontSize: '1rem' }}>{feedback}</span>
        )}
      </div>
    </div>
  );
};

export default ImportExcel;

