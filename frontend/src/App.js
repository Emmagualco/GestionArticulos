import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleList from "./components/ArticleList";
import ArticleForm from "./components/ArticleForm";
import LoginPanel from "./components/LoginPanel";
import ImportExcel from "./components/ImportExcel";
import ExportExcel from "./components/ExportExcel";
import BulkEditModal from "./components/BulkEditModal";
import "./App.css";

function App() {
	// Estado de login
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loginError, setLoginError] = useState('');
	const [userRole, setUserRole] = useState('');
	//

	function handleLogout() {
		setIsAuthenticated(false);
		setUserRole("");
		localStorage.removeItem("authSession");
	//
	}

	async function handleLogin({ username, password }) {
		setLoginError("");
		try {
			const res = await axios.post("/api/articulos/login/", { username, password });
			if (res.data.success) {
				setIsAuthenticated(true);
				setUserRole(res.data.role);
				localStorage.setItem("authSession", JSON.stringify({
					username,
					role: res.data.role,
					timestamp: Date.now()
				}));
			} else {
				setLoginError(res.data.error || "Usuario o contraseña incorrectos");
			}
		} catch (err) {
			setLoginError(err.response?.data?.error || "Usuario o contraseña incorrectos");
		}
	}

	const [articulos, setArticulos] = useState([]);
	const [filter, setFilter] = useState("");
	const [filterColumn, setFilterColumn] = useState("codigo");
	const [sortBy, setSortBy] = useState("codigo");
	const [sortDir, setSortDir] = useState("asc");

// Mensajes de feedback
const [toast, setToast] = useState({ show: false, message: '', type: '' });
function showToast(message, type = 'success') {
	setToast({ show: true, message, type });
	setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
}

	useEffect(() => {
	// Restaurar sesión
		const session = localStorage.getItem("authSession");
		if (session) {
			try {
				const { role, timestamp } = JSON.parse(session);
				if (Date.now() - timestamp < 10 * 60 * 1000) {
					setIsAuthenticated(true);
					setUserRole(role);
				} else {
					localStorage.removeItem("authSession");
				}
			} catch {}
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			axios
				.get("/api/articulos/")
				.then((res) => setArticulos(res.data))
				.catch((err) => console.error(err));
		} else {
			setArticulos([]);
		}
	}, [isAuthenticated]);

// Filter articles by code or description
let filteredArticulos = articulos.filter(a => {
	if (!filter) return true;
	let value = a[filterColumn];
	if (value === undefined || value === null) return false;
	if (filterColumn === "fecha_creacion" || filterColumn === "fecha_modificacion") {
		value = new Date(value).toLocaleString();
	}
	return value.toString().toLowerCase().includes(filter.toLowerCase());
});
filteredArticulos = [...filteredArticulos].sort((a, b) => {
	let vA = a[sortBy], vB = b[sortBy];
	// Si es fecha, convertir a timestamp
	if (sortBy === "fecha_creacion" || sortBy === "fecha_modificacion") {
		vA = vA ? new Date(vA).getTime() : 0;
		vB = vB ? new Date(vB).getTime() : 0;
	}
	// Si es precio o código numérico, convertir a número
	if (sortBy === "precio" || (sortBy === "codigo" && !isNaN(vA) && !isNaN(vB))) {
		vA = parseFloat(vA);
		vB = parseFloat(vB);
	}
	// Si es string, comparar en minúsculas
	if (typeof vA === "string") vA = vA.toLowerCase();
	if (typeof vB === "string") vB = vB.toLowerCase();
	if (vA < vB) return sortDir === "asc" ? -1 : 1;
	if (vA > vB) return sortDir === "asc" ? 1 : -1;
	return 0;
});

// Individual edit modal state
const [singleEditOpen, setSingleEditOpen] = useState(false);
const [singleEditArticulo, setSingleEditArticulo] = useState(null);
const [singleEditLoading, setSingleEditLoading] = useState(false);
const [singleEditError, setSingleEditError] = useState("");

// Edit handler (open modal)
const handleEdit = (articulo) => {
	setSingleEditArticulo(articulo);
	setSingleEditOpen(true);
};

// Individual edit save handler
const handleSingleEditSave = (updates) => {
	const upd = updates[0];
	setSingleEditLoading(true);
	setSingleEditError("");
	axios.patch(`/api/articulos/${singleEditArticulo.id}/`, upd)
		.then(() => {
			setArticulos(prev => prev.map(a => a.codigo === upd.codigo ? { ...a, ...upd } : a));
			setSingleEditOpen(false);
			showToast('Artículo editado correctamente', 'success');
		})
		.catch(err => {
			setSingleEditError("Error al editar el artículo.");
			showToast('Error al editar el artículo', 'error');
		})
		.finally(() => setSingleEditLoading(false));
};

// Delete handler with confirmation
const handleDelete = (articulo) => {
	if (window.confirm(`¿Seguro que deseas eliminar el artículo ${articulo.codigo}?`)) {
		axios.delete(`/api/articulos/${articulo.id}/`)
			.then(() => {
				setArticulos(prev => prev.filter(a => a.id !== articulo.id));
				showToast('Artículo eliminado correctamente', 'success');
			})
			.catch(err => {
				showToast('Error al eliminar el artículo', 'error');
				console.error(err);
			});
	}
};

// Selection state for bulk deletion
const [selected, setSelected] = useState([]);

// Select/deselect one
const handleSelect = (codigo, checked) => {
	setSelected(prev => checked ? [...prev, codigo] : prev.filter(c => c !== codigo));
};

// Select/deselect all
const handleSelectAll = (checked) => {
	setSelected(checked ? filteredArticulos.map(a => a.codigo) : []);
};

