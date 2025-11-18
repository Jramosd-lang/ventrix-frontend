"use client"

const DEPARTAMENTOS = [
    "Amazonas",
    "Antioquia",
    "Arauca",
    "Atlántico",
    "Bogotá D.C.",
    "Bolívar",
    "Boyacá",
    "Caldas",
    "Caquetá",
    "Casanare",
    "Cauca",
    "Cesar",
    "Chocó",
    "Córdoba",
    "Cundinamarca",
    "Guainía",
    "Guaviare",
    "Huila",
    "La Guajira",
    "Magdalena",
    "Meta",
    "Nariño",
    "Norte de Santander",
    "Putumayo",
    "Quindío",
    "Risaralda",
    "San Andrés y Providencia",
    "Santander",
    "Sucre",
    "Tolima",
    "Valle del Cauca",
    "Vaupés",
    "Vichada",
]

export default function DireccionEnvio({ datos, errores, onChange }) {
    const Campo = ({ id, label, placeholder, error, type = "text" }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {type === "select" ? (
                <select
                    id={id}
                    name={id}
                    value={datos[id]}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                >
                    {DEPARTAMENTOS.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    id={id}
                    name={id}
                    value={datos[id]}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${error ? "border-red-500" : "border-gray-300"
                        }`}
                />
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )

    return (
        <div className="bg-white rounded-lg border border-[#00000020] p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección de Envío</h2>
            <div className="space-y-4">
                <Campo id="departamento" label="Departamento" type="select" />
                <Campo id="direccion" label="Dirección" placeholder="Calle 123 # 45-67" error={errores.direccion} />
                <div className="grid grid-cols-2 gap-4">
                    <Campo id="ciudad" label="Ciudad" placeholder="Bogotá" error={errores.ciudad} />
                    <Campo id="barrio" label="Barrio" placeholder="Chapinero" error={errores.barrio} />
                </div>
                <Campo id="codigoPostal" label="Código Postal (opcional)" placeholder="110111" />
            </div>
        </div>
    )
}
