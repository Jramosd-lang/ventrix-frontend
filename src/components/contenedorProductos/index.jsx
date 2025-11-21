import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { ArrowUpDown, Package, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import TargetProduct from "../targetProduct"
import TargetProductCliente from "../cliente/targetProductCliente"
import TarjetaCrearProducto from "../tarjetaCrearProducto"
import TargetProductPrueba from "../targetProductPrueba/index"
import ModalCrearProducto from "../modal/modalCrearProducto"
import CarritoCompras from "../CarritoCompras"
import Alert from "../alert"

const ITEMS_POR_PAGINA = 12

export default function ContenedorProductos({ mode, id_negocio_comprador }) {
    
    const idNegocio = mode === "vendedor"
    ? JSON.parse(localStorage.getItem("cuenta"))?.id_negocio
    : id_negocio_comprador;

    const [onOpen, setOnOpen] = useState(false);
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [productoEditar, setProductoEditar] = useState(null)
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
    const [productosElegidos, setProductosElegidos] = useState([])
    const [ordenPrecio, setOrdenPrecio] = useState(null)
    const [mostrarSoloDisponibles, setMostrarSoloDisponibles] = useState(false)
    const [terminoBusqueda, setTerminoBusqueda] = useState("")
    const [paginaActual, setPaginaActual] = useState(1)
    const [alerta, setAlerta] = useState(null)
    
    const controladorRef = useRef(null)
    const base = import.meta.env.VITE_API_URL ?? "https://localhost:7012"

    const productosFiltrados = useMemo(() => {
        let resultado = [...productos]

        if (terminoBusqueda.trim()) {
            const term = terminoBusqueda.toLowerCase()
            resultado = resultado.filter(p =>
                p.nombre?.toLowerCase().includes(term) ||
                p.descripcion?.toLowerCase().includes(term)
            )
        }

        if (mostrarSoloDisponibles) {
            resultado = resultado.filter(p => p.disponible === true || p.stock > 0)
        }

        if (ordenPrecio) {
            resultado.sort((a, b) => {
                const diff = (a.valor || 0) - (b.valor || 0)
                return ordenPrecio === "asc" ? diff : -diff
            })
        }

        return resultado
    }, [productos, terminoBusqueda, mostrarSoloDisponibles, ordenPrecio])

    const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA)
    const productosPaginados = useMemo(() => {
        const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA
        return productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA)
    }, [productosFiltrados, paginaActual])

    useEffect(() => {
        setPaginaActual(1)
    }, [terminoBusqueda, mostrarSoloDisponibles, ordenPrecio])

    const obtenerProductos = useCallback(async () => {
        setCargando(true)
        controladorRef.current?.abort()
        const controlador = new AbortController()
        controladorRef.current = controlador

        try {
            
            if (mode === "vendedor") {
                const cuentaStr = localStorage.getItem("cuenta")
                if (!cuentaStr) throw new Error("No se encontró cuentaUsuario en localStorage")
            } else if (!idNegocio) {
                throw new Error("No se proporcionó un ID de negocio válido.")
            }

            const url = `${base}/api/Negocios/${idNegocio}/productos`
            console.log("Obteniendo productos desde:", url)
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            
            const data = await res.json()
            setProductos(Array.isArray(data) ? data : [])
            setError(null)
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Error al obtener productos", err)
                setError(err.message || "Error al cargar los productos")
            }
        } finally {
            setCargando(false)
        }
    }, [base, idNegocio, mode])

    useEffect(() => {
        obtenerProductos()
        return () => controladorRef.current?.abort()
    }, [obtenerProductos])

    const mostrarAlerta = (tipo, titulo, descripcion) => {
        setAlerta({
            tipo,
            mensaje: {
                title: titulo,
                description: descripcion
            }
        })
    }

    const manejarCarrito = {
        añadir: (producto) => {
            // Validar stock antes de agregar
            if (producto.stock === 0) {
                mostrarAlerta('error', 'Sin stock', 'Este producto no tiene stock disponible');
                return;
            }
            
            setProductosElegidos(prev => {
                const existente = prev.find(p => p.id === producto.id)
                if (existente) {
                    // Si ya existe, verificar que no supere el stock
                    if (existente.cantidad >= producto.stock) {
                        mostrarAlerta('info', 'Cantidad máxima', `Solo hay ${producto.stock} unidades disponibles`);
                        return prev; // No modificar el estado
                    }
                    return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
                }
                return [...prev, { ...producto, cantidad: 1 }]
            })
        },
        incrementar: (id) => {
            setProductosElegidos(prev => prev.map(p => 
                p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
            ))
        },
        decrementar: (id) => {
            setProductosElegidos(prev => {
                const producto = prev.find(p => p.id === id)
                if (producto.cantidad > 1) {
                    return prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p)
                }
                return prev.filter(p => p.id !== id)
            })
        },
        eliminar: (id) => {
            setProductosElegidos(prev => prev.filter(p => p.id !== id))
        }
    }

    const alternarOrdenPrecio = () => {
        setOrdenPrecio(prev => prev === null ? "asc" : prev === "asc" ? "desc" : null)
    }

    const limpiarFiltros = () => {
        setOrdenPrecio(null)
        setMostrarSoloDisponibles(false)
        setTerminoBusqueda("")
    }

    const abrirModalEditar = (producto) => {
        setProductoEditar(producto)
        setModalEditarAbierto(true)
    }

    const cerrarModalEditar = () => {
        setProductoEditar(null)
        setModalEditarAbierto(false)
        if (mode === "vendedor") obtenerProductos()
    }

    const hayFiltrosActivos = ordenPrecio || mostrarSoloDisponibles || terminoBusqueda

    return (
        <div className="flex flex-col gap-6 justify-start px-4 md:px-20 lg:px-40 w-full">
            {alerta && (
                <Alert
                    tipo={alerta.tipo}
                    mensaje={alerta.mensaje}
                    duration={3000}
                    onClose={() => setAlerta(null)}
                />
            )}

            {mode === "cliente" && (
                <CarritoCompras
                    onOpen={onOpen}
                    productosElegidos={productosElegidos}
                    onIncrease={manejarCarrito.incrementar}
                    onDecrease={manejarCarrito.decrementar}
                    onRemove={manejarCarrito.eliminar}
                    idNegocio={idNegocio}
                />
            )}

            <div className="w-full flex flex-col md:flex-row gap-4 md:gap-0">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500 mt-1">
                        {mode === "vendedor" 
                            ? "Administra y filtra tus productos"
                            : "Explora los productos disponibles"
                        }
                    </p>
                </div>
                {mode === "vendedor" && (
                    <div>
                        <TarjetaCrearProducto  onClose={obtenerProductos} />
                    </div>
                )}
            </div>

            {/* Filtros */}
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342bd7] focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <button
                        onClick={alternarOrdenPrecio}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            ordenPrecio
                                ? "bg-[#4F46E5] text-white shadow-md hover:bg-[#342bd7]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        <span className="text-sm">
                            {ordenPrecio === null ? "Ordenar" : `Precio ${ordenPrecio === "asc" ? "↑" : "↓"}`}
                        </span>
                    </button>

                    <button
                        onClick={() => setMostrarSoloDisponibles(!mostrarSoloDisponibles)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            mostrarSoloDisponibles
                                ? "bg-[#4F46E5] text-white shadow-md hover:bg-[#382fde]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <Package className="h-4 w-4" />
                        <span className="text-sm">Disponibles</span>
                    </button>

                    {hayFiltrosActivos && (
                        <button
                            onClick={limpiarFiltros}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                        >
                            <X className="h-4 w-4" />
                            <span className="text-sm">Limpiar</span>
                        </button>
                    )}

                    <div className="ml-auto text-sm text-gray-600 font-medium">
                        {productosFiltrados.length} {productosFiltrados.length === 1 ? "producto" : "productos"}
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex flex-wrap w-full gap-6">
                {cargando && <div className="text-gray-500">Cargando productos...</div>}
                {error && <div className="text-red-500">Error: {error}</div>}
                {!cargando && !error && productosFiltrados.length === 0 && (
                    <div className="w-full text-center py-12 text-gray-500">
                        {hayFiltrosActivos
                            ? "No se encontraron productos con los filtros aplicados"
                            : "No hay productos disponibles"
                        }
                    </div>
                )}

                {mode === "vendedor" &&
                    productosPaginados.map(p => (
                        <TargetProduct
                            key={p.id}
                            product={p}
                            onDeleted={obtenerProductos}
                            onEdit={abrirModalEditar}
                            onClick={() => {setOnOpen(true)}}
                        />
                    ))
                }
                {mode === "prueba-vendedor" && 
                productosPaginados.map(p => (
                    <TargetProductPrueba
                        key={p.id}
                        product={p}
                        onAddToCart={() => manejarCarrito.añadir(p)}
                    />
                ))}
                {mode === "cliente" &&
                    productosPaginados.map(p => (
                        <TargetProductCliente 
                            key={p.id} 
                            product={p} 
                            onAddToCart={manejarCarrito.añadir} 
                        />
                    ))
                }
            </div>

            {/* Paginación */}
            {!cargando && !error && totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 pb-8">
                    <button
                        onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                        disabled={paginaActual === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                onClick={() => setPaginaActual(num)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    paginaActual === num
                                        ? "bg-[#4F46E5] text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                        disabled={paginaActual === totalPaginas}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {mode === "vendedor" && (
                <ModalCrearProducto
                    isOpen={modalEditarAbierto}
                    onClose={cerrarModalEditar}
                    type="edit"
                    product={productoEditar}
                />
            )}
        </div>
    )
}