


export const MessageSent = ({own, from, message, date }) => {


    if(own){
        return(
            <div className="w-[100%] min-h-[30px] p-2  max-h-[120px] border border-gray-300 text-end">
                <h1><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-sm font-bold font-sans">You</span></h1>
                <p className="text-end leading-tight p-2">{message}</p>
                <p className="text-[10px] pt-1 h-4 leading-none text-neutral-500">{new Date(date).toLocaleString()}</p>
            </div>
        )
    }else{

        return (
            <div className="w-[100%] min-h-[30px] p-2  max-h-[120px] border border-gray-300">
                <h1><span className="text-white bg-orange-700 p-1 rounded-xl text-sm font-bold font-sans">{from}</span></h1>
                <p className="text-left leading-tight p-2">{message}</p>
                <p className="text-[10px] pt-1 h-4 leading-none text-neutral-500">{new Date(date).toLocaleString()}</p>
            </div>
        )
    }
}