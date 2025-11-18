import ModalCrearProducto from "../modal/modalCrearProducto";
import { useState } from "react";

export default function TarjetaCrearProducto({ onCreated, onClose }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };


    return (
        <div className="flex flex-col border-2 z-3 gap-12 border-[#00000030] bg-[#4F46E5] rounded-lg p-4 items-center justify-center h-10 w-48 cursor-pointer transition-all duration-200 hover:bg-[#0e0b9f]">
            <ModalCrearProducto isOpen={isOpen} onClose={handleClose} onCreated={onCreated} />
            <div onClick={handleOpen} className="flex flex-col gap-12 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center h-80 w-58 cursor-pointer">
                <span className="text-white text-center">Crear Nuevo Producto</span>
            </div>
        </div>
    );
}