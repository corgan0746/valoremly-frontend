
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faRightLeft, faComment } from "@fortawesome/free-solid-svg-icons";



export const NotificationItem = ({url, navigate, message, image, date }) => {





    return (
        <div onClick={() => navigate(url)} className="flex w-[100%] h-[80px] bg-white border border-t-pink-50 cursor-pointer hover:scale-[1.05] transition-all overflow-x-hidden overflow-y-hidden ">
            <div className={`h-[100%] w-[40%] bg-slate-200  `} >
                <div className="h-[100%] w-[100px] mx-auto bg-white ">
                    <FontAwesomeIcon className='h-[100%] w-[100%]' size='2x' icon={(url.includes('/user/'))? faBan: (url.includes('offer-received'))? faRightLeft: (url.includes('offer-accepted'))? faCheck: (url.includes('message'))? faComment:null } />
                </div>
            </div>
            <div className="h-[100%] w-[60%] p-2 flex flex-wrap justify-between flex-col">
                <h3 className="leading-tight">{message}</h3>
                <p className="text-xs">{(new Date(date).toLocaleString())}</p>
            </div>
        </div>
        
    )
}