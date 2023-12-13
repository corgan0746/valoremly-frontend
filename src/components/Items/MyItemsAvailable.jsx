export const MyItemsAvailable = ({colly, owner, indx, data, img}) => {

    const asb = (e) => {
        colly(e);
    }

    
    return (<div onTouchEnd={asb} onDragStart={asb} className="relative md:w-[90px] h-[70px]" >
        <img alt={data}  className={owner + ' hover:scale-105 hover:shadow-sm duration-100'} style={{objectFit: 'cover', width:'90px', minWidth: '80px', height:'70px', minHeight:'60px'}} onError={(e)=> e.target.src = '../images/Fn_iGOeWQAMrhxg.jpg'} src={ (img === null)?'../images/Fn_iGOeWQAMrhxg.jpg': (img.includes('https'))?img: `${import.meta.env.VITE_AWS_BUCKET}${img}`} ></img>
        
        </div>
    )
}