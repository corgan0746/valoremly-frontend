import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { useState } from "react";


export const Login = () => {

    const navigate = useNavigate();

    const setUser = UseItemsStore((state) => state.setUser);
    const setToken = UseItemsStore((state) => state.setToken);
    const setCsrf = UseItemsStore((state) => state.setCsrf);

    const [username, setUsername] = useState('miuser3');
    const [password, setPassword] = useState('miuser3');

    const [wasError, setWasError] = useState(false);
    const [errMessage, setErrMessage] = useState('')


    const login = useMutation({
        
        mutationFn: async () => {
            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL }/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            let json = await response.json();


            if(!response.ok){
                throw new Error(json.message);
            }

            return json;
        },
        onSuccess: (data) => {
            setUser({username: data.username, user_id: data.user_id, email: data.email.email});
            (data?.token)? setToken('Bearer ' + data.token): console.log('no token');
            (data?.csrf)? setCsrf(data.csrf): console.log('no csrf');
            navigate('/');
        },
        onError: async (err) => {
            setWasError(true);
            setErrMessage(err.message);
            const prom = new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    setWasError(false);
                    clearTimeout(timeout);
                    resolve(true);
                }, 5000)
            });
            
            const resolveProm = await prom;
    
            return resolveProm;
        }
    })

    return (
        <div className="h-[100%] w-full relative">
            {(wasError)? 
            
            <div className={`  transition-opacity bg-gray-600 p-6 sm:h-[100px] md:h-[200px] pointer-events-none opacity-100 z-10  sm:w-[100%] md:w-[400px] error-login `}>
                <h2 className=" h-6 md:py-12 sm:py-2 text-xl sm:h-full  text-center md:w-[100%] text-white">{errMessage}</h2>
            </div>: null}
            <div className=" sm:block md:hidden pt-10 h-32 bg-white "><Link to='/' > <img className=' w-auto mx-auto h-full' src="../images/8117854737_20097ba3-f8bb-4c95-91a6-d7217d175962.png"></img></Link> </div>
            
            <div className=" bg-black sm:hidden md:inline-block w-1/2 h-full">
                <div className=' w-36 bg-white mx-auto mt-16 '>
                    <Link to='/'>
                        <img className='w-full h-full' src="../images/8117854737_20097ba3-f8bb-4c95-91a6-d7217d175962.png" ></img>
                    </Link>
                </div>
                <div className=" md:h-[250px] lg:h-[400px] md:w-[200px] lg:w-[300px] mx-auto rounded-xl bg-white mt-32 ">
                    <h1 className=" font-sans sm:text-lg md:text-xl lg:text-3xl md:p-6 lg:p-16 font-semibold " style={{fontFamily:'barlow'}}>Convert a value into something much more valuable in this very moment.</h1>
                </div>
            </div>
            <div className=" bg-white  md:fixed sm:static sm:w-full md:w-1/2 h-[auto] right-0 top-0">
                <div className="mx-auto sm:w-full md:w-[400px] md:h-1/3 sm:h-1/2 md:mt-72 sm:mt-10 md:p-6 sm:p-0 bg-white font-sans text-3xl flex flex-wrap ">
                    <h2 className=" w-[50%] text-3xl mx-auto py-4" style={{fontFamily:'roboto'}} >Login</h2>
                    <div className=" w-full">
                        <div className="w-[50%] mx-auto border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-2">
                            <input name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} id="username" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                        </div>
                        <div className="w-[50%] mx-auto border-gray-200 border-[1px] h-[40px] text-center rounded-lg ">
                            <input name="password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" id="password" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                        </div>
                    </div>
                    <div className=" w-[50%] h-16 sm:py-6 mx-auto ">
                        <button style={{fontFamily:'roboto'}} onClick={() =>  login.mutate()} className=" w-full h-12 bg-blue-500 text-white rounded-lg text-lg hover:scale-105 hover:shadow-md duration-200 ">Login</button>
                    </div>
                </div>
                <div className="h-14 md:w-1/2  py-4 mx-auto">
                    <div className="w-full h-full  rounded-lg text-center"><h1 style={{fontFamily:'roboto'}} className="py-3">Or</h1></div>
                </div>
                <div className="h-24 md:w-1/2 sm:w-full sm:px-0 sm:py-6 md:p-6 mx-auto">
                    <Link to='/signup'>
                        <div className="w-[50%] mx-auto h-full bg-purple-900 rounded-lg text-center text-white hover:scale-105 hover:shadow-md duration-200 "><h1 className="py-3">Register</h1></div>
                    </Link>
                </div>
                
            </div>
        
        </div>
    )



}