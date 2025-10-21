import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import ContainerProducts from "../../components/containerProducts";

export default function Home() {
    return(
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
                <div className="relative w-full">
                    <div className="absolute top-[-130px] left-30 rounded-full overflow-hidden h-70 w-70 bg-white">
                        <img className="rounded-full border-2 border-[#00000050]" src="https://img.freepik.com/vector-premium/plantilla-diseno-logotipo-city-shop_145155-3081.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
                    </div>
                </div>
            </div>
            <main className="w-full  h-fit">
                <div className="pl-110 h-fit border-[#00000060] py-4 border-b w-full">
                    <h1>Variedades CYTYSHOP</h1>
                    <p>Te estamos esperando, acercate y disfruta de la mejores productos de valledupar</p>
                </div>
                <section className="flex w-full justify-center py-20">
                    <ContainerProducts/>
                </section>
            </main>
        </div>
        </>
    );
}