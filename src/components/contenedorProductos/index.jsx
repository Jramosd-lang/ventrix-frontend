import { useCallback, useEffect, useRef, useState } from "react";
import TargetProduct from "../targetProduct";
import TarjetaCrearProducto from "../tarjetaCrearProducto";
import ModalCrearProducto from "../modal/modalCrearProducto";

export default function ContainerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const controllerRef = useRef(null);

    const base = import.meta.env.VITE_API_URL ?? "https://localhost:7012";

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const cuentaStr = localStorage.getItem("cuentaUsuario");
            if (!cuentaStr) throw new Error("No se encontró cuentaUsuario en localStorage");
            const cuenta = JSON.parse(cuentaStr);
            const negocioId = cuenta?.negocio?.id ?? cuenta?.id ?? cuenta;
            const url = `${base}/api/Negocios/productosNegocio?negocioId=${negocioId}`;

            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            setProducts(data);
            setError(null);
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Failed to fetch products", err);
                setError(err.message || "Fetch error");
            }
        } finally {
            setLoading(false);
        }
    }, [base]);

    useEffect(() => {
        fetchProductos();
        return () => controllerRef.current?.abort();
    }, [fetchProductos]);

    const openEditModal = (product) => {
        setEditProduct(product);
        setEditOpen(true);
    };

    const closeEditModal = () => {
        setEditProduct(null);
        setEditOpen(false);
        fetchProductos();
    };

    return (
        <div className="flex justify-start px-40 w-full">
            <div className="flex flex-wrap w-full gap-8">
                {loading && <div>Loading products...</div>}
                {error && <div className="text-red-500">Error: {error}</div>}
                {!loading && !error && products.length === 0 && <div>No products found</div>}

                {products.map((p) => (
                    <TargetProduct key={p.id} product={p} onDeleted={fetchProductos} onEdit={openEditModal} />
                ))}

                <TarjetaCrearProducto onCreated={fetchProductos} />
                <ModalCrearProducto
                    isOpen={editOpen}
                    onClose={closeEditModal}
                    type="edit"
                    product={editProduct}
                />
            </div>
        </div>
    );
}
