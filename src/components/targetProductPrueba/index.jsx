import { useState } from "react";

export default function TargetProductPrueba({ product, onAddToCart }) {
    const [imagen, setImagen] = useState(product.imagenUrl);

    const getStockInfo = () => {
        if (product.stock === 0)
            return { text: "Agotado", className: "bg-red-100 text-red-700 border border-red-400" };

        if (product.stock < 5)
            return { text: "Poca disponibilidad", className: "bg-yellow-100 text-yellow-700 border border-yellow-400" };

        return { text: "Disponible", className: "bg-green-100 text-green-700 border border-green-400" };
    };

    const stockInfo = getStockInfo();

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
            
            <div className="w-24 h-24 flex-shrink-0 relative">
                <img
                    src={imagen}
                    onError={() => setImagen("package.svg")}
                    alt={product.nombre}
                    className="object-cover w-full h-full rounded-lg"
                />

                <span
                    className={`absolute bottom-1 right-1 px-2 py-0.5 text-xs rounded-full border ${stockInfo.className}`}
                >
                    {stockInfo.text}
                </span>
            </div>

            <div className="flex flex-col flex-1 gap-1">
                <h3 className="font-semibold text-gray-900 truncate">
                    {product.nombre}
                </h3>

                <p className="text-gray-600 text-sm">
                    Stock: {product.stock}
                </p>

                <span className="mt-auto font-semibold text-gray-900">
                    ${product.valor}
                </span>
            </div>

            {onAddToCart && (
                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#342bd7] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium text-sm"
                >
                    Agregar
                </button>
            )}
        </div>
    );
}