import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { ItemLayout } from "./ItemLayout";
import { useState } from "react";
import { Loader } from "../Account/Loader";


export const UserItems = () => {

    const token = UseItemsStore(state => state.token);
    const isSearch = UseItemsStore(state => state.isSearch);
    const search = UseItemsStore(state => state.search);

    const [info1, setInfo1] = useState([]);
    const {id} = useParams();
 
    let queryData;
 
         queryData = useQuery({
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: isSearch && search !== '',
             queryKey:['searchOtherItems'],
             queryFn: async () => {
                let info = await (await fetch(`${ (import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/search/${search}`  , { credentials: 'include', headers:{Authorization: token} })).json()
                setInfo1(info)
                return info;
         },
 })

        let getUserItems = useQuery({
            enabled: !isSearch,
            queryKey: ['userItems', id],
            queryFn: async () => {
                let info =  await (await fetch( `${ (import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/ownerItems/${id}`  , { credentials: 'include', headers:{Authorization: token} })).json()
                setInfo1(info)
                return info;
            }
        })

        const userQuery = useQuery({
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enable: id !== null,
            queryKey: ["userName", id],
            queryFn: async () => await (await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/getUsername/${id}` , { credentials: 'include' })).json() ,
        })

        if(getUserItems.isSuccess){
        }
         
 
 
     if(queryData.isFetching || getUserItems.isFetching) return <div className="w-full h-20 mt-32"><Loader/></div>;
 
     if( getUserItems.isSuccess || queryData.isSuccess ){
 
        return(
        <>
            <div className=" h-20 w-full sm:p-5 sm:mr-0 md:ml-10"> <h1 className=" sm:text-lg md:text-2xl text-left">{userQuery?.data?.username}'s Items</h1></div>
                <div className="flex flex-wrap content-evenly  justify-start md:w-10/12 sm:mt-0 md:mt-5 sm:w-full  sm:mx-0 md:mx-auto" >
                { info1.map((item, indx) => <ItemLayout key={indx} item={item} /> ) }
            </div>
        </>)
    }
     
 
     
     if(getUserItems.isError || queryData.isError){
     return (
         <div className="flex flex-wrap content-evenly  justify-start md:w-10/12 md:h-full sm:w-full  sm:mx-0 md:mx-auto" >
         Error fetching data
         </div>
         )}
}
