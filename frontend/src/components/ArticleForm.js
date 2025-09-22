
import React, { useState } from 'react';
import axios from 'axios';

function ArticleForm({ onArticuloCreado }) {
	const [form, setForm] = useState({ codigo: '', descripcion: '', precio: '' });
	const [error, setError] = useState('');

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setError('');
	};

	const handleSubmit = async e => {
		e.preventDefault();
		let precio = form.precio.replace(',', '.');
		precio = parseFloat(precio);
		const payload = {
			codigo: form.codigo.trim(),
			descripcion: form.descripcion.trim(),
			precio: precio
		};
		try {
			const res = await axios.post('/api/articulos/', payload);
			if (typeof onArticuloCreado === 'function') {
				onArticuloCreado(res.data);
			}
			setForm({ codigo: '', descripcion: '', precio: '' });
			setError('');
		} catch (err) {
			if (err.response && err.response.data) {
				setError(JSON.stringify(err.response.data));
			} else {
				setError('Error al crear artículo');
			}
		}
	};

	return (
		<div className="form-create-wrapper">
			<h2 className="form-title">Crear artículo</h2>
			<form onSubmit={handleSubmit} className="form-create-form">
				<input name="codigo" type="text" placeholder="Código" value={form.codigo} onChange={handleChange} required autoComplete="off" />
				<input name="descripcion" type="text" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required autoComplete="off" />
				<input name="precio" type="text" placeholder="Precio (ej: 123 o 123.45)" value={form.precio} onChange={handleChange} required title="Ingrese un número entero o decimal, máximo dos decimales" autoComplete="off" />
				<button type="submit" className="form-panel-button">Crear</button>
			</form>
			{error && <div style={{color:'#c0392b', fontWeight:'700', marginTop:'12px'}}>{error}</div>}
		</div>
	);
}
export default ArticleForm;
