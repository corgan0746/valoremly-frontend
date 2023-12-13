
export const ItemCompactCard = ({item}) => {


    return(
        <div className=" bg-white md:w-[120px] md:min-w-[120px] sm:w-[100px] sm:min-w-[100px] h-[auto] border rounded-lg border-x-neutral-500 shadow-sm">
            <img className="h-[100px] w-[100%] " style={{objectFit: 'cover'}} onError={(e)=> e.target.src = '../images/Fn_iGOeWQAMrhxg.jpg'} src={ (item.images === null)?'../images/Fn_iGOeWQAMrhxg.jpg': item.images} ></img>
            <div className=" w-[100%] text-sm h-[auto]">
                <h2 className=" h-[auto] text-center p-1 leading-4">{item.name.substring(0,11)}</h2>
                <h2 className=" w-[60%] border border-x-neutral-400 rounded-md text-center my-1   mx-auto px-2 font-semibold" style={{minWidth:'50%', maxWidth:'100%'}}>${item.price}</h2>
            </div>
        </div>
    )
}

