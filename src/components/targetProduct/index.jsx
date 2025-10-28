import { Trash, Pencil } from "lucide-react";
import { useRef } from "react";

export default function TargetProduct({ product, onDeleted, onEdit }) {
    const controllerRef = useRef(null);

    async function handleDelete() {
        // confirm deletion (optional)
        if (!confirm?.(`¿Eliminar ${product.nombre}?`)) return;

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const res = await fetch(`https://localhost:7012/api/Productos/${product.id}`, {
                method: "DELETE",
                signal: controller.signal,
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

    return (
        <div className="h-80 w-58 hover:bg-[#00000008] relative transition-all duration-100 flex flex-col border-1 rounded-xl border-[#00000020]">
            <div className="flex gap-2 absolute top-2 right-2">
                <div onClick={handleEditClick} className="bg-[#F2F2F2] rounded-md text-[#494949] transition-all duration-200 hover:text-[#b8d100] w-fit h-fit p-2">
                    <Pencil className=" cursor-pointer w-5 h-5" />
                </div>
                <div onClick={handleDelete} className="bg-[#f2f2f2] rounded-md text-[#494949] hover:text-[#660000] w-fit h-fit p-2 ">
                    <Trash className=" cursor-pointer w-5 h-5" />
                </div>
            </div>
            <div className="flex w-full bg-[#00000005] h-54 rounded-t-[11px] overflow-hidden">
                <img src={product.imagenUrl} alt={product.nombre} className="object-cover w-full" />
            </div>
            <div className="flex flex-col flex-1 p-4">
                <h3 className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{product.nombre}</h3>
                <h4 className="text-gray-600">{`Stock: ${product.stock}`}</h4>
                <span className="mt-auto">{`$${product.valor}`}</span>
            </div>
        </div>
    );
}