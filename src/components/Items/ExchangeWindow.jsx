import { MyItemsAvailable } from "./MyItemsAvailable";
import './ExchangeWindow.css'
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { ItemsInExchangeBox } from "./ItemsInExchangeBox";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Account/Loader";

export const ExchangeWindow = ({imgArr, setWindow, otheruser, isPhone}) => {

    const token = UseItemsStore( state => state.token);
    const csrf = UseItemsStore( state => state.csrf);
    const setCsrf = UseItemsStore( state => state.setCsrf);
    const user = UseItemsStore( state => state.user);
    const myExchangeItems = UseItemsStore( state => state.myExchangeItems);
    const otherUserExchangeItems = UseItemsStore( state => state.otherUserExchangeItems);
    const myItems = UseItemsStore( state => state.myItems);
    const otherUserItems = UseItemsStore( state => state.otherUserItems);
    const setLogout = UseItemsStore( state => state.setLogout);
    
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    
    //set states
    const setOtherUserItems = UseItemsStore((state) => state.setOtherUserItems);
    const setMyItems = UseItemsStore((state) => state.setMyItems);
    const setOtherUserExchangeItems = UseItemsStore((state) => state.setOtherUserExchangeItems);
    const setMyExchangeItems = UseItemsStore((state) => state.setMyExchangeItems);


    const [img, setImg] = useState(null);
    const [otherUsertotal, setOtherUserTotal] = useState(0);
    const [myTotal, setMyTotal] = useState(0);

    const stockImage  = '../images/Fn_iGOeWQAMrhxg.jpg';

    const displayError = async (message) => {
        setIsError(true);
        setErrorMessage(message);

        const prom = new Promise((resolve) => {
            const timeout = setTimeout(() => {
                setIsError(false);
                clearTimeout(timeout);
                resolve(true);
            }, 5000)
        });
        
        const resolveProm = await prom;
    }

    const displaySuccess = async (message) => {
        setIsSuccess(true);
        setSuccessMessage(message);

        const prom = new Promise((resolve) => {
            const timeout = setTimeout(() => {
                setIsSuccess(false);
                setWindow(false);
                clearTimeout(timeout);
                resolve(true);
            }, 5000)
        });
        
        const resolveProm = await prom;
    }

    const queryData = useQuery({
        refetchOnWindowFocus:false,
        retry:false,
        queryKey: ['allItemsExchange'],
        queryFn: async () => {

            if(user === 'guest') {
                setWindow(false);
                throw new Error('You are not logged in');
            }
            
            let otherUsername = await(await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/getUsername/${otheruser}`, { credentials: 'include' })).json();
            let userItems = await (await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/ownerItems/${otheruser}` , { credentials: 'include' })).json()
            let myItems = await (await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/sessionItems` , { headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                Csrf: csrf
            }})).json()
            setOtherUserTotal(0);
            setMyTotal(0);
            userItems = userItems.filter((ele) => ele.quantity === '1');
            setOtherUserItems(userItems);
            myItems = myItems.filter((ele) => ele.quantity === '1');
            setMyItems(myItems);
            setOtherUserExchangeItems([]);
            setMyExchangeItems([]);

            

            return {myItems, userItems, otherUsername}
        },
        onError:()=>{
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        },
        onSuccess: (data) => {
        },

    })

    const exchange = useMutation({
        retry: false,
        mutationKey: 'exchange',
        mutationFn: async () => {
            if(otheruser === user.user_id){
                const errorString = 'You cannot exchange with yourself';
                displayError(errorString);
                throw new Error("1");
            }
            if(myExchangeItems.length < 1 || otherUserExchangeItems.length < 1){
                const errorString = 'There must be at least 1 Item from both Users';
                displayError(errorString);
                throw new Error("1");
            }

            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/createDeal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                    Csrf: csrf
                },
                body: JSON.stringify({
                    acc_2: otheruser,
                    your_items: myExchangeItems.map((ele) => ele.id),
                    other_items: otherUserExchangeItems.map((ele) => ele.id) ,
                })
            })
            let json = await response.json();

            if(!response.ok){
                throw new Error(json.message);
            }

            return json;
        },
        onSuccess: async (data) => {
            setCsrf(data.csrf);
            setOtherUserExchangeItems([]);
            setMyExchangeItems([]);
            displaySuccess("Offer Sent!");
        },
        onError: (error) => {
            if(error.message === '1'){
                return;
            }
            setLogout({username:'guest', user_id: null}, null ,null);
            setWindow(false);
            navigate('/login');
        },
        onSettled: () => {
            queryData.refetch();
        }
    })


    document.addEventListener("dragover", function(event) {
        event.preventDefault();
      });

    

    const dropArea = (e) => {
        e.target.classList.add('shadow-xl');
    }
    const dropAreaout = (e) => {
        e.target.classList.remove('shadow-xl');
    }

    const dropping = (e, extra) => {
        let info = {}
        if (e.type === 'touchend' ){
            info = extra;
        } else{
            e.preventDefault()
            info = img;
        }

        let remainItems = []
        
        let currentI = (info.objective === 'otherUserItems')? otherUserItems : myItems;

        currentI = currentI.filter((i) => { if(i.id === info.id){   return true} else{ remainItems.push(i); return false;} });
        if(info.objective === 'otherUserItems'){
            setOtherUserItems(remainItems);
            setOtherUserExchangeItems([...otherUserExchangeItems, currentI[0]]);
            setOtherUserTotal(otherUsertotal + Number(currentI[0].price));
        }else{
            setMyItems(remainItems);
            setMyExchangeItems([...myExchangeItems, currentI[0]]);
            setMyTotal(myTotal + Number(currentI[0].price));
        }


        setImg(null);
        
        e.target.classList.remove('shadow-xl')
    }
    

    const moveAround = (e) => {
            if(e.target.nodeName === 'DIV') return;
            let objective;
            if(e.target.classList.contains('userItems')){
                objective = 'otherUserItems'} else {objective = 'myItems'}
            
            if(e.type === 'touchend'){ dropping(e, {objective:objective, id: e.target.alt})}
            else{setImg({objective:objective, id: e.target.alt});}
    }

    const remove = (e) => {
        let objective;
        if(e.target.classList.contains('userItems')){
            objective = 'otherUserItems'
        } else {
            objective = 'myItems'
        }

        let remainItems = []
        
        let currentI = (objective === 'otherUserItems')? otherUserExchangeItems : myExchangeItems;

        currentI = currentI.filter((i) => { if(i.id === e.target.dataset.id){   return true} else{ remainItems.push(i); return false;} });

        if(objective === 'otherUserItems'){
            setOtherUserExchangeItems(remainItems);
            setOtherUserItems([...otherUserItems, currentI[0]]);
            setOtherUserTotal(otherUsertotal - Number(currentI[0].price));
        }else{
            setMyExchangeItems(remainItems);
            setMyItems([...myItems, currentI[0]]);
            setMyTotal(myTotal - Number(currentI[0].price));
        }
        e.stopPropagation();
    }

    const exitWindow = (e) => {
        queryData.refetch();
        setWindow(false);
    }

    if(queryData.isLoading){
        return <div className="w-[200px] h-[100px] fixed top-[40%] bg-opacity-60 sm:left-[24%] md:left-[45%] bg-white rounded-lg shadow-md flex justify-center items-center ">
             <Loader/>
        </div>}
        if(queryData.isError || isError){

           return( <div className=" animation-vanish duration-[8000ms] transition-opacity bg-gray-600 absolute  md:grid-cols-2 p-6 w-full sm:h-1/3 md:h-1/4 pointer-events-none sm:grid-rows-4 md:grid-rows-2 sm:grid-cols-1 md:gap-0 sm:gap-6 opacity-0 z-10  sm:w-full md:w-2/3 sm:top-1/2 sm:left-0 md:top-1/4 md:left-80 ">
            <h2 className=" h-6 p-2 row-start-1 col-start-1 ml-auto sm:-top-8 text-2xl sm:mt-16 mx-auto md:w-1/4 md:mt-24 text-white">{(isError)? errorMessage :'Please loggin to make offers'}</h2>
        </div>)
        }
        if(queryData.isSuccess){

    return(
        <div className=" window-exchange-frame  " >
            <div onClick={exitWindow} className=" bg-black opacity-20 fixed h-full w-full top-0 left-0 duration-200 "></div>

            <div className="use-overflow flex flex-wrap justify-center bg-white md:p-6 sm:pb-0 md:gap-6 sm:gap-2 opacity-100 z-10 fixed sm:h-[100vh] md:h-[700px] sm:w-[100%] md:w-[800px] md:top-14 sm:top-0 center-exchange">
                <button onClick={exitWindow} className=" sm:hidden md:block bg-red-500 h-12 w-12 absolute right-[-24px] top-[-24px] hover:scale-[1.05] transition-all rounded-3xl text-center text-white font-semibold z-20">X</button>
                
                <div className="w-[100%] h-10 flex justify-between items-center px-12 ">
                    <h2 className=" h-6  "><span className="text-white bg-orange-700 p-1 rounded-xl text-lg font-bold font-sans">{queryData.data.otherUsername.username}</span>'s Items</h2>
                    <h2 className="h-6 md:block sm:hidden  "><span className="text-white bg-fuchsia-900   p-1 rounded-xl text-lg font-bold font-sans">{user.username}</span>'s Items</h2>
                </div>

                <div id='userItems'  className="bg-slate-200 rounded-lg flex items-center justify-center flex-wrap gap-1 overflow-x-auto md:h-[200px] sm:w-[310px] md:w-[300px] sm:h-[180px] md:p-1 ">
                    {otherUserItems.map((ele, indx) => <MyItemsAvailable key={indx} data={ele.id} img={ele.images} owner={'userItems'} colly={moveAround} indx={indx}  />)}
                </div>

                
                <div className=" md:block sm:hidden row-start-1 w-1 col-start-2 row-end-3 line3"></div>

                <h2 className="h-8 sm:block md:hidden w-[100%] px-12 "><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-lg font-bold font-sans">{user.username}</span>'s Items</h2>

                <div id='myItems' className="bg-slate-200 flex flex-wrap items-center justify-center gap-1 overflow-x-auto md:h-[200px] sm:h-[180px] sm:w-[310px] rounded-lg md:w-[300px] md:p-1">
                    {myItems.map((ele, indx) => <MyItemsAvailable key={indx} data={ele.id} img={ele.images} owner={'myItems'} colly={moveAround} indx={indx} />)}
                </div>

                
                
                <div id='userExchangeBox' onDragEnter={dropArea} onDragLeave={dropAreaout} onDrop={dropping} className="rounded-sm sm:w-[170px] sm:h-[120px] md:h-[150px] md:w-[300px] md:gap-3 sm:flex-wrap md:flex-nowrap sm:gap-2 overflow-x-auto overflow-y-hidden transition-shadow bg-orange-700 bg-opacity-30 p-2 flex justify-center items-center">
                    {otherUserExchangeItems.map((ele, indx) => <ItemsInExchangeBox key={indx} data={ele.id} img={(ele.images)? ele.images: stockImage} indx={indx} owner={'userItems'} remove={remove}  />)}
                </div>

                <div id='myExchangeBox' onDragEnter={dropArea} onDragLeave={dropAreaout} onDrop={dropping} className="rounded-sm sm:w-[170px] sm:h-[120px] md:h-[150px] md:w-[300px] md:gap-3 overflow-x-auto md:flex-nowrap overflow-y-hidden transition-shadow bg-fuchsia-900 bg-opacity-30 p-2 flex justify-center items-center">
                    {myExchangeItems.map((ele, indx) => <ItemsInExchangeBox key={indx} data={ele.id} isPhone={isPhone} img={(ele.images)? ele.images: stockImage} indx={indx} owner={'myItems'} remove={remove}  />)}
                </div>

                <div className=" w-[80%]">

                <div className="md:w-[400px] sm:w-[100%] my-2 mx-auto h-10 flex justify-between items-center sm:px-1 md:px-12 ">
                    <h2 className="h-6"><span className="text-white bg-orange-700 p-1 rounded-xl text-lg font-bold font-sans">{queryData.data.otherUsername.username}</span>'s Value</h2>
                    <div className="  w-1 h-[100%] line3"></div>
                    <h2 className="h-6"><span className="text-white bg-fuchsia-900 p-1 rounded-xl text-lg font-bold font-sans">{user.username}</span>'s Value</h2>
                </div>

                    <div className="mx-auto grid grid-rows-1 grid-cols-2 bg-sky-500 text-white row-start-2 col-start-1 col-end-3 h-14 md:w-1/2 sm:w-full rounded-3xl md:bottom-6 sm:bottom-20 md:border-0 sm:border-2 sm:border-white sm:left-0 md:left-1/4 shadow-md ">
                        
                        <h1 className=" font-semibold text-center my-auto md:p-0 sm:pr-10">{otherUsertotal}</h1>
                        <h1 className=" font-semibold text-center my-auto md:p-0 sm:pl-10">{myTotal}</h1>
                    </div>
                    <div className="sm:w-[100%] md:w-[200px] mx-auto m-2">
                        <button onClick={exitWindow} className=" md:hidden sm:inline-block bg-red-500 text-white h-[46px] w-[90px] rounded-md mr-1">Cancel</button>
                        <button onClick={() => exchange.mutate()} disabled={exchange.isLoading || exchange.isSuccess || isSuccess} className="bg-sky-500 text-white h-12 sm:w-[200px] md:w-[200px] rounded-md md:left-1/3 sm:left-0 sm:-bottom-10  md:-bottom-12 hover:scale-105 hover:shadow-md duration-200" >Offer Trade</button>
                    </div>
                </div>

                <div className={`${(isPhone)? 'block':'hidden'} w-[100%] h-[120px]`} ></div>

                {(isSuccess)?(<div className="fixed top-[40%] bg-green-500 sm:h-[100px] w-[100%] "><h1 className="text-center text-lg text-white w-[100%] h-20">{SuccessMessage}</h1></div> ): null}
            
            </div>
        </div>
    )
        }
        
}