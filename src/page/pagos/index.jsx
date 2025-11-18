"use client"

import { useState } from "react"
import Sidebar from "../../components/sidebar"
import Header from "../../components/header"
import MetodoPago from "../../components/pago/metodo-pago"
import DatosTarjeta from "../../components/pago/datos-tarjeta"
import DireccionEnvio from "../../components/pago/direccion-envio"
import ResumenPedido from "../../components/pago/resumen-pedido"
import { useNavigate } from "react-router-dom"

import { X } from "lucide-react";

function ModalDatosEnvio({isOpen,onClose,onSubmit,datos,onChange,errores}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white border-2 border-[#00000020] rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#00000020]">
                    <h2 className="text-xl font-semibold text-foreground">Datos de Envío</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-accent"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Dirección de Envío <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            value={datos.direccion}
                            onChange={onChange}
                            placeholder="Ej: Calle 29 #22-48"
                            className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        {errores?.direccion && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                {errores.direccion}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Observaciones
                        </label>
                        <textarea
                            name="observaciones"
                            value={datos.observaciones}
                            onChange={onChange}
                            placeholder="Ej: Casa de color blanco, segunda puerta..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-[#00000020] bg-accent/30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium border border-[#00000020] rounded-lg text-foreground bg-background hover:bg-accent transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="flex-1 text-white hover:bg-[#18047c] bg-[#0c13d9] px-4 py-2.5 text-sm font-medium bg-primary rounded-lg transition-colors shadow-sm"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}


export default function PagoSeguro({ onSubmit }) {
    const navigate = useNavigate();
    const productosCarrito = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("carrito") || "[]") : []
    const [metodoPago, setMetodoPago] = useState("tarjeta")
    const [modalAbierto, setModalAbierto] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [datos, setDatos] = useState({
        nombreTitular: "",
        numeroTarjeta: "",
        fechaVencimiento: "",
        cvv: "",
        departamento: "Cesar",
        direccion: "",
        ciudad: "",
        barrio: "",
        codigoPostal: "",
        observaciones: "",
    })
    const [errores, setErrores] = useState({})

    const formatearNumeroTarjeta = (valor) => {
        const v = valor.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
        const match = v.match(/\d{4,16}/g)
        const partes = []
        const num = (match && match[0]) || ""
        for (let i = 0; i < num.length; i += 4) partes.push(num.substring(i, i + 4))
        return partes.length ? partes.join(" ") : valor
    }

    const formatearFecha = (valor) => {
        const v = valor.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
        return v.length >= 2 ? v.slice(0, 2) + "/" + v.slice(2, 4) : v
    }

    const manejarCambio = (e) => {
        const { name, value } = e.target
        let nuevoValor = value

        if (name === "numeroTarjeta") nuevoValor = formatearNumeroTarjeta(value)
        else if (name === "fechaVencimiento") nuevoValor = formatearFecha(value)
        else if (name === "cvv") nuevoValor = value.replace(/[^0-9]/gi, "").slice(0, 4)

        setDatos((prev) => ({ ...prev, [name]: nuevoValor }))
        if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }))
    }

    const validarFormulario = () => {
        const nuevosErrores = {}

        if (metodoPago === "tarjeta") {
            if (!datos.nombreTitular.trim()) nuevosErrores.nombreTitular = "El nombre del titular es requerido"

            const numLimpio = datos.numeroTarjeta.replace(/\s/g, "")
            if (!numLimpio) nuevosErrores.numeroTarjeta = "El número de tarjeta es requerido"
            else if (numLimpio.length < 13 || numLimpio.length > 19)
                nuevosErrores.numeroTarjeta = "Número de tarjeta inválido"

            if (!datos.fechaVencimiento) nuevosErrores.fechaVencimiento = "La fecha de expiración es requerida"
            else if (!/^\d{2}\/\d{2}$/.test(datos.fechaVencimiento))
                nuevosErrores.fechaVencimiento = "Formato inválido (MM/AA)"

            if (!datos.cvv) nuevosErrores.cvv = "El CVV es requerido"
            else if (datos.cvv.length < 3) nuevosErrores.cvv = "CVV inválido"
        }

        if (!datos.direccion.trim()) nuevosErrores.direccion = "La dirección es requerida"
        if (!datos.ciudad.trim()) nuevosErrores.ciudad = "La ciudad es requerida"
        if (!datos.barrio.trim()) nuevosErrores.barrio = "El barrio es requerido"

        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const validarDatosEnvio = () => {
        const nuevosErrores = {}
        if (!datos.direccion.trim()) {
            nuevosErrores.direccion = "La dirección es requerida"
        }
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const enviarPedidoBackend = async () => {
        if (productosCarrito.length === 0) return false

        // Obtener cuenta del comprador desde localStorage
        const cuentaComprador = typeof window !== "undefined"
            ? JSON.parse("null")
            : null

        const idComprador = cuentaComprador?.id || null

        const idsProductos = productosCarrito.flatMap(p =>
            Array(p.cantidad || 1).fill(p.id)
        )

        const totalPagar = productosCarrito.reduce(
            (acc, p) => acc + (p.valor || 0) * (p.cantidad || 0),
            0
        )

        // Obtener ID del negocio del primer producto
        const idNegocio = productosCarrito[0]?.id_Negocio || null

        const pedido = {
            id_Negocio: idNegocio,
            id_Comprador: idComprador,
            ids_Productos: idsProductos,
            total_Pagar: totalPagar,
            metodo_Pago: 3, // 3 para WhatsApp
            direccion_Envio: datos.direccion,
            observaciones: datos.observaciones || "",
        }

        try {
            setEnviando(true)
            const response = await fetch("https://localhost:7012/api/Pedidoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pedido),
            })

            if (!response.ok) {
                throw new Error("Error al crear el pedido")
            }

            const resultado = await response.json()
            console.log("Pedido creado:", resultado)
            return true
        } catch (error) {
            console.error("Error al enviar pedido:", error)
            alert("Error al procesar el pedido. Por favor intenta nuevamente.")
            return false
        } finally {
            setEnviando(false)
        }
    }

    const manejarEnvio = (e) => {
        e.preventDefault()
        if (!validarFormulario()) return

        const datosPago = { metodoPago, ...datos, productos: productosCarrito }
        onSubmit ? onSubmit(datosPago) : alert("¡Pago procesado exitosamente!")
    }

    const manejarWhatsApp = () => {
        if (productosCarrito.length === 0) {
            alert("El carrito está vacío")
            return
        }
        // Abrir modal antes de procesar
        setModalAbierto(true)
    }

    const confirmarYEnviarWhatsApp = async () => {
        if (!validarDatosEnvio()) return

        // Enviar pedido al backend
        const exito = await enviarPedidoBackend()

        if (!exito) return

        // Cerrar modal
        setModalAbierto(false)

        // Crear mensaje de WhatsApp
        const mensaje = `Hola, quiero confirmar mi pedido:\n\n${productosCarrito
            .map((p) => `• ${p.nombre} x${p.cantidad} - $${((p.valor || 0) * (p.cantidad || 0)).toLocaleString("es-CO")}`)
            .join("\n")}\n\nTotal: $${productosCarrito.reduce((acc, p) => acc + (p.valor || 0) * (p.cantidad || 0), 0).toLocaleString("es-CO")}\n\nDirección: ${datos.direccion}${datos.observaciones ? `\nObservaciones: ${datos.observaciones}` : ""}`

        const idNegocio = productosCarrito[0]?.id_Negocio;
        console.log(idNegocio);

        // Limpiar carrito
        localStorage.setItem("carrito", JSON.stringify([]));

        // Redirigir
        navigate(`/negocio/${idNegocio}`);

        // Abrir WhatsApp
        window.open(`https://wa.me/573015016604?text=${encodeURIComponent(mensaje)}`, "_blank")
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Header />
            <Sidebar />
            <div className="max-w-7xl mx-auto">
                <nav className="mb-8 text-sm text-gray-600">
                    <span>Carrito</span>
                    <span className="mx-2">/</span>
                    <span>Envío</span>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-900">Pago</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pago Seguro</h1>
                        <div onSubmit={manejarEnvio} className="space-y-6">
                            <MetodoPago
                                metodoSeleccionado={metodoPago}
                                onCambiarMetodo={setMetodoPago}
                                onWhatsApp={manejarWhatsApp}
                            />
                            {metodoPago === "tarjeta" && <DatosTarjeta datos={datos} errores={errores} onChange={manejarCambio} />}
                            <DireccionEnvio datos={datos} errores={errores} onChange={manejarCambio} />
                        </div>
                    </div>
                    <ResumenPedido productos={productosCarrito} onConfirmar={manejarEnvio} />
                </div>
            </div>

            <ModalDatosEnvio
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSubmit={confirmarYEnviarWhatsApp}
                datos={datos}
                onChange={manejarCambio}
                errores={errores}
            />

            {enviando && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-700">Procesando pedido...</p>
                    </div>
                </div>
            )}
        </div>
    )
}