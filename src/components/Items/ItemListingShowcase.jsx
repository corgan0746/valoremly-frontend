import { DeployMiniGallery } from "./DeployMiniGallery"
import { ExchangeWindow } from "./ExchangeWindow"
import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UseItemsStore } from "../store/store";
import { Loader } from "../Account/Loader";


export const ItemListingShowcase = () => {

    const navigate = useNavigate();

    const [zoom, setZoom] = useState(true);

    let {id} = useParams();

    const token = UseItemsStore(state => state.token);
    const csrf = UseItemsStore(state => state.csrf);
    const setCsrf = UseItemsStore(state => state.setCsrf);
    const user = UseItemsStore(state => state.user);
    
    const setLogout = UseItemsStore(state => state.setLogout);

    const isPhone = window.innerWidth < 600;

    const responseQuery = useQuery({
        queryKey: ["item", id],
        refetchOnMount: false,
        refetchOnWindowFocus:false,
        retry:false,
        queryFn: async () =>{
            const response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/${id}`);
            if(!response.ok){
                throw new Error(response.statusText)
            }

            const json = await response.json();

            return json;
        }
    })

    const userQuery = useQuery({
        enable: responseQuery?.data?.owner !== undefined,
        refetchOnMount: false,
        refetchOnWindowFocus:false,
        retry:false,    
        queryKey: ["user", responseQuery],
        queryFn: async () => {
            const response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/getUsername/${responseQuery?.data?.owner}`)

            if(!response.ok){
                throw new Error(response.statusText)
            }

            const json = await response.json();

            return json;

        }
    })

    const deleteItem = useMutation({
        mutationFn: async () =>{
            const response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/deleteItem/${id}`,
            {method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                Csrf: csrf
            }}
             );

            if(!response.ok){
                throw new Error(response.statusText)
            }

            const json = await response.json();

            return json;
        },
        onSuccess: (data) => {
            setCsrf(data.csrf);
            navigate('/account');
        },
        onError: (data) => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        }
    })

    

    const [isWindow, setIsWindow] = useState(false);

    

    if(responseQuery.isFetching) {return <div className="w-[200px] h-[100px] fixed top-[40%] bg-opacity-60 sm:left-[24%] md:left-[45%] bg-white flex justify-center items-center ">
                                      <Loader/>
                                    </div>}
    if(responseQuery.isError) {return <div>Error 404</div>}
    if(responseQuery.isSuccess) {



    const deployExchange = () => {
        if(user.user_id === owner){return}
        setIsWindow(!isWindow)
    }

    const {name, price, owner, description, images} = responseQuery.data;

    return (
        <>
            <div className=" grid grid-cols-8 transition-opacity duration-200 delay-100 animate-appear ease-in  sm:grid-rows-8 md:grid-rows-6 sm:gap-0 md:gap-3 bg-white sm:w-full  md:w-11/12 h-auto mx-auto sm:my-0 md:my-10 mainItemShowCase" >
                <div className=" bg-white sm:col-start-1 sm:col-end-3 sm:row-end-3 sm:row-start-1 md:row-start-1 md:row-end-4 md:col-end-2 grid grid-cols-6 gap-2 sm:grid-rows-3 md:grid-rows-6">
                    <DeployMiniGallery imgArr={[images]}/>
                </div>
            <div className="  md:bg-cover md:max-h-[500px] sm:bg-contain sm:bg-no-repeat row-start-1 sm:col-end-9 sm:col-start-3 md:col-start-2 row-end-3 md:col-end-5 rounded-lg">
                <img onClick={(e) => setZoom(!zoom)} className="h-full w-full " style={{objectFit: (zoom)? 'contain' :'cover'}} onError={(e)=> e.target.src = '../images/Fn_iGOeWQAMrhxg.jpg'} src={ (images === null)?'../images/Fn_iGOeWQAMrhxg.jpg': (images.includes('https'))?images: `${import.meta.env.VITE_AWS_BUCKET}${images}`} ></img>
            </div>
            {isWindow ? <ExchangeWindow isPhone={isPhone} otheruser={owner} setWindow={setIsWindow}/> : null}
            
            <div className=" grid grid-cols-8 md:max-h-[500px] grid-rows-4 md:gap-3 sm:gap-7 bg-white sm:row-start-3 sm:col-start-1 sm:row-end-9 sm:col-end-9 md:row-start-1 md:row-end-3 md:col-start-5 md:col-end-9 md:py-0 sm:py-0 text-left ">
                <h1 className=" md:text-4xl sm:text-xl sm:h-[60px]  row-start-1 md:row-end-2 sm:row-end-3 md:col-start-2 md:col-end-8 sm:col-end-9 sm:col-start-2  md:h-10 ">{name}</h1>
                <h2 className=" md:text-2xl sm:text-lg  md:row-start-2 sm:row-start-2 col-start-2 col-end-7">Price Tag: £{price}</h2>
                {(user.user_id === owner)? <button disabled={deleteItem.isLoading || responseQuery.data.quantity === '0'} onClick={() => deleteItem.mutate()} className={`${(responseQuery.data.quantity === '0')? 'opacity-60':null}  bg-red-400 text-xl text-white sm:w-auto md:col-start-4 md:col-end-6 md:row-start-3 md:w-18 md:h-12 sm:h-8 sm:col-start-2 sm:col-end-5 md:mb-0 sm:mb-10  rounded-lg hover:scale-105 hover:shadow-md duration-200`}>Delete Item</button>
        : null }
                <h2 className=" text-md  row-start-3 col-start-2 col-end-4">Owner: <Link to={`/user/${responseQuery?.data?.owner}`}> <span className="text-white  bg-orange-700 p-1 rounded-xl text-lg font-bold font-sans">{userQuery?.data?.username}</span> </Link> </h2>
                <button onClick={deployExchange} className="bg-green-500 md:h-[100px] text-2xl text-white row-start-4 col-start-2 md:col-end-6 sm:col-end-8 rounded-lg hover:scale-105 hover:shadow-md duration-200">Offer Trade</button>
            </div>
            <div className=" w-full h-20"></div>
            

            <div className="w-[100%] sm:hidden md:block md:row-start-3 md:row-end-7 md:col-start-1 md:col-end-9  md:row-end px-20 py-5 m-1">
                {responseQuery?.data?.description || "No Description"}
            </div>

            </div>
            <div className="w-[100%] md:hidden sm:block px-10 py-5 m-1">
                {responseQuery?.data?.description || "No Description"}
            </div>
            
        </>
    )
    }
}