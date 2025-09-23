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
	
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [userRole, setUserRole] = useState("");
	const [username, setUsername] = useState("");

	// Modal de gestión de usuario
	const [userModalOpen, setUserModalOpen] = useState(false);
	const [userModalLoading, setUserModalLoading] = useState(false);
	const [userModalError, setUserModalError] = useState("");
	const [userModalSuccess, setUserModalSuccess] = useState("");
	const [userModalData, setUserModalData] = useState({ username: "", password: "" });
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			const session = localStorage.getItem("authSession");
			if (session) {
				const { username } = JSON.parse(session);
				setUserModalData(prev => ({ ...prev, username }));
				setUsername(username);
			}
		}
	}, [isAuthenticated, userModalOpen]);

	function handleUserModalSave(e) {
		e.preventDefault();
		setUserModalLoading(true);
		setUserModalError("");
		setUserModalSuccess("");
		axios.patch("/api/articulos/usuario/", userModalData)
			.then(() => {
				setUserModalSuccess("Datos actualizados correctamente");
			})
			.catch(() => {
				setUserModalError("Error al actualizar los datos");
			})
			.finally(() => setUserModalLoading(false));
	}

	const renderUserModal = () => (
		userModalOpen && (
			<div className="modal-overlay" style={{
				position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000,
				display: 'flex', alignItems: 'center', justifyContent: 'center'
			}}>
				<div className="modal-content" style={{
					minWidth: 340, maxWidth: 400, background: 'white', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: 32,
					display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative'
				}}>
					<h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 18, color: '#1a2947', letterSpacing: 0.5 }}>Gestionar usuario</h2>
					<form onSubmit={handleUserModalSave} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
						<label style={{ fontWeight: 500, color: '#1a2947', fontSize: 15 }}>
							Usuario
							<input type="text" value={userModalData.username} disabled
								style={{
									marginLeft: 8, marginTop: 6, padding: '8px 12px', borderRadius: 8, border: '1px solid #dbe2ef', background: '#f3f6fa', color: '#7a7a7a', fontWeight: 500, fontSize: 15, width: '100%'
								}} />
						</label>
						<label style={{ fontWeight: 500, color: '#1a2947', fontSize: 15 }}>
							Nueva contraseña
							<input type="password" value={userModalData.password} onChange={e => setUserModalData({ ...userModalData, password: e.target.value })}
								style={{
									marginLeft: 8, marginTop: 6, padding: '8px 12px', borderRadius: 8, border: '1px solid #dbe2ef', background: '#fff', color: '#1a2947', fontWeight: 500, fontSize: 15, width: '100%'
								}} />
						</label>
						<div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 8 }}>
							<button type="button" className="clear-btn" onClick={() => setUserModalOpen(false)}
								style={{
									background: '#f3f6fa', color: '#1a2947', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'background 0.2s'
								}}>Cancelar</button>
							<button type="submit" className="form-panel-button" disabled={userModalLoading}
								style={{
									background: userModalLoading ? '#bfcbe6' : 'linear-gradient(90deg,#1a2947 60%,#3f72af 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 12px rgba(63,114,175,0.12)', cursor: userModalLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
								}}>Guardar</button>
						</div>
						{userModalLoading && <div className="modal-loading" style={{ color: '#3f72af', fontWeight: 500, marginTop: 8 }}>Guardando cambios...</div>}
						{userModalError && <div className="modal-error" style={{ color: '#c0392b', fontWeight: 600, marginTop: 8 }}>{userModalError}</div>}
						{userModalSuccess && <div className="modal-success" style={{ color: '#27ae60', fontWeight: 600, marginTop: 8 }}>{userModalSuccess}</div>}
					</form>
				</div>
			</div>
		)
	);

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
				setUsername(username);
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
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [total, setTotal] = useState(0);
	const [nextPage, setNextPage] = useState(null);
	const [prevPage, setPrevPage] = useState(null);
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
				const { role, username, timestamp } = JSON.parse(session);
				if (Date.now() - timestamp < 10 * 60 * 1000) {
					setIsAuthenticated(true);
					setUserRole(role);
					setUsername(username);
				} else {
					localStorage.removeItem("authSession");
				}
			} catch {}
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			axios
				.get(`/api/articulos/?page=${page}&page_size=${pageSize}`)
				.then((res) => {
					setArticulos(res.data.results);
					setTotal(res.data.count);
					setNextPage(res.data.next);
					setPrevPage(res.data.previous);
				})
				.catch((err) => console.error(err));
		} else {
			setArticulos([]);
		}
	}, [isAuthenticated, page, pageSize]);
	// Controles de paginación
	const handleNextPage = () => {
		if (nextPage) setPage(page + 1);
	};
	const handlePrevPage = () => {
		if (prevPage && page > 1) setPage(page - 1);
	};


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


