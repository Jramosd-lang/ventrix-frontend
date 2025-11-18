import {SquareBottomDashedScissors,House,BoxIcon,PaperclipIcon,User2Icon,Settings,ShieldUser} from 'lucide-react';

const opciones = [
    { name: 'dashboard', href: '#', icon: <SquareBottomDashedScissors strokeWidth={1.5} /> },
    { name: 'productos', href: '/productos', icon: <BoxIcon strokeWidth={1.5} /> },
    { name: 'pedidos', href: '/pedidos', icon: <PaperclipIcon strokeWidth={1.5} /> },
    { name: 'clientes', href: '#', icon: <User2Icon strokeWidth={1.5} /> },
    { name: 'configuración', href: '#', icon: <Settings strokeWidth={1.5} /> },
    { name: 'soporte', href: '#', icon: <ShieldUser strokeWidth={1.5} /> },
    { name: 'home', href: '/home', icon: <House strokeWidth={1.5} /> }
];

export default function Sidebar() {
    const url = window.location.pathname;
    const subpagina = url.replace("/", "");

    const cuenta = localStorage.getItem("cuenta");

    if (!cuenta) {
        return null;
    }

    let visibleOptions = opciones;

    if (cuenta) {
        if(cuenta.rol === "comprador")
        visibleOptions = opciones.filter(opt =>
            ['pedidos', 'soporte', 'home'].includes(opt.name)
        );
    }

    return (
        <aside
            className={`h-full left-0 top-14 z-10 fixed border-r-2 border-[#00000020]
            w-13 bg-white hover:text-black text-transparent transition-all duration-300 ease flex flex-col`}
        >
            <ul className="flex flex-col gap-0">
                {visibleOptions.map((option) => (
                    <li
                        key={option.name}
                        className={`flex justify-center relative hover:bg-[#00000005] ${subpagina === option.name ? "text-[#8F8F8F]" : ""
                            } text-black transition-all duration-200 hover:text-[#6357ce]`}
                    >
                        <a
                            href={option.href}
                            className="flex flex-col items-center py-4 px-3 group relative"
                        >
                            {/* Icono */}
                            <span>{option.icon}</span>

                            {/* Tooltip */}
                            <span
                                className="absolute left-full ml-3 px-3 py-1.2 h-fit pb-1 bg-white border border-[#00000020] text-black text-sm rounded-md 
                                opacity-0 scale-95 translate-y-1 pointer-events-none justify-center items-center
                                group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                                transition-all duration-200 ease-out whitespace-nowrap shadow-md"
                            >
                                {option.name}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <div className="absolute bottom-20 w-full overflow-hidden justify-center pl-5 border-t border-[#00000060] text-gray-500 text-sm">
            </div>
        </aside>
    );
}
