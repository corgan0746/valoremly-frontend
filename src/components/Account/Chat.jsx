
export const Chat = ({isSelected, data, expire, setSelected, date, otherUser  }) => {

    return(
        <div onClick={() => setSelected(data.id)} className={` ${(isSelected == data.id)? ' bg-slate-200':'bg-white' } sm:h-[100px] md:h-[130px] md:w-[160px] sm:w-[160px] transition-all duration-300 cursor-pointer  md:border-2 sm:border sm:border-y-neutral-100 md:border-y-neutral-400 relative  p-1 flex justify-center flex-wrap`}>
            <p className="absolute top-[2px] left-[3px] bg-red-500 rounded-full h-[10px] w-[10px]"></p>
            <h4 className="text-sm p-1 h-6">#{data.id}</h4>
            <div className="h-[26px] text-center"><span className="text-white md:px-2  bg-orange-700 p-[3px] rounded-xl text-sm font-bold font-sans">{otherUser}</span></div>
            <div><span className="text-white bg-red-800 p-[3px] rounded-lg md:px-2 text-sm font-bold font-sans">{Math.ceil((expire - (Math.floor(new Date().getTime() / 1000))) / (60 * 60 * 24))} Days Left</span></div>
            <p className="text-[10px] pt-1 h-4 leading-none text-neutral-500">Created On: {new Date(data.date).toDateString()}</p>
        </div>
    )

}