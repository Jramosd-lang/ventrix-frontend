import ModalCrearProducto from "../modal/modalCrearProducto";
import { useState } from "react";

export default function TarjetaCrearProducto({ onCreated }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col border-2 z-3 gap-12 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center h-80 w-58 cursor-pointer hover:bg-gray-100">
            <ModalCrearProducto isOpen={isOpen} onClose={handleClose} onCreated={onCreated} />
            <div onClick={handleOpen} className="flex flex-col gap-12 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center h-80 w-58 cursor-pointer">
                <div className="flex items-center justify-center h-40 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <span className="text-gray-600 text-center">Crear Nuevo Producto</span>
            </div>
        </div>
    );
}