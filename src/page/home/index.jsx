import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import ContainerProducts from "../../components/contenedorProductos";

export default function Home() {


    const cuenta = localStorage.getItem('cuentaUsuario')
    if (!cuenta) {
        window.location.href = '/'
    }

    return (
        <>
            <Header />
            <Sidebar />
            <div className="flex flex-col gap-5 h-fit w-full">

                <div className="flex flex-col w-full">
                    <div className="w-full h-fit border-b border-black flex overflow-hidden">
                        <img className=" h-100 object-contain" src="https://img.freepik.com/foto-gratis/vista-al-interior-hotel_1417-1566.jpg" alt="" />
                        <img className=" h-100 object-contain" src="https://images.unsplash.com/photo-1580793241553-e9f1cce181af?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VudHJvJTIwY29tZXJjaWFsJTIwY29tZXJjaWFsfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000" alt="" />
                        <img className="h-100" src="https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudGVzfGVufDB8fDB8fHww" alt="" />
                    </div>
                </div>
                <main className="w-full gap-10 h-fit">
                    <div className="flex w-full border-b px-24 border-gray-300 gap-10">
                        <div className="top-[-130px] left-30 rounded-full overflow-hidden h-30 w-30 bg-white">
                            <img className="rounded-full border-2 border-[#00000015]" src="https://img.freepik.com/vector-premium/plantilla-diseno-logotipo-city-shop_145155-3081.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
                        </div>
                        <div className=" h-fit py-4 w-full">
                            <h1 className="text-[#00000080]">Variedades CYTYSHOP</h1>
                            <p className="text-gray-600">Te estamos esperando, acercate y disfruta de la mejores productos de valledupar</p>
                        </div>
                    </div>
                    <section className="flex w-full justify-center py-20">
                        <ContainerProducts />
                    </section>
                </main>
            </div>
        </>
    );
}
