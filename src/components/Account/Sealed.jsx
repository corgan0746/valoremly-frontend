import { SingleDeal } from "./SingleDeal";
import { useQuery } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { getQueryFnWithAuth } from "../../extras/extras";
import { useState } from "react";
import { Loader } from "./Loader";

export const Sealed = () => {

    const token = UseItemsStore(state => state.token);
    const csrf = UseItemsStore(state => state.csrf);
    const setLogout = UseItemsStore(state => state.setLogout);
    
    const [deals, setDeals] = useState([]);

    const dealsData = useQuery({
        queryKey: ["sealedDeals"],
        queryFn: getQueryFnWithAuth(token, csrf, "/item/getDealsSealed",null ,null ,null ),
        onSuccess:(res) =>{
            setDeals(res);
        },
        onError:(err) => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        }
    })

    if(dealsData.isLoading){
        return <Loader/>
    }
    if(dealsData.isError){
        return <h1>Error fetching deals</h1>
    }

    if(dealsData.isSuccess){

        if(deals.length < 1){
            return(
                <>
                    <h1 className="w-[100%] text-2xl font-semibold font-nice">Sealed Deals</h1>
                    <div className="flex flex-wrap p-10">
                        <h5>You have no deals at the moment.</h5>
                    </div>
                </>
            )
        }
      
        if(deals.length > 0){

            return(
                <>
                    <h1 className="w-[100%] text-2xl font-semibold font-nice">Sealed Deals</h1>
                    <div className="flex flex-wrap justify-center">
                    {(deals.length > 0)?deals.map((ele, indx) => <SingleDeal sealed={true} data={ele} setCurrent={false} key={indx}/>): <h5>You have no deals at the moment.</h5>}
                    </div>
                </>
            )
        }
    }
}