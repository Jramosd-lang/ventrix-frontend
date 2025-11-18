"use client"

import { Lock } from "lucide-react"

export default function ResumenPedido({ productos, onConfirmar }) {
    const subtotal = productos.reduce((acc, p) => acc + (p.valor || 0) * (p.cantidad || 0), 0)
    const envio = subtotal > 100000 ? 0 : 15000
    const total = subtotal + envio

    return (
        <div className="flex flex-col gap-6 p-6 sticky self-start top-20">
            <div className="bg-white flex flex-col border border-[#00000020] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {productos.length > 0 ? (
                        productos.map((p) => (
                            <div key={p.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img src={p.imagenUrl || "/placeholder.svg"} alt={p.nombre} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">{p.nombre}</h3>
                                    <p className="text-sm text-gray-500">Cant: {p.cantidad}</p>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                    ${((p.valor || 0) * (p.cantidad || 0)).toLocaleString("es-CO")}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay productos en el carrito</p>
                    )}
                </div>

                <div className="space-y-2 py-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${subtotal.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío</span>
                        <span className="text-gray-900">{envio === 0 ? "Gratis" : `$${envio.toLocaleString("es-CO")}`}</span>
                    </div>
                    {subtotal > 100000 && <p className="text-xs text-green-600">¡Envío gratis por compra mayor a $100.000!</p>}
                </div>

                <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-semibold text-gray-900">${total.toLocaleString("es-CO")}</span>
                </div>
            </div>

            <button
                type="submit"
                onClick={onConfirmar}
                disabled={productos.length === 0}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm ${productos.length === 0
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
            >
                {productos.length === 0 ? "Carrito vacío" : "Confirmar Pago"}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Pago 100% seguro</span>
            </div>
        </div>
    )
}
