
import { useEffect, useState } from "react";
import TargetProduct from "../targetProduct";

export default function ContainerProducts(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchProducts(){
            try {
                const res = await fetch('https://localhost:7012/api/Productoes', { signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Failed to fetch products', err);
                    setError(err.message || 'Fetch error');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();

        return () => controller.abort();
    }, []);

    return(
        <>
        <div className="flex justify-center min-h-screen w-full">
            <div className="w-fit flex flex-wrap max-w-4/5  gap-10">
                {loading && <div>Loading products...</div>}
                {error && <div className="text-red-500">Error: {error}</div>}
                {!loading && !error && products.length === 0 && (
                    <div>No products found</div>
                )}

                {Array.isArray(products) && products.map((p) => (
                    <TargetProduct key={p.id} product={p} />
                ))}
            </div>
        </div>

        </>
    );
}