const [singleEditOpen, setSingleEditOpen] = useState(false);
const [singleEditArticulo, setSingleEditArticulo] = useState(null);
const [singleEditLoading, setSingleEditLoading] = useState(false);
const [singleEditError, setSingleEditError] = useState("");


const handleEdit = (articulo) => {
	setSingleEditArticulo(articulo);
	setSingleEditOpen(true);
};


const handleSingleEditSave = (updates) => {
	const upd = updates[0];
	setSingleEditLoading(true);
	setSingleEditError("");
	const session = localStorage.getItem("authSession");
	let username = "";
	if (session) {
		try {
			username = JSON.parse(session).username;
		} catch {}
	}
	axios.patch(`/api/articulos/${singleEditArticulo.id}/`, { ...upd, usuario: username })
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


const fetchArticulos = () => {
	axios.get(`/api/articulos/?page=${page}&page_size=${pageSize}`)
		.then((res) => {
			setArticulos(res.data.results);
			setTotal(res.data.count);
			setNextPage(res.data.next);
			setPrevPage(res.data.previous);
		})
		.catch((err) => console.error(err));
};

const handleDelete = (articulo) => {
	if (window.confirm(`¿Seguro que deseas eliminar el artículo ${articulo.codigo}?`)) {
		axios.delete(`/api/articulos/${articulo.id}/`)
			.then(() => {
				fetchArticulos();
				showToast('Artículo eliminado correctamente', 'success');
			})
			.catch(err => {
				showToast('Error al eliminar el artículo', 'error');
				console.error(err);
			});
	}
};


const [selected, setSelected] = useState([]);


const handleSelect = (codigo, checked) => {
	setSelected(prev => checked ? [...prev, codigo] : prev.filter(c => c !== codigo));
};


const handleSelectAll = (checked) => {
	setSelected(checked ? filteredArticulos.map(a => a.codigo) : []);
};


const handleBulkDelete = () => {
	if (userRole !== 'admin') return; // Solo admin puede eliminar masivamente
	if (selected.length === 0) return;
	if (window.confirm(`¿Seguro que deseas eliminar ${selected.length} artículos seleccionados?`)) {
		axios.post('/api/articulos/bulk-delete/', { codigos: selected })
			.then(() => {
				fetchArticulos();
				setSelected([]);
				showToast('Artículos eliminados correctamente', 'success');
			})
			.catch(err => {
				const failed = err.response?.data?.codigos || [];
				showToast(`Error al eliminar los artículos: ${failed.join(', ')}`, 'error');
			});
	}
};


const [editModalOpen, setEditModalOpen] = useState(false);
const [editLoading, setEditLoading] = useState(false);
const [editError, setEditError] = useState("");


const handleBulkEdit = () => {
	if (selected.length === 0) return;
	setEditModalOpen(true);
};


const handleBulkEditSave = (updates) => {

	const updatesWithId = updates.map(u => {
		const art = articulos.find(a => a.codigo === u.codigo);
		return art ? { ...u, id: art.id } : u;
	});
	setEditLoading(true);
	setEditError("");
	const session = localStorage.getItem("authSession");
	let username = "";
	if (session) {
		try {
			username = JSON.parse(session).username;
		} catch {}
	}
	axios.post('/api/articulos/bulk-update/', { updates: updatesWithId, usuario: username })
		.then(() => {
	
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


const articulosWithHandlers = filteredArticulos.map(a => ({
	...a,
	onEdit: handleEdit,

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
				<div className="header-content" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 32px'}}>
				
					<div style={{display:'flex', alignItems:'center', gap:'16px'}}>
						<span className="header-icon" role="img" aria-label="box" style={{fontSize:'2.2em'}}>
							📦
						</span>
						<h1 style={{fontWeight:900, fontSize:'2.1em', color:'#fff', textShadow:'0 2px 12px #24416b55', marginLeft:8}}>Gestión de Artículos</h1>
					</div>
				
					{isAuthenticated && (
						<div style={{position:'relative', display:'flex', alignItems:'center', gap:'12px'}}>
							<button
								className="user-menu-username"
								onClick={() => setUserMenuOpen(v => !v)}
								aria-haspopup="true"
								aria-expanded={userMenuOpen ? "true" : "false"}
								style={{
									color: username ? '#fff' : '#888',
									fontWeight:700,
									fontSize:'1.1em',
									background: username ? 'none' : '#f3f6fa',
									border: username ? 'none' : '1.5px solid #dbe2ef',
									cursor:'pointer',
									padding:'0 8px',
									textShadow: username ? '0 2px 12px #24416b55' : 'none',
									borderRadius: '8px',
									minWidth: '120px'
								}}
							>
								Usuario: <span style={{color: username ? '#fff' : '#888'}}>{username || '—'}</span> ▼
							</button>
							{userMenuOpen && (
								<div className="user-menu-dropdown" style={{position:'absolute', left:0, top:'100%', minWidth:'180px', boxShadow:'0 8px 32px rgba(0,0,0,0.18)', background:'#f3f6fa', border:'1.5px solid #dbe2ef', marginTop:'6px', zIndex:9999}}>
									<button onClick={() => { setUserModalOpen(true); setUserMenuOpen(false); }}>Gestionar usuario</button>
									<button onClick={() => { alert('Función de ver perfil (simulada)'); setUserMenuOpen(false); }}>Ver perfil</button>
									<button className="logout-btn" onClick={() => { handleLogout(); setUserMenuOpen(false); }}>Cerrar sesión</button>
								</div>
							)}
						</div>
					)}
				</div>
			</header>
			<main>
				{!isAuthenticated ? (
					<LoginPanel onLogin={handleLogin} loginError={loginError} />
				) : (
					<div>
						
						{renderUserModal()}
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
									<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, margin: '18px 0' }}>
										<button
											className="form-panel-button"
											onClick={() => setPage(page - 1)}
											disabled={page === 1 || !prevPage}
											style={page === 1 || !prevPage ? { background: "#eee", color: "#888", cursor: "not-allowed" } : {}}
										>
											Anterior
										</button>
										<span style={{ fontSize: "0.9em", margin: "0 8px" }}>
											Página {page} de {Math.max(1, Math.ceil(total / pageSize))} &nbsp;|&nbsp; Mostrando {articulos.length > 0 ? ((page - 1) * pageSize + 1) : 0} - {((page - 1) * pageSize) + articulos.length} de {total} artículos
										</span>
										<button
											className="form-panel-button"
											onClick={() => setPage(page + 1)}
											disabled={page >= Math.ceil(total / pageSize) || !nextPage}
											style={page >= Math.ceil(total / pageSize) || !nextPage ? { background: "#eee", color: "#888", cursor: "not-allowed" } : {}}
										>
											Siguiente
										</button>
									</div>
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

}

export default App;
