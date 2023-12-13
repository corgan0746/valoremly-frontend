import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UseItemsStore } from "../store/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export const SignUp = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [registerB, setRegisterB]= useState(true);

    const [wasError, setWasError] = useState(false);
    const [passwordError, setPasswordError] = useState(false );


    const errorTimer = async () => {
        setWasError(true);
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

    const errorTimer2 = async () => {
        setPasswordError(true);
        const prom = new Promise((resolve) => {
            const timeout = setTimeout(() => {
                setPasswordError(false);
                clearTimeout(timeout);
                resolve(true);
            }, 5000)
        });
        
        const resolveProm = await prom;

        return resolveProm;
    }


        const preRegister = useMutation({
              mutationKey: 'preRegister',
              retry: false,
              mutationFn: async () => {
            let response =  await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/preregister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                })
            });
            let json = await response.json();

            if(!response.ok){
                throw new Error(json.message);
            }
            setRegisterB(false);

            return json;
            
        },
            onError:(err) => {
                errorTimer();
            }
    
    })


        const register = useMutation({
            mutationKey: 'register',
            retry: false,
            mutationFn: async () => {

                if(password !== password2){
                    throw new Error('Passwords do not match');
                }
            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                })
            })
            let json =  await response.json();

            if(!response.ok){
                throw new Error(json.message);
            }
            setRegisterB(true);
            return json;
        },
        onSuccess: async (data) => {
            await new Promise(r => setTimeout(r, 4000));
            navigate('/');

        },
        onError: () => {
            errorTimer2();
        }       

})
       

    return (
        <div className="h-[100%] w-[100%] relative">
            {(wasError || passwordError )? 
            
            <div className={`transition-opacity bg-gray-600 p-6 sm:h-[100px] md:h-[200px] pointer-events-none opacity-100 z-10  sm:w-[100%] md:w-[400px] error-login `}>
            <h2 className=" h-6 md:py-12 sm:py-2 text-xl sm:h-full  text-center md:w-[100%] text-white">{preRegister?.error?.message || register?.error?.message}</h2>
        </div>: null}

        {(preRegister.isSuccess && registerB)?
            <div className={`  transition-opacity bg-green-600  absolute  md:grid-cols-2 p-6 w-full sm:h-1/8 md:h-1/4 pointer-events-none sm:grid-rows-4 md:grid-rows-2 sm:grid-cols-1 md:gap-0 sm:gap-6 opacity-100 z-10  sm:w-full md:w-2/3 sm:top-24 sm:left-0 md:top-1/4 md:left-80 `}>
            <h2 className=" h-6 p-2 row-start-1 col-start-1 ml-auto sm:-top-8 text-xl sm:h-full  mx-auto md:w-1/4 md:mt-24 text-white">Please check your email to verify the account</h2>
        </div>
        :null}
        
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
                <div className="mx-auto sm:w-[100%] md:w-[300px] md:h-1/3 sm:h-3/5 md:mt-72 sm:mt-32 p-6 bg-white font-sans text-3xl flex flex-wrap ">
                    <h1 className="w-full text-center" style={{fontFamily:'roboto'}} >Create Account</h1>
                    <div className=" w-full">

                    {(preRegister.isSuccess )?
                        <>
                        <div className="animate-appear transition-opacity  w-full border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-2">
                        <input name="password" type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  id="password1" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                        </div>
                        <div className="w-full border-gray-200 border-[1px] h-[40px] text-center rounded-lg ">
                        <input name="password2" type='password' placeholder="Retype-Password" value={password2} onChange={(e) => setPassword2(e.target.value)}  id="password2"  className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                        </div>
                        </>
                        
                        :<>
                            <div className="animate-appear transition-opacity  w-full border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-2">
                                <input name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}  id="username" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                            </div>
                            <div className="w-full border-gray-200 border-[1px] h-[40px] text-center rounded-lg ">
                                <input name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  id="email" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                            </div>
                        </>
                    }
                    </div>
                    <div className=" w-[100%] py-8 ">
                    {(preRegister.isSuccess )?
                        <button style={{fontFamily:'roboto'}} onClick={() => register.mutate()} disabled={registerB} className={`  w-full h-12 bg-blue-500 text-white rounded-lg text-lg hover:scale-105 hover:shadow-md duration-200 `}>Register</button>
                        :<button style={{fontFamily:'roboto'}} onClick={() => preRegister.mutate()} className=" w-[100%] h-12 bg-blue-500 text-white rounded-lg text-lg hover:scale-105 hover:shadow-md duration-200 ">Next</button>
                    }
                    </div>


                </div>
            </div>
        
        </div>
    )



}