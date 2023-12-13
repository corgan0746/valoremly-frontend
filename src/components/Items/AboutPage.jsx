import { useNavigate } from "react-router-dom"



export const AboutPage = () => {

    const navigate = useNavigate();

    const clicked = () => {
        navigate('/about');
    }

    return (
        <>
        
            <div onClick={clicked} className="w-[100%] pt-2 flex justify-center items-center">
                <div className="w-[300px] rounded-xl bg-gradient-to-tr from-violet-900 to-fuchsia-900 text-white h-[50px] flex items-center justify-center duration-500 hover:bg-gradient-to-br cursor-pointer ">
                    <h1 className="font-nice text-center">About This Project</h1>
                </div>
            </div>

        </>
    )


}