import { ItemCompactCard } from "./ItemCompactCard";
import "../Items/ExchangeWindow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sealed } from "./Sealed";
import { useNavigate } from "react-router-dom";
import { UseItemsStore } from "../store/store";
import { Loader } from "./Loader";


export const SingleDeal = ({sealed, data, setCurrent, refetch, ownOffer = true}) => {

    const navigate = useNavigate();

    const token = UseItemsStore(state => state.token);
    const csrf = UseItemsStore(state => state.csrf);
    const setCsrf = UseItemsStore(state => state.setCsrf);
    const user = UseItemsStore(state => state.user);
    
    let myItems = []

    
    let otherUser = data.items.filter((ele) => {
        if(ele.owner !== user.user_id ){
            return true;
        }else{
            myItems.push(ele);
            return false;
        }
    });
    
    let myNumbers = myItems.map((ele) =>  Number(ele.price))
    let userNumbers = otherUser.map((ele) =>  Number(ele.price))
        

    const userQuery = useQuery({
        enabled: otherUser !== undefined,
        queryKey: ["user", otherUser[0]],
        queryFn: async () => await (await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/getUsername/${otherUser[0].owner}` )).json() ,
    })

    const acceptDeal = useMutation({
        mutationKey: ["acceptDeal", data.deal_id],
        mutationFn: async () =>{ 
            
            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/acceptDeal` , {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                Csrf: csrf
            },
            body: JSON.stringify({deal_id: data.deal_id})
            })
            if(!response.ok){
                throw new Error("Error accepting deal")
            }
            
            const json = await response.json();

            return json;
        },
        onError: () => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        },
         onSuccess: (data) => {
                setCsrf(data.csrf)
                setCurrent(<Sealed/>)
                navigate('/account')
            },   
    })

    const rejectDeal = useMutation({
        mutationKey: ["rejectDeal", data.deal_id],
        mutationFn: async () =>{ 
            
            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/rejectDeal` , {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                Csrf: csrf
            },
            body: JSON.stringify({deal_id: data.deal_id})
            })
            if(!response.ok){
                throw new Error("Error rejecting deal")
            }
            const json = await response.json();

            return json;
        },
        onError: () => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        },
         onSuccess: (data) => {
            setCsrf(data.csrf);
        },
        onSettled:() => {
            refetch();
        }
    })
    

    if(userQuery.isLoading){
        return <Loader/>
    }

    if(userQuery.isSuccess){
       
    
    return( 
    <div className="flex justify-center flex-wrap md:w-[780px] sm:h-[400px] md:h-[400px] md:gap-4 sm:gap-5 sm:w-[100%] animate-appear transition-opacity relative shadow-md shadow-gray-400 z-0 md:p-2 resizedItem  md:m-7 sm:m-0 sm:my-20 border-2 border-gray-100  bg-gray-100">
        <div className=" md:block sm:hidden z-10 absolute w-10 h-10 bg-black rounded-lg pt-1 scale-90 top-[64%] left-[370px]  " >    
            <img style={{paddingRight:'1px'}}  src="../images/men-exchanging-symbol.png" className=" h-3/4 w-3/4 mx-auto "></img>
        </div>    
        <h2 className="absolute z-10  text-center p-1  bg-white rounded-lg border-2 border-gray-400 sm:left-[35%] md:left-[40%] -translate-x-14 -top-9" >Exchange#{data.deal_id}</h2>
        <div className="absolute z-0 text-center pb-2 rounded  flex md:w-[780px] md:block sm:hidden " >
            <h2 className=" inline-block w-1/2 font-semibold " ><span className="text-white bg-orange-700 p-1 rounded-xl text-lg font-bold font-sans">{userQuery.data.username}</span> Items</h2>
            <h2 className=" inline-block w-1/2 font-semibold"><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-lg font-bold font-sans">Your</span> Items</h2>
        </div>
        <h2 className=" md:hidden absolute inline-block w-1/2 font-semibold sm:left-0 sm:text-center " ><span className="text-white bg-orange-700 p-1 rounded-xl text-lg font-bold font-sans">{userQuery.data.username}</span> Items</h2>
        <div style={{borderWidth:'1px'}} className=" sm:w-[150px] flex md:w-[300px] sm:h-[200px] md:h-[200px] p-2 gap-2 rounded-md bg-white border-purple-900 items-center mt-8 overflow-x-auto  ">
            {otherUser.map((ele, indx) => <ItemCompactCard item={ele} key={indx} /> )}
        </div>
        <h2 className=" md:hidden absolute sm:right-0 sm:text-center inline-block w-1/2 font-semibold " ><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-lg font-bold font-sans">Your</span> Items</h2>
        <div style={{borderWidth:'1px'}}  className="sm:w-[150px] flex md:w-[300px] sm:h-[200px] md:h-[200px] p-2 bg-white gap-2 rounded-md  border-purple-900 items-center mt-8 overflow-x-auto" >
            {myItems.map((ele, indx) => <ItemCompactCard item={ele} key={indx} /> )}
        </div>
        {(!sealed)? 
            <>
                <div className={` px-1 sm:h-[150px] w-[40%]`}>
                    <h1 className="  h-14 text-center sm:my-4 md:my-2 mx-auto font-semibold"><span className="text-white bg-orange-700 p-1 rounded-xl text-lg font-bold font-sans">{userQuery.data.username}</span>'s value: <br></br>$<strong>{userNumbers.reduce((total , num) => total + num)}</strong></h1>
                    <button onClick={() => acceptDeal.mutate()} disabled={sealed} className={`${(ownOffer)? 'hidden': 'block'} md:m-4 w-[100%] h-[50px]  bg-blue-500 active:scale-75 active:bg-blue-600  text-white rounded-md hover:scale-95  hover:shadow-md duration-100 scale-90 font-bold`} >Accept</button>
                </div>
                <div className=" px-1 sm:h-[150px] w-[40%]">
                    <h1 className=" h-12 text-center sm:my-5 md:my-2 mx-auto font-semibold"><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-lg font-bold font-sans">Your</span> value: <br></br>$<strong>{(myNumbers.length)?myNumbers.reduce((total , num) => total + num):null}</strong></h1>
                    <button onClick={() => rejectDeal.mutate()} disabled={sealed} className="md:m-4 w-[100%] h-[50px] bg-red-600 active:scale-75 active:bg-red-700 text-white rounded-md hover:scale-95 scale-90 hover:shadow-md duration-100 font-bold" >{(ownOffer)?'Retract':'Decline'}</button>
                </div> 
            </>
        : 
            <div className=" bg-blue-600 h-[60px] w-[40%] flex justify-center items-center rounded-lg ">
                <h1 className=" text-white ">Processing...</h1>
            </div>
        }
    </div> )
    }
}