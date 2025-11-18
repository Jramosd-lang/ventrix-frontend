import { ShoppingCart } from "lucide-react";
import { useState } from 'react'

export default function TargetProductCliente({ onAddToCart, product }) {

    const [imagen, setImagen] = useState(product.imagenUrl);


    // Simplificar la lógica de disponibilidad
    const getStockInfo = () => {
        if (product.stock === 0) {
            return {
                text: "Agotado",
                className: "bg-red-100 text-red-700 border border-red-400",
            };
        }
        if (product.stock < 5) {
            return {
                text: "Poca disponibilidad",
                className: "bg-yellow-100 text-yellow-700 border border-yellow-400",
            };
        }
        return {
            text: "Alta disponibilidad",
            className: "bg-green-100 text-green-700 border border-green-400",
        };
    };

    const stockInfo = getStockInfo();


    return (
        <div
            className="h-80 w-58 hover:bg-[#00000008] relative transition-all duration-100 flex flex-col border-1 rounded-xl shadow-md border-[#00000020]">

            <div className="flex w-full relative bg-[#00000005] h-54 rounded-t-[11px] overflow-hidden">
                <img
                    src={imagen}
                    onError={(e) => {
                        console.log("Error loading image for:", product.nombre);
                        if (imagen !== "/package.svg") {
                            e.target.src = "/package.svg"; // Cambio directo en el DOM
                            setImagen("/package.svg");
                        }
                    }}
                    alt={product.nombre}
                    className="object-cover w-full"
                />
                <div
                    className={`flex px-2 py-1 rounded-xl absolute bottom-2 right-2 text-sm font-medium ${stockInfo.className}`}
                >
                    <p>{stockInfo.text}</p>
                </div>
            </div>
            <div className="flex flex-col flex-1 p-4">
                <h3 className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{product.nombre}</h3>
                <h4 className="text-gray-600 text-[12px]">{`Stock: ${product.stock}`}</h4>
                <span className="text-[#111111] text-[14px]">${Number(product.valor).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <div className="w-full flex justify-center mt-2 ">
                    <button
                        onClick={() => { onAddToCart(product) }}
                        className=" hover:bg-[#4F46E5] hover:text-white flex gap-2 justify-center border-2 border-[#4F46E5] text-[#4F46E5] rounded-md w-full px-2 py-1 bg-white transition-all duration-200">
                        <ShoppingCart width={20} height={20} /> Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}