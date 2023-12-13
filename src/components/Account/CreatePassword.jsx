

export const CreatePassword = () => {

    return (
        <div className="h-full w-full relative">
            <div className=" bg-black sm:hidden md:inline-block w-1/2 h-full">
                <div className=' w-36 bg-white mx-auto mt-16 '>
                    <img className='w-full h-full' src="../images/8117854737_20097ba3-f8bb-4c95-91a6-d7217d175962.png" ></img>
                </div>
                <div className=" h-2/5 mx-24 rounded-xl bg-white mt-32 ">
                    <h1 className=" font-sans text-3xl p-20 font-semibold " style={{fontFamily:'barlow'}}>Convert a value into something much more valuable in this very moment.</h1>
                </div>
            </div>
            <div className=" bg-white  md:fixed sm:static sm:w-full md:w-1/2 h-full right-0 top-0">
                <div className="mx-auto sm:w-full md:w-1/2 md:h-1/3 sm:h-3/5 md:mt-72 sm:mt-32 p-6 bg-white font-sans text-3xl flex flex-wrap ">
                    <h1 className="w-full text-center" style={{fontFamily:'roboto'}} >Create Account</h1>
                    <div className=" w-full">
                    <div className="w-full border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-2">
                    
                    <input name="password" placeholder="Password" id="password" type='password' className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                    </div>
                    <div className="w-full border-gray-200 border-[1px] h-[40px] text-center rounded-lg">
                    <input name="repassword" placeholder="Retype-Password" type='password' id="repassword" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                    </div>
                    </div>
                    <div className=" w-full ">
                        <button style={{fontFamily:'roboto'}} className=" w-full h-12 bg-blue-500 text-white rounded-lg text-lg hover:scale-105 hover:shadow-md duration-200 ">Create Account</button>
                    </div>


                </div>
            </div>
        
        </div>
    )



}