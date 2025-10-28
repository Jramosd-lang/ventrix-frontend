import {Link, Navigate} from "react-router-dom";
import { User } from "lucide-react"

export default function Header() {
    return (
        <header className="fixed w-full z-1 border-b bg-[#ffffff] py-1 px-8 border-[#00000060]">
            <nav className="h-12 flex justify-start items-center text-black">
                <div className="flex justify-between items-center w-full">
                    <div className="text-lg font-semibold mr-12">Ventris</div>
                    <div className="flex gap-12">
                        <Link to="/home" className="text-gray-600 hover:bg-[#00000010] font-semibold hover:text-[#3f9561] rounded-xl px-6 py-1 transition-all duration-300">Productos</Link>
                        <Link to="/home" className="text-gray-600 hover:bg-[#00000010] font-semibold hover:text-[#3f9561] rounded-xl px-6 py-1 transition-all duration-300">Inicio</Link>
                    </div>
                    <div className="ml-auto mr-20 h-fit flex items-center">
                        <input type="text" placeholder="Buscar productos..." className="border border-[#00000060] w-52 py-1 h-7 rounded-l-xl px-2" />
                        <div className="flex items-center bg-[#ffffff] text-black h-7 border border-[#00000060] rounded-r-xl px-2 py-1">
                            <img src="search.svg" alt="Buscar" className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">

                        <div onClick={() => { localStorage.setItem('cuentaUsuario', null) ; Navigate("/login")}} className="h-10 w-10 flex overflow-hidden text-white bg-[#3f9561] rounded-full">
                            <User className="h-10 w-10" strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}