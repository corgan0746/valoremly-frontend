import { MainSideBar } from "./MainSideBar";
import { useState, useEffect, useLayoutEffect } from "react";
import { Brief } from "./Brief";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { UseItemsStore } from "../store/store";
import { Messages } from "./Messages";
import { DealsAwaiting } from "./DealsAwaiting";
import { Sealed } from "./Sealed";


export const MainContent = () => {

    const user = UseItemsStore( state => state.user);

    const location = useLocation();
    const navigate = useNavigate();

    

    const [current, setCurrent] = useState(<Brief/>)
    const [bar, setBar] = useState((window.innerWidth > 700));

    

    useLayoutEffect(() => {
        if(user.username === 'guest'){
            navigate('/login');
        }

        if(location.search){
            const redirect = location.search.substring(1);
            switch(redirect){
                case 'messages':
                    setCurrent(<Messages/>);
                    break;
                case 'offer-received':
                    setCurrent(<DealsAwaiting/>);
                    break;
                case 'offer-accepted':
                    setCurrent(<Sealed/>);
                    break;
            }
    }

    }, [user, location])

    const closeSide = (state) => {
        setBar(state);
    }

    return(
        <div className=" md:h-full sm:min-h-[100px] sm:max-h-[auto] ">
            <MainSideBar closeSide={closeSide} bar={bar} setCurrent={setCurrent}/>
            <div onTouchStart={() => setBar(false)} className="flex justify-center items-start flex-wrap sm:flex-row h-[auto] sm:pt-14 md:pl-40 md:pt-20 w-[100%] bg-white">
                {current}
            </div>
        </div>
    )
}