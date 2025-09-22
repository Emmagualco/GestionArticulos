import React, { useState, useEffect } from 'react';

function BulkEditModal({ open, articulos, onClose, onSave }) {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        if (open) {
            setUpdates(articulos.map(a => ({ codigo: a.codigo, descripcion: a.descripcion, precio: a.precio })));
        }
    }, [open, articulos]);

    if (!open) return null;

    const handleChange = (idx, field, value) => {
        setUpdates(upds => upds.map((u, i) => i === idx ? { ...u, [field]: value } : u));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(updates);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edición masiva de artículos</h2>
                <form onSubmit={handleSubmit}>
                    <table className="modal-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {updates.map((a, idx) => (
                                <tr key={a.codigo}>
                                    <td>{a.codigo}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={a.descripcion}
                                            onChange={e => handleChange(idx, 'descripcion', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={a.precio}
                                            onChange={e => handleChange(idx, 'precio', e.target.value)}
                                            required
                                            step="0.01"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="modal-actions">
                        <button type="submit" className="edit-btn">Guardar cambios</button>
                        <button type="button" className="clear-btn" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BulkEditModal;
