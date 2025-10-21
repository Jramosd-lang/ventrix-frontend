import {SquareBottomDashedScissors, BoxIcon, PaperclipIcon, User2Icon, Settings, ShieldUser, Menu, X} from 'lucide-react'
import {useState} from "react";

const options = [
    { name: 'Dashboard', href: '#', current: true, icon: <SquareBottomDashedScissors/> },
    { name: 'Productos', href: '#', current: false, icon: <BoxIcon/> },
    { name: 'Pedidos', href: '#', current: false, icon: <PaperclipIcon/> },
    { name: 'Clientes', href: '#', current: false, icon: <User2Icon/> },
    { name: 'Configuración', href: '#', current: false, icon: <Settings/> },
    { name: 'Soporte', href: '#', current: false, icon: <ShieldUser/> },
];

export default function Sidebar(){
    const [open, setOpen] = useState(false);

    const handdlerOpen = () => {
        setOpen(!open);
    }

    return(
        <aside className={`w-52 h-full top-14 z-1 fixed border-r border-[#00000060]  ` + (open ? 'left-0' : 'left-[-208px]') + ` bg-[#ffffff] transition-all duration-300 ease flex flex-col justify-between`}>
            <div onClick={handdlerOpen} className='absolute bg-white hover:bg-[#a2a2a2] tansition-color duration-300 top-2 left-54 rounded-full h-10 w-10 border-1 border-[#00000060] '>
                {open ? <X className="m-2" /> : <Menu className='m-2' /> }
                
                
            </div>
            <ul className="flex flex-col gap-0">
                {options.map((option) => (
                    <li key={option.name} >
                        <a href={option.href} className={`flex gap-2 py-4 px-3 w-full ${option.current ? ' m-0 text-[#bababa]' : 'hover:text-[#35b749]'} transition-all duration-300 ease hover:px-10 px-5`}>
                            {option.icon}
                            {option.name}
                        </a>
                    </li>
                ))}
            </ul>
            <div className='absolute bottom-0 w-full p-4 border-t border-[#00000060]'>
                @2024 Ventris
            </div>
        </aside>
    );
}