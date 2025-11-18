import { Trash, Pencil } from "lucide-react";
import { useRef, useState } from "react";

export default function TargetProduct({ product, onDeleted, onEdit }) {
    const controllerRef = useRef(null);
    const [imagen, setImagen] = useState(product.imagenUrl);

    async function handleDelete() {
        if (!confirm?.(`¿Eliminar ${product.nombre}?`)) return;

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const res = await fetch(`https://localhost:7012/api/Negocios/${product.id_Negocio}/productos/${product.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: product.id }),
            });
            if (!res.ok) throw new Error(`Delete HTTP ${res.status}`);
            console.log("Product deleted", product.id);
            if (typeof onDeleted === "function") onDeleted(product.id);
        } catch (err) {
            if (err.name === "AbortError") return;
            console.error("Failed to delete product", err);
        }
    }

    function handleEditClick() {
        if (typeof onEdit === "function") onEdit(product);
    }

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
        <div className="h-80 w-58 hover:bg-[#00000008] relative transition-all duration-100 flex flex-col border rounded-xl border-[#00000020]">
            <div className="flex gap-2 absolute top-2 right-2">
                <button
                    onClick={handleEditClick}
                    className="bg-[#F2F2F2] rounded-md border-[#49494990] text-[#494949] transition-all duration-200 hover:text-[#b8d100] 
                    p-2 z-2 border-2"
                >
                    <Pencil className="cursor-pointer w-5 h-5" />
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-[#f2f2f2] rounded-md text-[#494949] hover:text-[#660000] 
                    p-2 z-2 border-2 border-[#49494990]"
                >
                    <Trash className="cursor-pointer w-5 h-5" />
                </button>
            </div>

            <div className="flex w-full relative bg-[#00000005] h-54 rounded-t-[11px] overflow-hidden">
                <img
                    src={imagen}
                    onError={() => setImagen("package.svg")}
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
                <h3 className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.nombre}
                </h3>
                <h4 className="text-gray-600">{`Stock: ${product.stock}`}</h4>
                <span className="mt-auto font-semibold">{`$${product.valor}`}</span>
            </div>
        </div>
    );
}
