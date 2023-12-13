import { ItemLayout } from "../Items/ItemLayout"
import '../Home/CentralCss.css';
import { useQuery } from "@tanstack/react-query";
import { PublishItem } from "./PublishItem";
import { useState } from "react";
import { UseItemsStore } from "../store/store";
import { getQueryFnWithAuth } from "../../extras/extras";
import { Loader } from "./Loader"

export const MyItems = () => {

    const token = UseItemsStore( state => state.token);
    const csrf = UseItemsStore( state => state.csrf);
    const setLogout = UseItemsStore( state => state.setLogout);

    const [itemWindow, setItemWindow] = useState(false);

    let items = [];

    const queryData = useQuery({
        queryKey: ["myItems"],
        queryFn: getQueryFnWithAuth(token, csrf, "/item/sessionItems",null ,null ,null ),
        onSuccess:(res) =>{
            items = res;
        },
        onError:(err) => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        }
    })

    const handlewindow = () => {
        setItemWindow(true);
    }

    const refreshItems = () => {
        queryData.refetch();
    }

    if(queryData.isLoading){
        return <Loader/>
    }
    if(queryData.isSuccess){
    return(
        <>
        <h1 className="w-[100%] text-2xl font-semibold font-nice">My Items</h1>
        {itemWindow ? <PublishItem refreshItems={refreshItems} setItemWindow={setItemWindow} /> : null}
        <div className="w-[100%] flex justify-end h-20 md:px-14 sm:pr-4">
            <div style={{boxShadow:'-6.5px 7.5px 0 0.5px #4775ff'}} className="block w-32 h-14 border-2 border-blue-700 my-2 rounded-3xl ShadowButton1">
                <button onClick={handlewindow} className="block text-center h-[100%] w-[100%]  font-semibold ">Add Item</button>
            </div>
        </div>
        <div className="flex flex-wrap justify-center sm:gap-0 md:gap-2 sm:py-4 md:py-10">
        {queryData.data.map((ele, indx) => <ItemLayout key={indx} item={ele} /> )}
        </div>
        </>
    )
    }
}