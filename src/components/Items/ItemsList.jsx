import { ItemLayout } from "./ItemLayout"
import { useMutation, useQuery } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { useState } from "react";
import { getQueryFn } from "../../extras/extras";
import { Loader } from "../Account/Loader";

export const ItemList = ({arr}) => {

   const isSearch = UseItemsStore(state => state.isSearch);
   const search = UseItemsStore(state => state.search);
   const currentPage = UseItemsStore(state => state.currentPage);
   const items = UseItemsStore(state => state.items);
   const setItems = UseItemsStore(state => state.setItems);
   const setTotal = UseItemsStore(state => state.setTotal);
   const total = UseItemsStore(state => state.total);

   const [info1, setInfo1] = useState([]);
   let queryData;

   const returnCb = (data) => {
        setInfo1(data.data);
        setTotal(Number(data.total));
   }

        queryData = useQuery({
            refetchOnWindowFocus: false,
            enabled: !isSearch,
            queryKey:['searchItems', currentPage],
            queryFn: getQueryFn(""+(currentPage!=0)?`?page=${currentPage}`:'', returnCb),
        });

        let searchQuery = useQuery({
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: isSearch && search !== '',
            queryKey:['search', currentPage],
            queryFn: async () => {
                let info = await (await fetch(`${ (import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/search/${search}${(currentPage!=0)?`?page=${currentPage}`:''}`
                  
                  )).json()
                setItems(info.data);
                setTotal(info.total);
                return info;
            }
        })

        

        
    if(isSearch && items.length > 0){
        return(
            <>
            <h2 className="sm:text-lg md:text-xl w-[100] sm:px-8 md:px-[210px] py-2 text-stone-400">Results: {total}</h2>
                <div className="flex flex-wrap content-evenly sm:gap-1 md:gap-5 md:min-h-[78vh] sm:pt-1 justify-center  md:w-10/12 sm:mt-0 md:mt-5 sm:w-full  sm:mx-0 md:mx-auto" >
                { items.map((item, indx) => <ItemLayout key={indx} item={item} /> ) }
                </div>
            </>
        )
    }
    if(queryData.isFetching || searchQuery.isFetching) return <><div className="w-[100%] md:min-h-[78vh] flex justify-center items-center "><Loader/></div><div className="h-[600px]"></div></>;

    if( info1?.length > 0){

        return(
            <>
                <h2 className="sm:text-lg md:text-xl w-[100] sm:px-8 md:px-[210px] py-2 text-stone-400">Results: {total}</h2>
                <div className="flex flex-wrap content-evenly sm:gap-1  md:gap-5 sm:pt-5 justify-center md:min-h-[78vh] md:w-10/12 sm:mt-0 md:mt-0 sm:w-full  sm:mx-0 md:mx-auto" >
                    { info1.map((item, indx) => <ItemLayout key={indx} item={item} /> ) }
                </div>
                
            </>
        )
    }
    

  
    if(queryData.isError){
    return (
        <div className="flex flex-wrap content-evenly  justify-start md:w-10/12 md:h-full sm:w-full  sm:mx-0 md:mx-auto" >
        Error fetching data
        </div>
        )}
        
}