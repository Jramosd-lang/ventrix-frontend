import { useState, useRef } from "react";
import Alert from "../../components/alert";
import { Store, User } from "lucide-react";

function InputField({ id, label, type = 'text', value, onChange, placeholder }) {
    return (
        <div className="flex flex-col w-full mb-2">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="mb-2 border-1 rounded-md py-1 border-[#D1D5DC] px-2"
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
}

export default function LoginForm({ onLoginC, onLoginV }) {
    const [contraseña, setContraseña] = useState("");
    const [usuario, setUsuario] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tipoUsuario, setTipoUsuario] = useState("vendedor");

    const userRef = useRef(null);

    async function manejar_login(evento) {
        evento.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const url =
                tipoUsuario === "vendedor"
                    ? "https://localhost:7012/api/Vendedors/login-vendedor"
                    : "https://localhost:7012/api/Compradors/login-comprador";

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, contraseña }),
            });

            if (!response.ok) {
                let errText = null;
                try {
                    errText = await response.text();
                } catch (error) {
                    console.log(error);
                }

                const status = response.status;
                if ([400, 401, 404].includes(status)) {
                    throw new Error("Contraseña o usuario incorrecto, intente nuevamente");
                }

                throw new Error(errText || "El servidor se encuentra caído, intente más tarde");
            }

            const data = await response.json();

            // Adaptación a una sola variable de cuenta
            const cuentaFinal = {
                ...data,
            };

            // Llamar a la función correcta según el tipo de usuario
            if (tipoUsuario === "vendedor") {
                onLoginV && onLoginV(cuentaFinal);
            } else {
                onLoginC && onLoginC(cuentaFinal);
            }

        } catch (err) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={manejar_login}
            id="login-form"
            className="shadow-md bg-white relative border-[1px] border-[#D1D5DC] flex h-fit flex-col w-[400px] max-sm:w-4/5 rounded-xl items-center justify-center p-5"
        >
            {/* selector tipo de usuario */}
            <div className="absolute text-[#00000060] top-[-32px] w-full max-sm:text-sm h-fit rounded-t-xl flex justify-end gap-2 px-5">
                <div
                    onClick={() => setTipoUsuario("vendedor")}
                    className={`relative cursor-pointer gap-2 w-fit px-4 border-b-0 h-8 rounded-t-xl flex items-center justify-center border transition-all duration-200 ${
                        tipoUsuario === "vendedor"
                            ? "z-10 text-[#4f46e5] border-[#4f46e5] bg-white"
                            : "z-0 text-black border-[#00000040] bg-[#f7f7f7]"
                    }`}
                >
                    <Store />
                    <p>Vendedor</p>
                </div>

                <div
                    onClick={() => setTipoUsuario("comprador")}
                    className={`relative cursor-pointer gap-2 w-fit px-4 border-b-0 h-8 rounded-t-xl flex items-center justify-center border transition-all duration-200 ${
                        tipoUsuario === "comprador"
                            ? "z-10 text-[#4f46e5] border-[#4f46e5] bg-white"
                            : "z-0 text-black border-[#00000040] bg-[#f7f7f7]"
                    }`}
                >
                    <User />
                    <p>Comprador</p>
                </div>
            </div>

            <div className="w-fit mr-auto flex flex-col mb-5 gap-2">
                <h1>Inicie sesión</h1>
                <p className="text-gray-600">Inicia sesión, tu tienda te está esperando</p>
            </div>

            <InputField
                id="username"
                label="Correo electrónico"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Username"
            />

            <div style={{ display: "none" }}>
                <input ref={userRef} />
            </div>

            <InputField
                id="password"
                label="Contraseña"
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Password"
            />

            <a href="#" className="text-sm mr-auto text-[#4f46e5] mb-4">
                ¿Olvidaste tu contraseña?
            </a>

            {error && (
                <Alert
                    tipo="error"
                    mensaje={{ title: "Error", description: error }}
                    duration={5000}
                    onClose={() => setError(null)}
                />
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-[#0f5ef0] w-full text-white py-2 px-4 rounded-md"
            >
                {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>

            <div className="w-full flex items-center gap-2 my-1">
                <div className="w-full h-[1px] bg-[#00000037]" />
                <p>o</p>
                <div className="w-full h-[1px] bg-[#00000060]" />
            </div>

            <button
                type="button"
                className="flex items-center justify-center bg-white w-full text-black py-2 px-4 rounded-md border-2 border-black mt-2"
            >
                <img
                    src="google.svg"
                    width="20"
                    height="20"
                    className="inline-block mr-2"
                    alt=""
                />
                Google
            </button>

            <p className="text-sm mt-4">
                ¿No tienes una cuenta?{" "}
                <a href="/registro" className="text-[#4f46e5]">
                    Regístrate
                </a>
            </p>
        </form>
    );
}