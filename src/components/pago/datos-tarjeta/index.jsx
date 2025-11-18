"use client"

export default function DatosTarjeta({ datos, errores, onChange }) {
    const Campo = ({ id, label, placeholder, maxLength, error, ...props }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={id}
                name={id}
                value={datos[id]}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${error ? "border-red-500" : "border-gray-300"
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )

    return (
        <div className="bg-white rounded-lg border border-[#00000020] p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Tarjeta</h2>
            <div className="space-y-4">
                <Campo
                    id="nombreTitular"
                    label="Nombre del Titular"
                    placeholder="Como aparece en la tarjeta"
                    error={errores.nombreTitular}
                />
                <Campo
                    id="numeroTarjeta"
                    label="Número de Tarjeta"
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    error={errores.numeroTarjeta}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Campo
                        id="fechaVencimiento"
                        label="Fecha de Vencimiento"
                        placeholder="MM/AA"
                        maxLength="5"
                        error={errores.fechaVencimiento}
                    />
                    <Campo id="cvv" label="CVV" placeholder="123" maxLength="4" error={errores.cvv} />
                </div>
            </div>
        </div>
    )
}
