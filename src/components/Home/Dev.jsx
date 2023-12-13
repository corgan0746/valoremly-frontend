import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { UseItemsStore } from "../store/store";

export const Dev = () => {

    const [query, setQuery] = useState('');
    const token = UseItemsStore(state => state.token);


    const queryData = useMutation({
        mutationFn: async () => {
                
            let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/devIn`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    query1: query
                })
            })
            let json = await response.json();

            if(!response.ok){
                throw new Error(json.message);
            }

            return json;
        },

    })

    return(
        <>
            <div className=" w-full h-12 bg-white flex flex-wrap">
                <input className=" md:w-11/12 sm:w-3/4 h-full bg-white border border-gray-200 rounded-lg p-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a query..."></input>
                <button onClick={() => queryData.mutate()} disabled={queryData.isLoading} className=" md:w-1/12 sm:w-1/4 h-full bg-blue-500 text-white rounded-lg p-2">Send</button>
            </div>
            <h1>Result</h1>
            <div className="w-full p-2 border border-gray-200">
                {(queryData.isSuccess)? JSON.stringify(queryData.data?.data): null}
                {(queryData.isError)? queryData.error.message:null}
            </div>
        </>
    )
}