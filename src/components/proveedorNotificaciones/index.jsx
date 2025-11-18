import { useEffect, useState } from "react";
import Alert from "../alert";

export default function ProveedorNotificaciones({ connection, cuenta }) {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        if (!connection) return;

        let idNegocio = cuenta?.negocio?.id ?? cuenta?.id_negocio ?? cuenta?.id_Negocio ?? cuenta?.negocioId ?? cuenta?.id ?? null;

        const handler = (nuevoPedido) => setPedidos((prev) => [...prev, nuevoPedido]);

        connection.on("PedidoRecibido", handler);

        if (idNegocio) {
            connection.invoke("UnirseAlNegocio", idNegocio).catch(console.warn);
        }

        return () => connection.off("PedidoRecibido", handler);
    }, [connection, cuenta]);

    useEffect(() => {
        const windowHandler = (e) => setPedidos((prev) => [...prev, e.detail]);
        window.addEventListener("nuevoPedido", windowHandler);
        return () => window.removeEventListener("nuevoPedido", windowHandler);
    }, []);

    // Auto-cierre de notificaciones
    useEffect(() => {
        if (pedidos.length === 0) return;
        const timer = setTimeout(() => setPedidos((prev) => prev.slice(1)), 10000);
        return () => clearTimeout(timer);
    }, [pedidos]);

    const cerrarNotificacion = (index) => setPedidos((prev) => prev.filter((_, i) => i !== index));

    const formatearMoneda = (valor) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(valor || 0);

    return (
        <div className="fixed top-24 right-8 z-[99999] w-96 text-black flex flex-col gap-3">
            {pedidos.map((pedido, index) => {
                const total = pedido?.total_Pagar ?? pedido?.totalPagar ?? pedido?.total ?? 0;
                const cliente = pedido?.comprador ? `${pedido.comprador.nombre || ""} ${pedido.comprador.apellido || ""}`.trim() : "Cliente desconocido";

                return (
                    <Alert
                        key={pedido?.id ?? index}
                        tipo="Celebration"
                        mensaje={{
                            title: `Nuevo pedido de ${cliente}`,
                            description: `Total: ${formatearMoneda(total)}`
                        }}
                        onClose={() => cerrarNotificacion(index)}
                    />

                );
            })}
        </div>
    );
}
