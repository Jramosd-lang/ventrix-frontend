
import { useState } from "react";
import TargetPlan from "../../components/targetPlan";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        name: "PLAN BASICO",
        features: [
            "Publica hasta 20 productos",
            "Soporte básico",
            "Acceso a estadísticas básicas",
            "Gestion de inventario",
            "Reportes mensuales"
        ],
        price: 9.99
    },
    {
        name: "PLAN ESTANDAR",
        features: [
            "Publica hasta 50 productos",
            "Soporte prioritario",
            "Acceso a estadísticas avanzadas",
            "Gestion de inventario",
            "Reportes personalizados"
        ],
        price: 19.99
    },
    {
        name: "PLAN PREMIUM",
        features: [
            "Publica hasta 100 productos",
            "Soporte prioritario",
            "Acceso a estadísticas avanzadas",
            "Gestion de inventario",
            "Reportes personalizados",
            "Subdominio personalizado"
        ],
        price: 29.99
    }
];


export default function Login() {

    const [contraseña, setContraseña] = useState("");
    const [usuario, setUsuario] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function manejar_login(evento){
        evento.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const url = 'https://localhost:7012/api/Vendedors/login';
            console.log('POST', url, { usuario });
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contraseña })
            });

            if (!response.ok) {
                    // try to read error message from body
                    let errText = null;
                    try { errText = await response.text(); } catch (err) { void err; }
                    const status = response.status;
                    // map common auth/validation statuses to a generic message
                    if (status === 400 || status === 401 || status === 404) {
                        throw new Error('Contraseña o usuario incorrecto, intente nuevamente');
                    }
                    throw new Error(errText || `HTTP ${status}`);
            }

            const data = await response.json();
            console.log('Inicio de sesión exitoso:', data);
            // store token if returned
            if (data.token) localStorage.setItem('token', data.token);
            navigate("/home");
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    }

    function manejar_contraseña(contraseña_input){
        setContraseña(contraseña_input.target.value);
        console.log(contraseña_input.target.value);
    }

    function manejar_usuario(usuario_input){
        setUsuario(usuario_input.target.value);
        console.log(usuario_input.target.value);
    }

    return (
        <>
            <main className=" container-login flex gap-5 h-full w-full justify-between items-center">
                <div className="flex  items-center w-full justify-center gap-10 max-sm:flex-col max-sm:gap-5">
                    <form onSubmit={manejar_login} action="login-character" className="shadow-md bg-white relative border-[1px] border-[#00000060] flex h-fit flex-col w-[400px] max-sm:w-4/5 rounded-xl items-center justify-center p-5">
                        <div className="absolute text-[#00000060] top-[-32px] w-full max-sm:text-sm h-fit rounded-t-xl flex justify-end gap-2 px-5">
                            <div className="relative  bg-white border-t-1 border-l-1 border-r-1  gap-2 border-[#00000060]  outline-[#000000] w-fit px-4 h-8 rounded-t-xl flex items-center justify-center">
                                <img src="store.svg" color="#00000060" alt="" />
                                <p>Vendedor</p>
                            </div>
                            <div className="relative  bg-white border-t-1 border-r-1 border-l-1 gap-2 border-[#00000060]  outline-[#000000] w-fit px-4 h-[31px] rounded-t-xl flex items-center justify-center">
                                <img src="person.svg" color="#00000060" alt="" />
                                <p>Comprador</p>
                            </div>
                        </div>
                        
                        <div className="w-fit mr-auto flex flex-col mb-5 gap-2">
                            <h1>Inicie sesión</h1>
                            <p>Inicia sesion, tu tienda te esta esperando</p>
                        </div>
                        <div className="flex flex-col w-full mb-2">
                            <label htmlFor="username">Correo electronico</label>
                            <input id="username" name="username" value={usuario} onChange={manejar_usuario} className="mb-2 border-2 rounded-md py-1 border-[#00000060] px-2" type="text" placeholder="Username" />
                        </div>
                        <div className="flex flex-col w-full mb-2">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" name="password" value={contraseña} onChange={manejar_contraseña} className="mb-2 border-2 rounded-md py-1 border-[#00000060] px-2" type="password" placeholder="Password" />
                        </div>
                        <a href="#" className="text-sm mr-auto text-[#3f9561] mb-4">¿Olvidaste tu contraseña?</a>
                        {error && <div className="text-red-500 w-full mb-2">{error}</div>}
                        <button type="submit" disabled={loading} className="bg-[#3f9561] w-full text-white py-2 px-4 rounded-md">{loading ? 'Iniciando...' : 'Iniciar sesión'}</button>
                        <div className="w-full flex items-center gap-2 my-1">
                            <div className="w-full h-[1px] bg-[#00000060]" ></div>
                            <p>o</p>
                            <div className="w-full h-[1px] bg-[#00000060] g-signin2"></div>
                        </div>
                        <button className="flex items-center justify-center bg-white w-full text-black py-2 px-4 rounded-md border-2 border-black mt-2"><img src="google.svg" width="20" height="20" className="inline-block mr-2" />Google</button>
                        <p className="text-sm mt-4">¿No tienes una cuenta? <a href="#" className="text-[#3f9561]">Regístrate</a></p>
                    </form>
                        <div className="flex flex-col h-[482px] bg-white shadow-md w-4/7 p-4 rounded-xl border-1 border-[#00000060]">
                            <div className="h-fit w-full p-4 flex flex-col ">
                                <div className="flex items-center gap-4 mb-2">
                                    <img src="plans.svg" alt="" />
                                    <h1>planes</h1>
                                    <div className="flex-1 h-[1px] bg-[#00000060]"></div>
                                </div>
                                <p>Conoce nuestros planes y beneficios</p>
                            </div>
                            <div className="flex justify-between items-center gap-7 h-full w-full rounded-xl p-4">
                                
                                <TargetPlan plan={plans[0]} />
                                <TargetPlan plan={plans[1]} />
                                <TargetPlan plan={plans[2]} />
                                
                            </div>
                        </div>
                </div>
            </main>
        </>
    );
}