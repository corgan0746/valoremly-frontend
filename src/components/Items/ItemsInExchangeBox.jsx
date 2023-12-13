
export const ItemsInExchangeBox = ({ owner, indx, remove, data, img, isPhone}) => {

     

       const handleRemove = (e) => {
        remove(e)
       }

    return (<div onTouchEnd={(isPhone)? handleRemove :null }  onClick={(isPhone)? null :handleRemove } data-id={data} className={`${owner} sm:h-[50px] sm:w-[70px] sm:min-w-[70px]  md:h-[125px] md:w-[135px] md:min-w-[135px] cursor-pointer`} style={{backgroundImage:  `url(${(img == null)? '../images/Fn_iGOeWQAMrhxg.jpg' : (img.includes('https'))?img: `${import.meta.env.VITE_AWS_BUCKET}${img}`})`, backgroundPosition: 'center', backgroundSize: 'cover' }} >
                <div className="bg-white relative" >
                    <img src="../images/minus-sign.png" className="absolute h-6 right-0 pointer-events-none "></img>
                </div>
            </div>
    )
}