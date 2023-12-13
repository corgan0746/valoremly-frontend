import "../Home/HomeBanner.css";
import { DealsAwaiting } from "./DealsAwaiting";
import { OffersSent } from "./OffersSent";
import { MyItems } from "./MyItems";
import { Settings } from "./Settings";
import { Sealed } from "./Sealed";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";
import { useState } from "react";
import { UseItemsStore } from "../store/store";
import { useQuery } from "@tanstack/react-query";

export const MainSideBar = ({setCurrent, bar, closeSide}) => {

    const token = UseItemsStore(state => state.token);
    const csrf = UseItemsStore(state => state.csrf);
    const setLogout = UseItemsStore(state => state.setLogout);

    const isPhone = window.innerWidth < 700;

    const navigate = useNavigate();

    useQuery({
        queryKey: ["pingToken"],
        refetchOnMount: false,
        refetchInterval:60 * 1000,
        retry:false,
        queryFn: async () => {
            const request = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/ping`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                    Csrf: csrf
                }});

            if(!request.ok){
                throw new Error("not valid session");
            }

            return true;

        },
        onError:() => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        }
    })

    const activateMenu = (state) => {
        closeSide(state);
    }


    return(
        <>
       <div onTouchStart={(e) => console.log(e)} className={` ${(bar)? 'animate-slideIn' : 'animate-slideOut'} flex-wrap z-40 w-28 fixed md:h-full sm:h-[100vh] banner md:left-0 sm:-left-[80%]  `}>
            <button onTouchEnd={(e) => activateMenu(!bar)} className={` ${(bar)? 'block': 'hidden'} sm:block md:hidden bg-red-500 absolute h-10 w-10 font-semibold text-white rounded-xl top-[45%] left-24`}> 	&#60; </button>
            <div className='w-4/5 h-10 mx-auto mt-2 block bg-white '>
                <Link to='/'>
                    <img className='w-full h-full' src="../images/8117854737_20097ba3-f8bb-4c95-91a6-d7217d175962.png"></img>
                </Link>
            </div>
            <div className="button-subdivision mx-auto">
                <button onClick={() => { setCurrent(<OffersSent setCurrent={setCurrent} />); activateMenu((isPhone)?false:true)  } } className=" h-18 mt-4 mb-4">
                    <i className="fa-solid text-white h-[37px] w-[37px] text-4xl fa-square-arrow-up-right"></i>
                    <h2 className="px-5 pb-4 text-white leading-5">Offers Sent</h2>
                </button>
                <button onClick={() => { setCurrent(<DealsAwaiting setCurrent={setCurrent} />); activateMenu((isPhone)?false:true) }  } className=" h-18 mt-4 mb-4">
                    <img className=" w-1/3 p-1 mx-auto" src="../images/men-exchanging-symbol.png"></img>
                    <h2 className="px-2 pb-4 text-white leading-5">Deals Awaiting</h2>
                </button>
                <button onClick={() => { setCurrent(<MyItems/>); activateMenu((isPhone)?false:true)   }} className=" h-18 mt-4 mb-4">
                    <img className=" w-1/3 p-1 mx-auto" src="../images/list.png"></img>
                    <h2 className="px-5 pb-4 text-white leading-5">My Items</h2>
                </button>
                <button onClick={() => { setCurrent(<Settings/>); activateMenu((isPhone)?false:true) } } className=" h-18 mt-4 mb-4">
                    <img className=" w-1/3 p-1 mx-auto" src="../images/settings.png"></img>
                    <h2 className="px-5 pb-4 text-white leading-5">Settings</h2>
                </button>
                <button onClick={() => { setCurrent(<Sealed/>); activateMenu((isPhone)?false:true) }} className="mx-auto h-18 mt-4 mb-4">
                    <img className=" w-1/3 p-1 mx-auto" src="../images/handshake.png"></img>
                    <h2 className="px-5 pb-4 text-white leading-5">Sealed</h2>
                </button>
            </div>
        </div>
        <TopBar menu={activateMenu} setCurrent={setCurrent} />
        
        </>
    )
}