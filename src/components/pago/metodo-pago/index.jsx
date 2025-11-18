"use client"

import { CreditCard } from "lucide-react"
import IconoWhatsApp from "../icono-whatsapp/index"

export default function MetodoPago({ metodoSeleccionado, onCambiarMetodo, onWhatsApp }) {
    const Boton = ({ activo, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${activo
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
        >
            {children}
        </button>
    )

    return (
        <div className="bg-white rounded-lg border border-[#00000020] p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Método de Pago</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Boton activo={metodoSeleccionado === "tarjeta"} onClick={() => onCambiarMetodo("tarjeta")}>
                    <CreditCard size={20} />
                    <span className="font-medium">Tarjeta</span>
                </Boton>
                <Boton activo={metodoSeleccionado === "pse"} onClick={() => onCambiarMetodo("pse")}>
                    <span className="font-bold text-lg">PSE</span>
                </Boton>
            </div>
            <button
                type="submit"
                onClick={onWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-green-500 hover:bg-green-50 text-gray-700 transition-all"
            >
                <IconoWhatsApp className="w-5 h-5" />
                <span className="font-medium">Pagar por WhatsApp</span>
            </button>
        </div>
    )
}
