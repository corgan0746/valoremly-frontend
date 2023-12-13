import './ItemLayout.css';
import { Link, useNavigate } from 'react-router-dom';

export const ItemLayout = ({item}) => {

    return (
        
        <div  className=" sm:w-[49%] sm:h-72 animate-appear transition-all scale-100 md:mx-4 md:w-56 md:h-72 min-w-56 min-h-72 sm:bg-gray-50 md:bg-white shadow-lg sm:border-2 sm:border-gray-100 md:border-black-400 md:border-1 rounded-lg item-displayed-layout">
            <Link to={`/item/${item.id}`} className={'w-full h-full'}>
                <div className={` h-1/2 relative`}>
                    <div className={`${(item.quantity === '0')? 'block':'hidden'} absolute bg-black bg-opacity-60 text-white w-40 text-center h-6 rounded-lg `}>Item in exchange <i class="fa-solid fa-rotate"></i></div>
                    <img className="h-full w-full " style={{objectFit: 'cover'}} onError={(e)=> e.target.src = '../images/Fn_iGOeWQAMrhxg.jpg'} src={ (item.images === null)?'../images/Fn_iGOeWQAMrhxg.jpg': (item.images.includes('https'))?item.images: `${import.meta.env.VITE_AWS_BUCKET}${item.images}`} ></img>
                </div>
                <div className="bg-white h-1/2 grid grid-cols-5 grid-rows-6 p-2 rounded-lg">
                    <h2  className=' text-lg tryingApple col-start-3 row-start-1 row-end-2' style={{fontFamily:'sans-serif'}} >£{item.price}</h2>
                    <h2  className=' w-full h-full overflow-hidden text-md row-start-3 row-end-6 col-start-1 col-end-6 '>{item.name + ' ' + item.category}</h2>
                    
                    <img className='row-start-6 row-end-7 w-7 col-start-5 hover:shadow-sm duration-200' src='../images/save-instagram.png'>

                        
                    </img>
                </div>
            </Link>
        </div>
        
    )

}