// Bulk delete handler (using backend bulk endpoint)
const handleBulkDelete = () => {
	if (userRole !== 'admin') return; // Solo admin puede eliminar masivamente
	if (selected.length === 0) return;
	if (window.confirm(`¿Seguro que deseas eliminar ${selected.length} artículos seleccionados?`)) {
		axios.post('/api/articulos/bulk-delete/', { codigos: selected })
			.then(() => {
				setArticulos(prev => prev.filter(a => !selected.includes(a.codigo)));
				setSelected([]);
				showToast('Artículos eliminados correctamente', 'success');
			})
			.catch(err => {
				const failed = err.response?.data?.codigos || [];
				showToast(`Error al eliminar los artículos: ${failed.join(', ')}`, 'error');
			});
	}
};

// Bulk edit modal state
const [editModalOpen, setEditModalOpen] = useState(false);
const [editLoading, setEditLoading] = useState(false);
const [editError, setEditError] = useState("");

// Bulk edit handler (open modal)
const handleBulkEdit = () => {
	if (selected.length === 0) return;
	setEditModalOpen(true);
};

// Bulk edit save handler
const handleBulkEditSave = (updates) => {
	// Add 'id' to each update for backend matching
	const updatesWithId = updates.map(u => {
		const art = articulos.find(a => a.codigo === u.codigo);
		return art ? { ...u, id: art.id } : u;
	});
	setEditLoading(true);
	setEditError("");
	axios.post('/api/articulos/bulk-update/', { updates: updatesWithId })
		.then(() => {
			// Update local state
			setArticulos(prev => prev.map(a => {
				const upd = updatesWithId.find(u => u.codigo === a.codigo);
				return upd ? { ...a, ...upd } : a;
			}));
			setEditModalOpen(false);
			setSelected([]);
			showToast('Artículos editados correctamente', 'success');
		})
		.catch(err => {
			setEditError("Error al editar artículos seleccionados.");
			showToast('Error al editar artículos seleccionados', 'error');
		})
		.finally(() => setEditLoading(false));
};

// Pass handlers to ArticleList
const articulosWithHandlers = filteredArticulos.map(a => ({
	...a,
	onEdit: handleEdit,
	// Solo pasar onDelete si el usuario es admin
	...(userRole === 'admin' ? { onDelete: handleDelete } : {})
	// Si no es admin, no pasar onDelete
}));

// Permitir acciones masivas solo para admin
const bulkActionsProps = {
	selected,
	onSelect: handleSelect,
	onSelectAll: handleSelectAll,
	onBulkEdit: handleBulkEdit,
	showBulkActions: true,
	onBulkDelete: userRole === 'admin' && selected.length > 0 ? handleBulkDelete : undefined
};

	return (
		<div className="app-container">
			<header className="app-header">
				<div className="header-content">
					<span className="header-icon" role="img" aria-label="box">
						📦
					</span>
					<h1>Gestión de Artículos</h1>
				</div>
			</header>
			<main>
				{!isAuthenticated ? (
					<LoginPanel onLogin={handleLogin} loginError={loginError} />
				) : (
					<div>
						<div style={{display:'flex', justifyContent:'flex-end', margin:'18px 0'}}>
							<button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
						</div>
						<div className="front-grid">
							<div className="form-panel">
								<ArticleForm onArticuloCreado={articulo => {
									setArticulos(prev => [...prev, articulo]);
									showToast('Artículo creado correctamente', 'success');
								}} />
								<ImportExcel />
							</div>
							<div className="data-panel-horizontal">
								<div className="table-area-horizontal">
									<h2 className="list-title">Lista de Artículos</h2>
									<div className="filter-bar">
										<select
											className="filter-select"
											value={filterColumn}
											onChange={e => setFilterColumn(e.target.value)}
											style={{marginRight: '8px'}}
										>
											<option value="codigo">Código</option>
											<option value="descripcion">Descripción</option>
											<option value="precio">Precio</option>
											<option value="fecha_creacion">Fecha creación</option>
											<option value="fecha_modificacion">Fecha modificación</option>
										</select>
										<input
											type="text"
											className="filter-input"
											placeholder={`Filtrar por ${filterColumn.replace('_', ' ')}...`}
											value={filter}
											onChange={e => setFilter(e.target.value)}
										/>
									</div>
									<ArticleList
										articulos={articulosWithHandlers}
										{...bulkActionsProps}
										sortBy={sortBy}
										sortDir={sortDir}
										onSort={col => {
											if (sortBy === col) {
												setSortDir(sortDir === "asc" ? "desc" : "asc");
											} else {
												setSortBy(col);
												setSortDir("asc");
											}
										}}
									/>
									<BulkEditModal
										open={editModalOpen}
										articulos={articulosWithHandlers.filter(a => selected.includes(a.codigo))}
										onClose={() => setEditModalOpen(false)}
										onSave={handleBulkEditSave}
									/>
									<BulkEditModal
										open={singleEditOpen}
										articulos={singleEditArticulo ? [singleEditArticulo] : []}
										onClose={() => setSingleEditOpen(false)}
										onSave={handleSingleEditSave}
									/>
									{editLoading && <div className="modal-loading">Guardando cambios...</div>}
									{editError && <div className="modal-error">{editError}</div>}
									{singleEditLoading && <div className="modal-loading">Guardando cambios...</div>}
									{singleEditError && <div className="modal-error">{singleEditError}</div>}
									{toast.show && (
										<div className={`toast ${toast.type}`}>{toast.message}</div>
									)}
								</div>
								<div className="export-area-horizontal">
									<ExportExcel data={filteredArticulos} />
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
			<footer className="app-footer">
				&copy; {new Date().getFullYear()} Gestión de Artículos | Desafío Fullstack
			</footer>
		</div>
	);
	// ...existing code...
}

export default App;
