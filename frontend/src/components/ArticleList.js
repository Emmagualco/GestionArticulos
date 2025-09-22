import React from 'react';

	function ArticleList({ articulos, selected, onSelect, onSelectAll, onBulkDelete, onBulkEdit, showBulkActions, sortBy, sortDir, onSort }) {
		const allSelected = articulos.length > 0 && articulos.every(a => selected.includes(a.codigo));

		return (
			<div className="table-wrapper">
				<table className="article-table">
					<thead>
						<tr>
							<th>
								{showBulkActions && (
									<input
										type="checkbox"
										checked={allSelected}
										onChange={e => onSelectAll(e.target.checked)}
										title="Seleccionar todos"
									/>
								)}
							</th>
							<th onClick={() => onSort && onSort("codigo")}
								style={{ cursor: "pointer" }}>
								Código {sortBy === "codigo" && (sortDir === "asc" ? "▲" : "▼")}
							</th>
							<th onClick={() => onSort && onSort("descripcion")}
								style={{ cursor: "pointer" }}>
								Descripción {sortBy === "descripcion" && (sortDir === "asc" ? "▲" : "▼")}
							</th>
							<th onClick={() => onSort && onSort("precio")}
								style={{ cursor: "pointer" }}>
								Precio {sortBy === "precio" && (sortDir === "asc" ? "▲" : "▼")}
							</th>
							<th onClick={() => onSort && onSort("fecha_creacion")}
								style={{ cursor: "pointer" }}>
								Fecha creación {sortBy === "fecha_creacion" && (sortDir === "asc" ? "▲" : "▼")}
							</th>
							<th onClick={() => onSort && onSort("fecha_modificacion")}
								style={{ cursor: "pointer" }}>
								Fecha modificación {sortBy === "fecha_modificacion" && (sortDir === "asc" ? "▲" : "▼")}
							</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{articulos.map(a => (
							<tr key={a.codigo}>
								<td>
									{showBulkActions && (
										<input
											type="checkbox"
											checked={selected.includes(a.codigo)}
											onChange={e => onSelect(a.codigo, e.target.checked)}
											title={`Seleccionar ${a.codigo}`}
										/>
									)}
								</td>
								<td>{a.codigo}</td>
								<td>{a.descripcion}</td>
								<td>{a.precio}</td>
								<td>{a.fecha_creacion ? new Date(a.fecha_creacion).toLocaleString() : ''}</td>
								<td>{a.fecha_modificacion ? new Date(a.fecha_modificacion).toLocaleString() : ''}</td>
								<td>
									<button className="edit-btn" onClick={() => a.onEdit && a.onEdit(a)} title="Editar artículo">✏️</button>
									{showBulkActions && a.onDelete && (
										<button className="delete-btn" onClick={() => a.onDelete(a)} title="Eliminar artículo">🗑️</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{showBulkActions && selected.length > 0 && (
					<div className="bulk-actions-bar">
						<button
							className="edit-btn"
							onClick={typeof onBulkEdit === 'function' ? onBulkEdit : undefined}
							style={{ marginRight: '8px' }}
						>
							Editar seleccionados
						</button>
						{typeof onBulkDelete === 'function' && (
							<button
								className="delete-btn"
								onClick={onBulkDelete}
							>
								Eliminar seleccionados
							</button>
						)}
					</div>
				)}
			</div>
		);
	}
	export default ArticleList;
