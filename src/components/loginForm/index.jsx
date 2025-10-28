import { useState, useRef, useEffect } from "react"
import Alert from "../../components/alert"

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
    )
}

export default function LoginForm({ onLogin }) {
    const [contraseña, setContraseña] = useState("")
    const [usuario, setUsuario] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const userRef = useRef(null)
    useEffect(() => {
        try { userRef.current && userRef.current.focus() } catch { /* ignore focus errors */ }
    }, [])

    async function manejar_login(evento) {
        evento.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const url = 'https://localhost:7012/api/Vendedors/login'
            console.log('POST', url, { usuario })
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contraseña })
            })

            if (!response.ok) {
                let errText = null
                try { errText = await response.text() } catch (err) { void err }
                const status = response.status
                if (status === 400 || status === 401 || status === 404) {
                    throw new Error('Contraseña o usuario incorrecto, intente nuevamente')
                }
                throw new Error(errText || `El servidor se encuentra caído, intente más tarde`)
            }

            const data = await response.json()
            console.log('Inicio de sesión exitoso:', data)
            onLogin && onLogin(data)
            localStorage.setItem('cuentaUsuario', JSON.stringify(data))
        } catch (err) {
            console.error('Error al iniciar sesión:', err)
            setError(err.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={manejar_login} id="login-form" className="shadow-md bg-white relative border-[1px] border-[#D1D5DC] flex h-fit flex-col w-[400px] max-sm:w-4/5 rounded-xl items-center justify-center p-5">
            <div className="absolute text-[#00000060] top-[-32px] w-full max-sm:text-sm h-fit rounded-t-xl flex justify-end gap-2 px-5">
                <div className="relative  bg-white border-t-1 border-l-1 border-r-1  gap-2 border-[#00000060]  outline-[#000000] w-fit px-4 h-8 rounded-t-xl flex items-center justify-center">
                    <img src="store.svg" alt="" />
                    <p>Vendedor</p>
                </div>
                <div className="relative  bg-white border-t-1 border-r-1 border-l-1 gap-2 border-[#00000060]  outline-[#000000] w-fit px-4 h-[31px] rounded-t-xl flex items-center justify-center">
                    <img src="person.svg" color="#00000060" alt="" />
                    <p>Comprador</p>
                </div>
            </div>

            <div className="w-fit mr-auto flex flex-col mb-5 gap-2">
                <h1>Inicie sesión</h1>
                <p className="text-gray-600">Inicia sesion, tu tienda te esta esperando</p>
            </div>

            <InputField id="username" label="Correo electronico" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Username" />
            {/* reference to focus */}
            <div style={{ display: 'none' }}>
                <input ref={userRef} />
            </div>
            <InputField id="password" label="Contraseña" type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} placeholder="Password" />

            <a href="#" className="text-sm mr-auto text-[#059669] mb-4">¿Olvidaste tu contraseña?</a>
            {error && <Alert mensaje={{ title: "Error", description: error }} duration={5000} onClose={() => setError(null)} />}

            <button type="submit" disabled={loading} className="bg-[#059669] w-full text-white py-2 px-4 rounded-md">{loading ? 'Iniciando...' : 'Iniciar sesión'}</button>

            <div className="w-full flex items-center gap-2 my-1">
                <div className="w-full h-[1px] bg-[#00000037]" ></div>
                <p>o</p>
                <div className="w-full h-[1px] bg-[#00000060]"></div>
            </div>

            <button type="button" className="flex items-center g-signin2 justify-center bg-white w-full text-black py-2 px-4 rounded-md border-2 border-black mt-2"><img src="google.svg" width="20" height="20" className="inline-block mr-2" alt="" />Google</button>
            <p className="text-sm mt-4">¿No tienes una cuenta? <a href="/registro" className="text-[#3f9561]">Regístrate</a></p>
        </form>
    )
}
