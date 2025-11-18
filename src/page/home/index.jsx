import Header from "../../components/header"
import Sidebar from "../../components/sidebar"
import ContenedorProductos from "../../components/contenedorProductos"

export default function Home() {
    const cuenta = localStorage.getItem("cuenta");
    if (!cuenta) {
        window.location.href = "/"
        return null
    }

    return (
        <>
            <Header />
            <Sidebar />
            <div className="flex flex-col gap-5 h-fit w-full pt-10">
                <main className="w-full gap-10 h-fit">
                    <section className="flex flex-col w-full justify-center py-10">
                        <ContenedorProductos mode="vendedor" />
                    </section>
                </main>
            </div>
        </>
    )
}
