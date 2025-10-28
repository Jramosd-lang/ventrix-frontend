
import TargetPlan from "../../components/targetaPlan";
import LoginForm from "../../components/loginForm";

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


export default function Login({ onLogin }) {
    return (
        <>
            <main className=" container-login flex gap-5 h-full w-full justify-between items-center">
                <div className="flex  items-center w-full justify-center gap-10 max-sm:flex-col max-sm:gap-5">
                    <LoginForm onLogin={onLogin} />
                        <div className="flex flex-col h-[482px] bg-white shadow-md w-4/7 p-4 rounded-xl border-1 border-[#D1D5DC] max-sm:w-4/5">
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
    )
}