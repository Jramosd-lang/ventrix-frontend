import { useEffect, useState } from "react";
import TargetProduct from "../../targetProduct";
import Alert from "../../alert";

export default function ModalCrearProducto({ onClose, isOpen, onCreated, onUpdated, type, product }) {
    const [nombre, setNombre] = useState("");
    const [id, setId] = useState(null);
    const [valor, setValor] = useState(0);
    const [stock, setStock] = useState(0);
    const [imagenUrl, setImagenUrl] = useState("");
    const [codigoLote, setCodigoLote] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createdProduct, setCreatedProduct] = useState(null);

    useEffect(() => {
        
        if (isOpen && product) {
            setId(product.id ?? null);
            setNombre(product.nombre ?? "");
            setValor(product.valor ?? 0);
            setStock(product.stock ?? 0);
            setImagenUrl(product.imagenUrl ?? "");
            setCodigoLote(product.codigo_Lote ?? product.codigoLote ?? "");
            setDescripcion(product.descripcion ?? "");
        }
        if (!isOpen) {
            // reset form when closed
            setNombre("");
            setValor(0);
            setStock(0);
            setImagenUrl("");
            setCodigoLote("");
            setDescripcion("");
            setCreatedProduct(null);
            setError(null);
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    function getNegocioIdFromLocalStorage() {
        const cuenta = localStorage.getItem("cuentaUsuario");
        if (!cuenta) return null;
        try {
            const parsed = JSON.parse(cuenta);
            if (parsed && parsed.negocio && parsed.negocio.id) return parsed.negocio.id;
            return Number(parsed) || null;
        } catch {
            const asNum = Number(cuenta);
            return isNaN(asNum) ? cuenta : asNum;
        }
    }

    function construirProductoParaEditar(){
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        return {
            id: id,
            nombre: nombre || "",
            valor: Number(valor) || 0,
            fecha_Creacion: product?.fecha_Creacion ?? today,
            stock: Number(stock) || 0,
            estado: product?.estado ?? true,
            descripcion: descripcion || "",
            calificacion: product?.calificacion ?? 0,
            codigo_Lote: codigoLote || "",
            impuestos_Aplicados: product?.impuestos_Aplicados ?? [],
            imagenUrl: imagenUrl || "",
            id_Negocio: getNegocioIdFromLocalStorage(),
        };
    }

    function construirProducto() {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        return {
            nombre: nombre || "",
            valor: Number(valor) || 0,
            fecha_Creacion: product?.fecha_Creacion ?? today,
            stock: Number(stock) || 0,
            estado: product?.estado ?? true,
            descripcion: descripcion || "",
            calificacion: product?.calificacion ?? 0,
            codigo_Lote: codigoLote || "",
            impuestos_Aplicados: product?.impuestos_Aplicados ?? [],
            imagenUrl: imagenUrl || "",
            id_Negocio: getNegocioIdFromLocalStorage(),
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const negocioId = getNegocioIdFromLocalStorage();

        if (!negocioId) {
            setError("No se encontró id de negocio en localStorage (cuentaUsuario)");
            return;
        }

        const payload = construirProductoParaEditar();

        const apiBase = import.meta.env.VITE_API_URL || "";
        const base = apiBase ? apiBase.replace(/\/$/, "") : "https://localhost:7012";

        try {
            setLoading(true);
            if (type === "edit" || product) {

                const id = product?.id;
                if (!id) {
                    throw new Error("No se proporcionó el producto a editar (falta product.id)");
                }

                const url = `${base}/api/Negocios/editarProducto?negocioId=${encodeURIComponent(negocioId)}`;
                console.log("PUT", url, payload);

                const res = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    let data = null;
                    try {
                        data = await res.json();
                    } catch (err) {
                        console.warn("Could not parse error body", err);
                    }
                    throw new Error((data && data.message) || `HTTP ${res.status}`);
                }

                // try to parse response body; support 204 No Content
                let updated = payload;
                try {
                    const body = await res.text();
                    updated = body ? JSON.parse(body) : payload;
                } catch (err) {
                    // if parsing fails, fall back to payload
                    console.warn("Could not parse update response, falling back to payload", err);
                    updated = payload;
                }
                
                setCreatedProduct(updated);
                if (typeof onUpdated === "function") onUpdated(updated);
                onClose && onClose();
            } else {
                // create new product
                const payload = construirProducto();
                const url = `${base}/api/Negocios/agregarProducto?negocioId=${encodeURIComponent(negocioId)}`;
                console.log("POST", url, payload);
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                
                let data = null;
                try {
                    const text = await res.text();
                    data = text ? JSON.parse(text) : null;
                } catch (err) {
                    console.warn("Could not parse create response", err);
                }

                if (!res.ok) throw new Error((data && data.message) || `HTTP ${res.status}`);
                const created = data || payload;
                setCreatedProduct(created);
                if (typeof onCreated === "function") onCreated(created);
                onClose && onClose();
            }
        } catch (err) {
            console.error("Error creating/updating product", err);
            setError(err.message || "Error al crear/actualizar producto");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="fixed z-4 inset-0 backdrop-brightness-75 border-gray-200 outline-2 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white flex rounded-lg p-6 w-fit">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <h2 className="text-xl font-semibold mb-4">{type === "edit" || product ? "Editar Producto" : "Crear Nuevo Producto"}</h2>

                    {error && (
                        <Alert tipo="error" mensaje={{ title: "Error", description: error }} duration={5000} onClose={() => setError(null)} />
                    )}

                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" placeholder="Nombre del producto" className="border border-gray-300 rounded px-3 py-2" />
                    <input value={valor} onChange={(e) => setValor(e.target.value)} type="number" placeholder="Valor" className="border border-gray-300 rounded px-3 py-2" />
                    <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" placeholder="Stock" className="border border-gray-300 rounded px-3 py-2" />
                    <input value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} type="text" placeholder="URL de la imagen" className="border border-gray-300 rounded px-3 py-2" />
                    <input value={codigoLote} onChange={(e) => setCodigoLote(e.target.value)} type="text" placeholder="Codigo de lote" className="border border-gray-300 rounded px-3 py-2" />
                    <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} type="text" placeholder="Descripcion" className="border border-gray-300 rounded px-3 py-2" />

                    <div className="flex justify-end gap-4 mt-4">
                        <button onClick={onClose} type="button" className="px-4 py-2 transition-all duration-200 bg-gray-300 rounded hover:bg-gray-400">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 transition-all duration-200 bg-green-500 text-white rounded hover:bg-green-600">
                            {loading ? (type === "edit" ? "Guardando..." : "Creando...") : type === "edit" || product ? "Guardar" : "Crear"}
                        </button>
                    </div>
                </form>

                <div className="border-l-1 p-5 border-[#e0e0e0] ml-5 top-2 right-2 cursor-pointer" onClick={onClose}>
                    <TargetProduct product={createdProduct || construirProducto()} />
                </div>
            </div>
        </div>
    );
}


