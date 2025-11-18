import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CarritoCompras({ productosElegidos, onIncrease, onDecrease, onRemove, onCartUpdate, idNegocio }) {
    const navigate = useNavigate();
    const [abierto, setAbierto] = useState(false);

    // Filtrar productos con stock mayor a 0
    const productosConStock = productosElegidos.filter((producto) => producto.stock > 0);

    //  Abrir el carrito automáticamente cuando haya productos
    useEffect(() => {
        if (productosConStock.length > 0) setAbierto(true);
    }, [productosConStock.length]);

    //  Notificar al padre si cambia el carrito
    useEffect(() => {
        if (onCartUpdate) onCartUpdate(productosConStock);
    }, [productosConStock]);

    //  Calcular total
    const total = productosConStock.reduce(
        (acc, producto) => acc + producto.valor * producto.cantidad,
        0
    );

    const toggleCarrito = (e) => {
        if (e.target.closest(".carrito-header")) setAbierto(!abierto);
    };

    const puedeAumentar = (producto) => producto.cantidad < producto.stock;

    // Guardar carrito fusionado con lo existente en localStorage
    const guardarEnLocalStorage = () => {
        try {
            const carritoExistente = JSON.parse(localStorage.getItem("carrito") || "[]");

            // Combinar evitando duplicados por id
            const carritoActualizado = [...carritoExistente];
            productosConStock.forEach((nuevoProd) => {
                const index = carritoActualizado.findIndex((p) => p.id === nuevoProd.id);
                if (index >= 0) {
                    carritoActualizado[index] = nuevoProd;
                } else {
                    carritoActualizado.push(nuevoProd);
                }
            });

            localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
            return carritoActualizado;
        } catch (error) {
            console.error("Error guardando carrito:", error);
            return [];
        }
    };

    return (
        <div
            className={`fixed right-10 h-96 w-80 rounded-t-xl border border-gray-200 bg-white z-50 flex flex-col shadow-lg ${abierto ? "bottom-0" : "bottom-[-334px]"
                } transition-all duration-200`}
        >
            {/* Header */}
            <div
                onClick={toggleCarrito}
                className="carrito-header w-full h-14 flex items-center border-b border-gray-200 px-4 bg-gray-50 rounded-t-xl cursor-pointer"
            >
                <span className="font-semibold text-base">Mi carrito</span>
                <ShoppingBag className="ml-auto text-indigo-600" />
                <div className="ml-2 flex w-6 h-6 bg-indigo-600 text-white rounded-full items-center justify-center text-xs font-bold">
                    {productosConStock.length}
                </div>
            </div>

            {/* Lista de productos */}
            <div className="flex flex-col w-full overflow-y-auto flex-1 p-3 space-y-2">
                {productosConStock.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-4">Tu carrito está vacío</p>
                ) : (
                    productosConStock.map((producto, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center w-full bg-gray-50 rounded-lg px-3 py-2 hover:bg-teal-50 transition-all"
                        >
                            <div className="flex items-center gap-3 w-3/5">
                                <img
                                    className="h-12 w-12 object-cover rounded-md border border-gray-300"
                                    src={producto.imagenUrl}
                                    onError={(e) => (e.target.src = "/package.svg")}
                                    alt={producto.nombre}
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{producto.nombre}</span>
                                    <span className="text-xs text-gray-500">
                                        ${Number(producto.valor).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                                    </span>
                                    {producto.cantidad >= producto.stock && (
                                        <span className="text-xs font-medium text-orange-600">Cantidad máxima</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end w-2/5">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDecrease(producto.id);
                                        }}
                                        className="border border-gray-400 rounded-full p-1 hover:bg-gray-200"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-semibold w-5 text-center">{producto.cantidad}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (puedeAumentar(producto)) onIncrease(producto.id);
                                            else alert(`Cantidad máxima disponible: ${producto.stock} unidades`);
                                        }}
                                        disabled={!puedeAumentar(producto)}
                                        className={`border rounded-full p-1 transition-all ${puedeAumentar(producto)
                                                ? "border-gray-400 hover:bg-gray-200 cursor-pointer"
                                                : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-semibold">
                                        $
                                        {Number(producto.valor * producto.cantidad).toLocaleString("es-CO", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(producto.id);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </div>

            {/* Total y botón de pago */}
            {productosConStock.length > 0 && (
                <div className="border-t flex-col gap-1 border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-b-xl">
                    <div className="w-full flex">
                        <span className="font-semibold mr-auto text-sm">Total:</span>
                        <span className="text-base">
                            $
                            {total.toLocaleString("es-CO", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const carritoFinal = guardarEnLocalStorage();
                            console.log("Carrito guardado:", carritoFinal);
                            console.log("Negocio:", idNegocio);
                            navigate(`/negocio/checkout/`, { state: { productosCarrito: carritoFinal } });
                        }}
                        className="text-indigo-600 border-2 border-indigo-600 hover:text-white transition-all duration-200 hover:bg-indigo-600 w-full rounded-md py-1.5 font-medium"
                    >
                        Pagar
                    </button>
                </div>
            )}
        </div>
    );
}

export default CarritoCompras;
