import Header from "../../../components/header"
import ContenedorProductos from "../../../components/contenedorProductos"
import { useParams } from "react-router-dom"
import Sidebar from "../../../components/sidebar"

export default function Negocio() {
    const { id } = useParams()

    return (
        <>
            <Header />
            <Sidebar/>
            <div className="flex flex-col gap-5 h-fit w-full pt-20">
                <ContenedorProductos mode="cliente" id_negocio_comprador={id} />
            </div>
        </>
    )
}
