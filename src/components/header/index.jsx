import { Link } from "react-router-dom";
import { User, Inbox } from "lucide-react";

export default function Header() {


    
    const handleLogout = () => {
    try {
        // Limpiar sesión
        localStorage.removeItem("cuenta");
        
        // Forzar recarga completa en lugar de navigate
        window.location.href = "/";
        
    } catch (err) {
        console.error("Error al cerrar sesión:", err);
        window.location.href = "/";
    }
};

    return (
        <header className="fixed top-0 left-0 w-full z-10 border-b-2 bg-white py-1 px-8 border-[#00000030]">
            <nav className="h-12 flex items-center text-black">
                <div className="flex justify-between items-center w-full">
                    <div className="text-lg font-semibold mr-12">Ventris</div>
                    <div className="flex gap-12 items-center">
                        <Link
                            to="/home"
                            className="text-gray-600 font-normal hover:bg-[#00000010] py-1 hover:text-[#032231] rounded-2xl px-6 h-fit transition-all duration-200"
                            >
                            Productos
                        </Link>
                        <Link
                            to="/home"
                            className="text-gray-600 font-normal hover:bg-[#00000010] py-1 hover:text-[#032231] rounded-2xl px-6 h-fit transition-all duration-300"
                        >
                            Inicio
                        </Link>
                    </div>

                    <div className="ml-auto mr-4 relative flex items-center">
                        <div className="flex hover:cursor-pointer rounded-full p-1 transition-all duration-200 hover:bg-[#00000020]">
                            <Inbox color="#666666"/>
                        </div>

                    </div>

                    <div className="flex items-center gap-4 p-1 rounded-full shadow-md">
                        <button
                            onClick={handleLogout}
                            aria-label="Ir a login / cerrar sesión"
                            className="h-8 w-8 flex overflow-hidden border-2 border-[#4F46E5] bg-white rounded-full cursor-pointer hover:bg-[#f0f0f0] transition-all items-center justify-center"
                            >
                            <User className="h-full w-full" strokeWidth={1} color="#4F46E5" />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
