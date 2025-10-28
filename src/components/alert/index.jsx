import { XCircle, CheckCircle, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function Alert({ mensaje, duration = 3000, onClose, tipo }) {
    const [mounted, setMounted] = useState(true);
    const [isShown, setIsShown] = useState(false);
    // animation duration (ms) must match the tailwind transition duration
    const animDuration = 300;

    useEffect(() => {
        let enterTimer = null;
        let exitTimer = null;
        let unmountTimer = null;

        // start enter animation shortly after mount
        enterTimer = setTimeout(() => setIsShown(true), 10);

        // schedule exit after duration
        exitTimer = setTimeout(() => {
            setIsShown(false);
            // after animation finishes, unmount and call onClose
            unmountTimer = setTimeout(() => {
                setMounted(false);
                if (typeof onClose === "function") onClose();
            }, animDuration);
        }, duration);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(unmountTimer);
        };
    }, [duration, onClose]);

    if (!mounted) return null;

    const containerClasses = `bg-white border h-fit border-[#DFDFDF] pb-5 w-90 flex items-center justify-around rounded-xl z-40 fixed top-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${isShown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`;

    function closeNow() {
        // trigger fade-out then unmount after animDuration
        setIsShown(false);
        setTimeout(() => {
            setMounted(false);
            if (typeof onClose === "function") onClose();
        }, animDuration);
    }

    return (
        <div className={containerClasses}>
            {tipo === 'error' && <XCircle className="text-red-500 ml-5" size={40} />}
            {tipo === 'success' && <CheckCircle className="text-green-500 ml-5" size={40} />}
            {tipo === 'info' && <CircleAlert className="text-blue-500 ml-5" size={40} />}
            <div className="pl-20 pt-4">
                <h2 className="font-bold text-lg">{mensaje?.title}</h2>
                <p className="text-sm text-[#6B7280]">{mensaje?.description}</p>
            </div>
                    <button
                        type="button"
                        aria-label="Cerrar alerta"
                        onClick={closeNow}
                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
        </div>
    );
}