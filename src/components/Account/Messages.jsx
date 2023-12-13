import { Chat } from "./Chat"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faReply } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { MessageSent } from "./MessageSent";
import { UseItemsStore } from "../store/store";
import { getQueryFnWithAuth } from "../../extras/extras";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader } from "./Loader";

export const Messages = () => {

    const [openMessages, setOpenMessages] = useState(false);
    const [message, setMessage] = useState('');

    const [selectedMessage, setSelectedMessage] = useState(null);

    const token = UseItemsStore(state => state.token);
    const csrf = UseItemsStore(state => state.csrf);
    const setCsrf = UseItemsStore(state => state.setCsrf);
    const setLogout = UseItemsStore(state => state.setLogout);
    const user = UseItemsStore(state => state.user);

    const [firstSelect, setFirstSelect] = useState(null);


    const navigate = useNavigate();

    const dealsData = useQuery({
        queryKey: ["sealedDeals"],
        queryFn: getQueryFnWithAuth(token, csrf, "/item/getDealsSealedNoItems",null ,null ,null ),
        onSuccess:(res) =>{
            (firstSelect === null && res.length > 0)? setSelectedMessage(res[0].id): null;
        },
        onError:() => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        }
    })

    const messagesData = useQuery({
        queryKey: ["dealMessages", selectedMessage],
        enabled: selectedMessage !== null,
        queryFn: getQueryFnWithAuth(token, csrf, `/item/messages/${selectedMessage}`,null ,null ,null ),
        onSuccess:(res) =>{
            document.getElementById('messages-box').scrollTo({top: 5000,
                left: 0,
                behavior: "smooth",});
        },
        onError:() => {
            setLogout({username:'guest', user_id: null}, null ,null);
            navigate('/login');
        }
    })

    const successCb = (data) => {
        setCsrf(data.csrf)
    }

    const errorCb = async (data) => {
        if(data.csrf){
            setCsrf(data.csrf);
        }else{
            setLogout();
        }
    }

    const mutateMessage = useMutation({
        mutationKey: ['sendMessage'],
        mutationFn: async () => {
            const res = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/postMessage/${selectedMessage}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                    Csrf: csrf
                },
                body: JSON.stringify({
                    message: message 
                })
            })
            
            if(!res.ok){
                throw new Error("error")    
            }
            const json = await res.json();

            return json;
        },
        onSuccess: (data) => {
            if(data.status === 200){
                successCb(data);
            }else{
                errorCb(data);
            }
        }
    })


    const toggleMessages = () => {
        setOpenMessages(!openMessages);
    }

    const writeMessage = (e) => {
        setMessage(e.target.value);
    }

    const sendMessage = (e) => {
        e.preventDefault();

        mutateMessage.mutate();

        setMessage('');
        messagesData.refetch();
    }

    function beforeSetSelected(num) {
        
        setSelectedMessage(num);
        toggleMessages();
    }

    return(
        <>
            <h2 className="text-lg w-[100%] h-12 text-center py-2">Messages</h2>
            <div className="sm:w-[100%] md:w-[900px] flex relative overflow-hidden bg-slate-100 max-h-[70vh] min-h-[200px]">
                <div className={`${(openMessages)?'sm:w-[160px]': 'sm:w-[0px]'} md:w-[180px]  relative z-30 duration-300 transition-all`}>
                    <div className={`md:hidden absolute right-[-30px] rounded-r-xl top-[142px] w-[30px] bg-black h-[100px] flex items-center justify-center`}>
                        <FontAwesomeIcon onClick={toggleMessages} className={`${(openMessages)? 'rotate-0': 'rotate-180'} duration-500 transition-all  text-white pl-[1px]`} size="2x" icon={faCaretLeft}/>
                    </div>
                    <div className="sm:w-[100%]  relative flex flex-wrap extended-message-window">
                        {(dealsData.isLoading)? <Loader  />  :null }
                        { (dealsData.isSuccess)? dealsData.data.map((ele, indx) => <Chat otherUser={(user.username == ele.acc_id1)? ele.acc_id2: ele.acc_id1} expire={ele.expire} date={ele.date} isSelected={selectedMessage} data={ele} setSelected={beforeSetSelected} key={indx} /> ):null }
                    </div>
                </div>
                {(messagesData.isLoading)? <div className="w-[100%] h-[300px] flex justify-center items-center"> <Loader/></div>:null}
                <div onClick={toggleMessages} className={`${(openMessages)?'block  sm:bg-opacity-30': 'hidden sm:bg-opacity-0'} absolute h-[100%] z-20 sm:bg-black md:bg-transparent w-[100%] transition-all duration-300 `}></div>
                <div className="w-[100%]">
                    <div id="messages-box" className={`${(openMessages)?'sm:blur-[1px] sm:pl-0': 'sm:blur-none sm:pl-[34px]'} md:pl-0 md:blur-none w-[100%] sm:max-h-[100%] md:max-h-[100%] overflow-y-scroll overflow-x-hidden transition-all duration-300 bg-white border border-gray-200 rounded-3xl`}>
                        
                        {(messagesData.isSuccess)?(messagesData.data?.messages?.length > 0)?messagesData.data.messages.map((ele, indx) => <MessageSent own={(messagesData.data[ele.sender] == user.username)? true: false } from={messagesData.data[ele.sender]} message={ele.message} date={ele.date}  key={indx} />):<p className=" text-center">No messages yet</p> :null}
                        <div id="messages-end" className="h-[70px]"></div>
                    </div>

                    <div className=" h-[50px] absolute bottom-3 rounded-xl right-5 border border-gray-200 shadow-sm focus:outline-none bg-white w-[330px] p-1 ">
                        <form onSubmit={sendMessage} className="h-[100%] w-[100%]">
                            <input value={message}  onChange={writeMessage} placeholder="Send Message" className=" px-2 h-[100%] w-[100%]" type="text"></input>
                            <button className="absolute bottom-[3px] right-1 border border-gray-200 shadow-md rounded-full h-[44px] w-[44px]">
                                <FontAwesomeIcon onClick={sendMessage} className={` duration-500 transition-all pl-[1px]`} size="2x" icon={faReply}/>
                            </button>
                        </form>
                    </div>
                    
                </div>

            </div>
        </>
    )

}