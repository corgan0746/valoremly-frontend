import './HomeBanner.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UseItemsStore } from '../store/store.jsx'
import { useState, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NotificationList } from '../Items/NotificationList.jsx';
import { Loader } from '../Account/Loader.jsx';

export const HomeBanner = () => {

    const setIsSearch = UseItemsStore(state => state.setIsSearch);

    const location = useLocation();

    const user = UseItemsStore(state => state.user);
    const setSearch = UseItemsStore(state => state.setSearch);
    const setTotal = UseItemsStore(state => state.setTotal);
    const setCurrentPage = UseItemsStore(state => state.setCurrentPage);
    const setItems = UseItemsStore(state => state.setItems);
    const token = UseItemsStore(state => state.token);
    const csrf = UseItemsStore(state => state.csrf);
    const setLogout = UseItemsStore(state => state.setLogout);
    const navigate = useNavigate();

    const [wasSeen, setWasSeen] = useState(null);

    useLayoutEffect(() => {

        if(location.search.includes('?token=')){

            const verification = location.search.replace('?token=', '');
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/verify?token=${verification}`

        }
    });

    const [openNotifications, setOpenNotifications] = useState(false);

    const [search2, setSearch2] = useState(''); 

    const queryData = useQuery({
        refetchOnWindowFocus:false,
        retry:false,
        queryKey: ['allNotifications', wasSeen],
        queryFn: async () => {
             let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/notifications${(wasSeen)?'?seen=true':''}` , { headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                Csrf: csrf
            }})
            
            if(!response.ok){
                throw new Error("err");
            }

            let notifications = await response.json();

            return notifications;
        },
        onError:()=>{
            setLogout({username:'guest', user_id: null}, null ,null);
        }
    })

    const messagesQuery = useQuery({
        refetchOnWindowFocus:false,
        retry:false,
        queryKey: ['messagesCount'],
        queryFn: async () => {
             let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/messagesByAccount` , { headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                Csrf: csrf
            }})
            
            if(!response.ok){
                throw new Error("err");
            }

            let messages = await response.json();

            return messages;

        },
        onError:()=>{
            setLogout({username:'guest', user_id: null}, null ,null);
        }
    })

    let searchQuery = useMutation({
        mutationFn: async () => {
            setSearch(search2);
            setIsSearch(true);
            setCurrentPage(0);
            let info = await (await fetch(`${ (import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/search/${search2}`  , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
             })).json();
            setTotal(info.total);
            setItems(info.data);
            return info;
        }
    })

    const openNotificationsFn = () => {
        setOpenNotifications(!openNotifications);
        setWasSeen(true);
    }

    const goMessages = () => {
        navigate('/account?messages')
    }

    const stopProp = (e) => {
        e.stopPropagation();
    }

    return(
        <>
        <div className="banner h-28 w-full flex">
            <div className=" md:w-6/12 sm:w-[50%] h-full sm:flex-wrap md:flex-nowrap flex item-center">
                <div className=' bg-white sm:w-20  md:h-3/5 sm:h-1/2 md:w-[148px] md:min-w-[148px] sm:min-w-[124px] sm:mx-auto md:mx-5 my-auto' style={{}}>
                    <Link to='/'>
                  <div className='h-full w-full block '>
                    <img style={{objectFit: 'contain'}} className='md:w-full h-full' src="../images/8117854737_20097ba3-f8bb-4c95-91a6-d7217d175962.png"></img>
                  </div>
                  </Link>
                </div>
                <div className='relative bg-white md:h-3/5 sm:h-1-2 w-3/4 mx-auto md:block xs:hidden md:pointer-events-auto sm:hidden sm:pointer-events-none   my-auto'>
                    <input onChange={(e) => setSearch2(e.target.value) } value={search2} className=' absolute md:px-4 text-lg w-full h-full z-2 xl:px-16'></input>
                    <div className=' absolute top-[21%] rounded-md right-5 h-10 w-16 bg-white shadow-sm shadow-gray-400 border hover:animate-pulse border-gray-200'>
                        <button onClick={() => searchQuery.mutate()} className={`h-full w-full rounded-full`}>Search</button>
                    </div>
                </div>
            </div>
            
            
           
            
                <div className=' h-[100%] flex sm:w-[50%] sm:justify-center md:justify-end md:px-14 sm:px-4 items-center flex-nowrap gap-4'>

                    <div className={`${(user.username === 'guest')? 'hidden':'inline-block'} w-[35px] h-[37px] relative -top-0.5 `}>
                        {(messagesQuery.isSuccess && messagesQuery.data.length > 0)? <div className='absolute pointer-events-none scale-[0.85] bottom-[-5px] right-[-7px] h-[24px] w-[24px] z-10 text-center text-white font-semibold rounded-full bg-red-700'>{messagesQuery.data.length}</div>:null}
                        <div onClick={goMessages} className='smooth-color-swap text-center flex justify-center items-center h-10 w-10 '>
                            <FontAwesomeIcon className='text-white p-1   hover:text-fuchsia-900 transition-all duration-1000 relative   cursor-pointer' icon={faEnvelope} size='2x' />
                        </div>
                    </div>

                    
                    <div className={`${(user.username === 'guest')? 'hidden':'inline-block'}  h-[40px] w-[45px] text-center cursor-pointer relative   z-2`} onClick={openNotificationsFn} >
                        {(queryData.isSuccess && queryData.data.length > 0)? <div className='absolute pointer-events-none scale-[0.85] bottom-[-2px] right-[-2px] h-[24px] w-[24px] z-10 text-center text-white font-semibold rounded-full bg-red-700'>{queryData.data.length}</div>:null}
                        <div className='smooth-color-swap flex justify-center items-center  h-10 w-10'>
                            <FontAwesomeIcon icon={faBell} size='2x' className='text-white p-1 hover:text-fuchsia-900 transition-all duration-1000  relative cursor-pointer' />
                        </div>
                    </div>

                    <div className=' relative bg-transparent rounded-full sm:w-18 h-[60px] translate-y-2 '>
                        <Link className=' h-20' to={(user.username !== 'guest' )? '/account' : '/login'}>
                            <div className='text-center'>
                                <FontAwesomeIcon className='text-white' size='2x' icon={faUser} />
                            </div>
                            <h3 className='relative -translate-y-1.5 text-md text-center h-6 w-[100%] text-white' style={{pointerEvents: 'none'}} >{user.username.substring(0,9)}</h3>
                                
                        </Link>
                    </div>
                </div>
            
           
            
        </div>
            <div className={`md:hidden sm:block relative my-2 w-full h-10 bg-white `}>
                <div className='relative bg-white h-[90%]  w-2/4 mx-auto rounded-full shadow-md shadow-gray-300'>
                    <input onChange={(e) => setSearch2(e.target.value) } placeholder='Search' className=' placeholder:text-gray-300 light-focus-outline rounded-full absolute text-lg w-full h-full z-2 px-4 shadow-sm shadow-gray-300'></input>
                </div>
                <div className=' absolute top-[-2px] rounded-full right-7 h-10 w-14 bg-white shadow-sm shadow-gray-400 border border-gray-200'>
                    <button onClick={() => searchQuery.mutate()} className={`h-full w-full rounded-full`}>Search</button>
                </div>
            </div>

        <div className={`${(openNotifications)? 'block':'hidden'} animate-appear background-overlay-notifications transition-opacity duration-300 `} onClick={openNotificationsFn}>
            <div className={`${(openNotifications)? 'block':'hidden'} sm:w-[300px] md:w-[600px] bg-slate-50 center-notification-window rounded-lg fixed top-[85px] shadow-xl z-50`} onClick={stopProp} >
                <div className='h-10 w-[100%]  bg-fuchsia-900 sticky top-0 right-0 rounded-t-md'>
                    <h2 className='h-[100%] left-4 absolute text-white text-right font-bold w-24 pt-1'>Notifications</h2>
                    <div className='flex justify-end p-2'><button onClick={openNotificationsFn} className='px-1 w-20 shadow-sm bg-white rounded-lg'>Close</button></div>
                </div>
                <div className='flex w-[100%] h-auto flex-wrap overflow-x-hidden overflow-y-hidden'>

                {(queryData.isError)?<></>:null}

                {(queryData.isLoading)?(<Loader/>):null}

                {(queryData.isSuccess)? <NotificationList notifications={queryData.data} closeNotifications={openNotificationsFn}  /> :null}

                </div>
            </div>
        </div>

        </>
    )
}