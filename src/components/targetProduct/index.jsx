export default function TargetProduct({product}){
    return(
        <div className="h-80 w-62 hover:scale-[1.02] transition-transform duration-300 flex flex-col border-1 rounded-xl border-[#00000020]">
            <div className="flex w-full bg-[#00000030] h-54 rounded-t-[11px] ">
                <img src={product.imagenUrl} alt={product.nombre} className="object-contain w-full p-2"/>
            </div>
            <div className="flex flex-col p-4 gap-4">
                <h3 className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">{product.nombre}</h3>
                <span className="mt-auto font-semibold">{`$${product.valor}`}</span>
            </div>
        </div>
    );
}