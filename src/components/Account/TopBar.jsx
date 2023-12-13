import { useQuery, useMutation } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { postMutation } from "../../extras/extras";
import { Messages } from "./Messages";


export const TopBar = ({menu, setCurrent }) => {

    const navigate = useNavigate();

    const user = UseItemsStore((state) => state.user);
    const token = UseItemsStore((state) => state.token);
    const csrf = UseItemsStore((state) => state.csrf);
    
    const setLogout = UseItemsStore((state) => state.setLogout);

    const logout = useMutation({
        mutationFn: async () => {
            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                    Csrf:csrf
                },
            })
            let json = await response.json();
            
            return json;
        },
        onSuccess: () => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        },
    })

const activateM = (e) => {
    menu(true);
}

return (
    <>
        <div className=" z-30 fixed h-14 w-[100%] sm:hidden md:flex bg-white shadow-lg gap-6 justify-end px-10 topBarAccount">
            <button onClick={() => setCurrent(<Messages/>)} className=" col-start-3"><h2 className=" h-8 my-auto">Messages</h2></button>
            <h2 className=" col-start-3 h-8 my-auto ">{user.username}</h2>
            <button onClick={() => logout.mutate() } className=" col-start-4"><h2 className=" h-8 my-auto">Logout</h2></button>
        </div>
        <div className=" z-30 fixed w-[100%] h-14 md:hidden bg-white sm:gap-4 sm:flex shadow-lg">
            <button onTouchEnd={activateM} className=" col-start-1 w-[50px] mx-4"><img className=" w-8 mx-auto" src="../images/menu.png"></img></button>
            <div className="w-4"></div>
            <button onTouchEnd={() => setCurrent(<Messages/>)} className=" col-start-3"><h2 className=" h-8 my-auto">Messages</h2></button>
            <h2 className=" col-start-4 h-8 my-auto "><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-lg font-bold font-sans">{user.username}</span></h2>
            <button onTouchEnd={() => logout.mutate()} className=" col-start-5"><h2 className=" h-8 my-auto">Logout</h2></button>
        </div>
    </>
)
}