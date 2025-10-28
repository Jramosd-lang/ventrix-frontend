

import { Link } from "react-router-dom"
import { useState } from "react"
import Alert from "../../components/alert/index"

export default function Registro() {
    
    const [position, setPosition] = useState(1)
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        usuario: "",
        numeroDocumento: "",
        email: "",
        password: "",
        confirmPassword: "",
        tipoDocumento: "",
        plan: "",
        nombreNegocio: "",
        direccion: "",
        imagenes: "",
        urlLogo: "",
        descripcion: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null) // { id, message }
    const [success, setSuccess] = useState(null) // { id, message }

    function onChange(e) {
        const { name, value } = e.target
        setForm((s) => ({ ...s, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
    setError(null)
    setSuccess(null)

        if (!form.nombre || !form.apellido || !form.email || !form.password) {
            setError({ id: Date.now(), message: 'Por favor completa los campos requeridos: nombre, apellido, email y contraseña.' })
            return
        }
        if (form.password !== form.confirmPassword) {
            setError({ id: Date.now(), message: 'Las contraseñas no coinciden.' })
            return
        }

        setLoading(true)
        try {
            // Map form values to the API schema you provided
            const mapTipoDocumento = (t) => {
                // Assumption: map string keys to numeric codes
                // cc -> 0, ce -> 1, ti -> 2
                if (!t) return null
                const map = { cc: 0, ce: 1, ti: 2 }
                return map[t] ?? null
            }

            const negocioImagenes = form.imagenes
                ? form.imagenes.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
                : []

            const startDate = new Date()
            const endDate = new Date(startDate)
            endDate.setMonth(endDate.getMonth() + 1)
            const fmt = (d) => d.toISOString().slice(0, 10)

            const payload = {
                nombre: form.nombre || "",
                apellido: form.apellido || "",
                correo: form.email || "",
                telefono: String(form.telefono || ""),
                clave_Hasheada: form.password || "",
                usuario: form.usuario || "",
                numero_Documento: String(form.numeroDocumento || ""),
                tipo_Documento: mapTipoDocumento(form.tipoDocumento),
                negocio: {
                    nombre: form.nombreNegocio || "",
                    direccion: form.direccion || "",
                    urlLogo: form.urlLogo || "",
                    descripcion: form.descripcion || "",
                    productos: [],
                    imagenes: negocioImagenes,
                    metodos_Pago: [],
                },
                plan: form.plan || "",
                administradores: [],
                fecha_Inicio_Plan: fmt(startDate),
                fecha_Fin_Plan: fmt(endDate),
                metodos_De_Pago: [],
            }

            // Use VITE_API_URL override if provided, otherwise post to the provided endpoint
            const apiBase = import.meta.env.VITE_API_URL || ''
            const url = apiBase
                ? apiBase.replace(/\/$/, '') + '/api/Vendedors'
                : 'https://localhost:7012/api/Vendedors'
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const text = await res.text().catch(() => null)
                throw new Error(text || `HTTP ${res.status}`)
            }
            setSuccess({ id: Date.now(), message: 'Registro exitoso. Revisa tu correo para confirmar.' })
        } catch (err) {
            console.error(err)
            setError({ id: Date.now(), message: err.message || 'Error en el registro' })
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="flex items-center min-h-screen justify-center bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="shadow-lg bg-white relative border border-[#00000020] flex h-fit flex-col w-140 max-w-4xl rounded-xl items-center justify-center p-8"
                >
                {error && (
                    <Alert
                        tipo="error"
                        mensaje={{ title: "Error", description: error.message }}
                        duration={3000}
                        onClose={() => setError(null)}
                    />
                )}
                
                <div className="absolute text-gray-600 top-[-40px] w-full max-sm:text-sm h-fit rounded-t-xl flex justify-end gap-2 px-5">
                    <div className="relative bg-white border-t-2 border-l border-r border-[#059669] gap-2 outline-none w-fit px-5 h-10 rounded-t-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <p className="font-medium text-[#059669]">Vendedor</p>
                    </div>
                    <div className="relative bg-gray-50 border-t border-l border-r gap-2 border-gray-300 w-fit px-5 h-10 rounded-t-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <p className="text-gray-500">Comprador</p>
                    </div>
                </div>

                <div className="w-full justify-center mb-4 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">Registro</h1>
                    <p className="text-sm text-gray-600">
                        Bienvenido a Ventrix, por favor completa el siguiente formulario para registrarte.
                    </p>
                </div>

                <div className="w-full mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${position >= 1 ? "bg-[#059669] text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                            1
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-[#059669] transition-all duration-500 ${position >= 2 ? "w-full" : "w-0"}`}
                            ></div>
                        </div>
                    </div>
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${position >= 2 ? "bg-[#059669] text-white" : "bg-gray-200 text-gray-500"}`}
                    >
                        2
                    </div>
                </div>

                <div className="w-full overflow-hidden relative" style={{ minHeight: "420px" }}>
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${(position - 1) * 50}%)`,
                            width: "200%",
                        }}
                    >
                        {/* Step 1 */}
                        <div className="flex-shrink-0 px-2" style={{ width: "50%" }}>
                            <div className="flex justify-around gap-6 max-sm:flex-col max-sm:gap-4">
                                <div className="flex flex-col w-full gap-4">
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="nombre" className="text-sm font-semibold mb-1 text-gray-700">
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            value={form.nombre}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="apellido" className="text-sm font-semibold mb-1 text-gray-700">
                                            Apellido
                                        </label>
                                        <input
                                            id="apellido"
                                            name="apellido"
                                            value={form.apellido}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="Ingresa tu apellido"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="telefono" className="text-sm font-semibold mb-1 text-gray-700">
                                            Teléfono
                                        </label>
                                        <input
                                            id="telefono"
                                            name="telefono"
                                            value={form.telefono}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="tel"
                                            placeholder="Ingresa tu teléfono"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="usuario" className="text-sm font-semibold mb-1 text-gray-700">
                                            Usuario
                                        </label>
                                        <input
                                            id="usuario"
                                            name="usuario"
                                            value={form.usuario}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="Elige un usuario"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="numeroDocumento" className="text-sm font-semibold mb-1 text-gray-700">
                                            Número de documento
                                        </label>
                                        <input
                                            id="numeroDocumento"
                                            name="numeroDocumento"
                                            value={form.numeroDocumento}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="Número de documento"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full gap-4">
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="email" className="text-sm font-semibold mb-1 text-gray-700">
                                            Correo electrónico
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            value={form.email}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="password" className="text-sm font-semibold mb-1 text-gray-700">
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            value={form.password}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="password"
                                            placeholder="Crea una contraseña"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="confirmPassword" className="text-sm font-semibold mb-1 text-gray-700">
                                            Confirmar contraseña
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="password"
                                            placeholder="Confirma tu contraseña"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="tipoDocumento" className="text-sm font-semibold mb-1 text-gray-700">
                                            Tipo de documento
                                        </label>
                                        <select
                                            id="tipoDocumento"
                                            name="tipoDocumento"
                                            value={form.tipoDocumento}
                                            onChange={onChange}
                                            className="border rounded-lg py-1.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all bg-white"
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="cc">Cédula de Ciudadanía</option>
                                            <option value="ce">Cédula de Extranjería</option>
                                            <option value="ti">Tarjeta de Identidad</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex-shrink-0 px-2" style={{ width: "50%" }}>
                            <div className="flex justify-around gap-6 max-sm:flex-col max-sm:gap-4">
                                <div className="flex flex-col w-full gap-4">
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="plan" className="text-sm font-semibold mb-1.5 text-gray-700">
                                            Plan a seleccionar
                                        </label>
                                        <select
                                            id="plan"
                                            name="plan"
                                            value={form.plan}
                                            onChange={onChange}
                                            className="border rounded-lg py-2.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all bg-white"
                                        >
                                            <option value="">Seleccione un plan</option>
                                            <option value="basico">Básico</option>
                                            <option value="premium">Premium</option>
                                            <option value="empresarial">Empresarial</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label htmlFor="nombreNegocio" className="text-sm font-semibold mb-1.5 text-gray-700">
                                            Nombre del negocio
                                        </label>
                                        <input
                                            id="nombreNegocio"
                                            name="nombreNegocio"
                                            value={form.nombreNegocio}
                                            onChange={onChange}
                                            className="border rounded-lg py-2.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="Ej: Ventrix Store"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label htmlFor="direccion" className="text-sm font-semibold mb-1.5 text-gray-700">
                                            Dirección
                                        </label>
                                        <input
                                            id="direccion"
                                            name="direccion"
                                            value={form.direccion}
                                            onChange={onChange}
                                            className="border rounded-lg py-2.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="Calle 123 #45-67"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label htmlFor="imagenes" className="text-sm font-semibold mb-1.5 text-gray-700">
                                            Lista de URLs de imágenes
                                        </label>
                                        <textarea
                                            id="imagenes"
                                            name="imagenes"
                                            value={form.imagenes}
                                            onChange={onChange}
                                            className="border rounded-lg py-2.5 border-gray-300 h-22 px-3 resize-none focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            placeholder="Una URL por línea"
                                            rows={4}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full gap-4">
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="urlLogo" className="text-sm font-semibold mb-1.5 text-gray-700">
                                            URL del logo
                                        </label>
                                        <input
                                            id="urlLogo"
                                            name="urlLogo"
                                            value={form.urlLogo}
                                            onChange={onChange}
                                            className="border rounded-lg py-2.5 border-gray-300 px-3 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            type="text"
                                            placeholder="https://tusitio.com/logo.png"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label htmlFor="descripcion" className="text-sm font-semibold mb-1.5 text-gray-700">
                                            Descripción del negocio
                                        </label>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={form.descripcion}
                                            onChange={onChange}
                                            className="border rounded-lg py-2.5 border-gray-300 px-3 resize-none focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
                                            placeholder="Describe brevemente tu negocio..."
                                            rows={4}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8 w-full justify-between absolute bottom-8 pb-6 px-8">
                    {position > 1 ? (
                        <button
                            type="button"
                            onClick={() => setPosition(position - 1)}
                            className="bg-gray-100 hover:bg-gray-200 transition-all w-11 h-11 rounded-lg text-gray-700 flex justify-center items-center shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    ) : (
                        <div></div>
                    )}
                    {position < 2 && (
                        <button
                            type="button"
                            onClick={() => setPosition(position + 1)}
                            className="bg-[#059669] hover:bg-[#047857] transition-all px-6 py-2.5 rounded-lg text-white font-semibold shadow-sm hover:shadow flex items-center gap-2"
                        >
                            Siguiente
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                    {position === 2 && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#059669] hover:bg-[#047857] transition-all px-8 py-2.5 rounded-lg text-white font-semibold shadow-sm hover:shadow"
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    )}
                </div>

                {success && (
                    <Alert
                        tipo="success"
                        mensaje={{ title: "Éxito", description: success.message }}
                        duration={3000}
                        onClose={() => setSuccess(null)}
                    />
                )}

                <p className="text-sm mt-6 text-gray-600 z-2">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-[#059669] hover:text-[#047857] font-semibold hover:underline">Inicia Sesión</Link>
                </p>
            </form>
        </div>
    )
}
