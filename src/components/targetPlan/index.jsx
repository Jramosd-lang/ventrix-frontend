export default function TargetPlan({ plan }) {
    return (
        <div className="flex flex-col border-1 border-[#00000060] rounded-xl items-start p-4 h-full bg-[#000000020]">
            <h2 className="text-sm font-bold">{plan.name}</h2>
            <p className="text-sm">incluye:</p>
            <ul className="list-disc list-inside text-sm my-4 text-[#000000c0]">
                {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <p className="text-sm">por mes: ${plan.price}</p>
            <button className="bg-[#3f9561] text-white py-2 px-4 w-full mt-auto rounded-md">Seleccionar</button>
        </div>
    );
}