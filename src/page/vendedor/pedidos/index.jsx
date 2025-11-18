"use client"
import { iniciarConexion } from '../../../utils/Conexion_hub'
import { useState, useEffect } from "react"
import Sidebar from "../../../components/sidebar"
import Header from "../../../components/header"
import Alert from "../../../components/alert/index"


export default function PaginaPedidos() {

    const id_negocio = JSON.parse(localStorage.getItem("cuenta")).id_negocio;
    console.log("ID del negocio desde localStorage:", localStorage.getItem("cuenta").id_negocio);
    const [pedidos, setPedidos] = useState([])
    const [pedidosFiltrados, setPedidosFiltrados] = useState([])
    const [cargando, setCargando] = useState(true)
    const [terminoBusqueda, setTerminoBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("Todos")
    const [paginaActual, setPaginaActual] = useState(1)
    const [mostrarMenuEstado, setMostrarMenuEstado] = useState(false)
    const pedidosPorPagina = 5

    const obtenerColorEstado = (estado) => {
        switch (estado?.toLowerCase()) {
            case "entregado": return "bg-green-100 text-green-700"
            case "enviado": return "bg-blue-100 text-blue-700"
            case "pendiente": return "bg-yellow-100 text-yellow-700"
            case "cancelado": return "bg-red-100 text-red-700"
            default: return "bg-gray-100 text-gray-700"
        }
    }

    const obtenerPedidos = async () => {
        try {
            console.log("Obteniendo pedidos para el negocio:", id_negocio);
            const respuesta = await fetch(`https://localhost:7012/api/Pedidoes/negocio/${id_negocio}`);
            const datos = await respuesta.json();
            setPedidos(Array.isArray(datos) ? datos : [datos]);
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
        } finally {
            setCargando(false);
        }
    };


    useEffect(() => {
        obtenerPedidos();

        let id_Negocio = null;
        try {
            const cuenta = localStorage.getItem("cuentaUsuario");
            if (cuenta) id_Negocio = JSON.parse(cuenta).id_Negocio;
        } catch (error) {
            console.error("Error al leer localStorage:", error);
        }

        const configurarSignalR = async () => {
            try {
                const conn = await iniciarConexion();
                if (!conn) return;

                if (id_Negocio) {
                    await conn.invoke("UnirseAlNegocio", id_Negocio);
                    console.log(`Unido al negocio: ${id_Negocio}`);
                }

                // NO usar conn.off() - solo agregar el handler
                // Usar handler con nombre para poder limpiarlo después
                const handlerPedidos = (nuevoPedido) => {
                    console.log("PaginaPedidos - Nuevo pedido recibido:", nuevoPedido);
                    setPedidos((prev) => [...prev, nuevoPedido]);
                };

                conn.on("PedidoRecibido", handlerPedidos);

                // Handler de evento custom
                const manejarNuevoPedido = (e) => {
                    console.log("PaginaPedidos - Evento recibido (custom):", e.detail);
                    setPedidos((prev) => [...prev, e.detail]);
                };

                window.addEventListener("nuevoPedido", manejarNuevoPedido);

            } catch (error) {
                console.error("PaginaPedidos - Error al configurar SignalR:", error);
            }
        };

        configurarSignalR()


        return () => {
            window.removeEventListener("nuevoPedido", () => {});
        };
    }, []);

    useEffect(() => {
        let filtrados = pedidos;
        if (filtroEstado !== "Todos") {
            filtrados = filtrados.filter((p) => p.estado === filtroEstado);
        }
        if (terminoBusqueda) {
            filtrados = filtrados.filter((p) =>
                `${p.comprador?.nombre || ""} ${p.comprador?.apellido || ""}`
                    .toLowerCase()
                    .includes(terminoBusqueda.toLowerCase())
            );
        }
        setPedidosFiltrados(filtrados);
        // Resetear a la primera página cuando cambian los filtros
        setPaginaActual(1);
    }, [pedidos, filtroEstado, terminoBusqueda]);

    const formatearFecha = (fechaTexto) => {
        if (!fechaTexto) return "-"
        const fecha = new Date(fechaTexto)
        return fecha.toISOString().split("T")[0]
    }

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor || 0)
    }

    const indiceUltimoPedido = paginaActual * pedidosPorPagina
    const indicePrimerPedido = indiceUltimoPedido - pedidosPorPagina
    const pedidosActuales = pedidosFiltrados.slice(indicePrimerPedido, indiceUltimoPedido)
    const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina) || 1

    // Validar que la página actual sea válida
    useEffect(() => {
        if (paginaActual > totalPaginas && totalPaginas > 0) {
            setPaginaActual(totalPaginas);
        }
    }, [totalPaginas, paginaActual]);

    const cambiarPagina = (numero) => {
        if (numero >= 1 && numero <= totalPaginas) {
            setPaginaActual(numero);
            // Scroll suave hacia arriba de la tabla
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Función para generar los números de página a mostrar
    const obtenerNumerosPagina = () => {
        const paginas = [];
        const paginasVisibles = 5; // Número de botones de página a mostrar
        
        if (totalPaginas <= paginasVisibles) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPaginas; i++) {
                paginas.push(i);
            }
        } else {
            // Mostrar páginas alrededor de la actual
            let inicio = Math.max(1, paginaActual - Math.floor(paginasVisibles / 2));
            let fin = Math.min(totalPaginas, inicio + paginasVisibles - 1);
            
            // Ajustar si estamos cerca del final
            if (fin - inicio < paginasVisibles - 1) {
                inicio = Math.max(1, fin - paginasVisibles + 1);
            }
            
            for (let i = inicio; i <= fin; i++) {
                paginas.push(i);
            }
        }
        
        return paginas;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-22">
            <Sidebar />
            <Header />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        + Crear pedido
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-[300px] relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por ID o nombre del cliente..."
                                value={terminoBusqueda}
                                onChange={(e) => setTerminoBusqueda(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setMostrarMenuEstado(!mostrarMenuEstado)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px] text-left flex items-center justify-between"
                            >
                                <span className="text-gray-700">
                                    Estado: {filtroEstado === "Todos" ? "Todos" : filtroEstado}
                                </span>
                                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {mostrarMenuEstado && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                    {["Todos", "Pendiente", "Enviado", "Entregado", "Cancelado"].map((estado) => (
                                        <button
                                            key={estado}
                                            onClick={() => {
                                                setFiltroEstado(estado)
                                                setMostrarMenuEstado(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {estado}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {cargando ? (
                        <div className="p-12 text-center text-gray-500">Cargando pedidos...</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID Pedido
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                Dirección de Envío
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pedidosActuales.map((pedido) => (
                                            <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{pedido.codigo || pedido.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {pedido.comprador
                                                        ? `${pedido.comprador.nombre} ${pedido.comprador.apellido}`
                                                        : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatearFecha(pedido.fecha_Creacion)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${obtenerColorEstado(
                                                            pedido.estado
                                                        )}`}
                                                    >
                                                        {pedido.estado || "Desconocido"}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                    {pedido.direccion_Envio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatearMoneda(pedido.total_Pagar)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        Ver detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {pedidosFiltrados.length === 0 ? 0 : indicePrimerPedido + 1} a {Math.min(indiceUltimoPedido, pedidosFiltrados.length)} de{" "}
                                    {pedidosFiltrados.length} resultados
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => cambiarPagina(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Página anterior"
                                    >
                                        <svg 
                                            className="w-5 h-5 text-gray-600" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M15 19l-7-7 7-7" 
                                            />
                                        </svg>
                                    </button>

                                    {/* Mostrar primera página si no está visible */}
                                    {obtenerNumerosPagina()[0] > 1 && (
                                        <>
                                            <button
                                                onClick={() => cambiarPagina(1)}
                                                className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                1
                                            </button>
                                            {obtenerNumerosPagina()[0] > 2 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                        </>
                                    )}

                                    {/* Páginas visibles */}
                                    {obtenerNumerosPagina().map((numeroPagina) => (
                                        <button
                                            key={numeroPagina}
                                            onClick={() => cambiarPagina(numeroPagina)}
                                            className={`h-9 w-9 flex items-center justify-center rounded-md transition-colors ${
                                                paginaActual === numeroPagina
                                                    ? "bg-blue-600 text-white hover:bg-blue-700 font-medium"
                                                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                                            }`}
                                        >
                                            {numeroPagina}
                                        </button>
                                    ))}

                                    {/* Mostrar última página si no está visible */}
                                    {obtenerNumerosPagina()[obtenerNumerosPagina().length - 1] < totalPaginas && (
                                        <>
                                            {obtenerNumerosPagina()[obtenerNumerosPagina().length - 1] < totalPaginas - 1 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => cambiarPagina(totalPaginas)}
                                                className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                {totalPaginas}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => cambiarPagina(paginaActual + 1)}
                                        disabled={paginaActual === totalPaginas || totalPaginas === 0}
                                        className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Página siguiente"
                                    >
                                        <svg 
                                            className="w-5 h-5 text-gray-600" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M9 5l7 7-7 7" 
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}