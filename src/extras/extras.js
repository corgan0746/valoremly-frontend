


export const postMutation = (token, csrf, remainUrl, body, callbackSuccess, callbackError) => {
    return {
        mutationFn: async () => {
            let response = await fetch(`${ (import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}${remainUrl}`  , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                    Csrf: csrf
                },
                body: JSON.stringify(
                    body
                )
            });
            
            let info = await response.json();

            if(!response.ok){
                throw new Error(JSON.stringify(info));
            }

            return info;
        },  
        onSuccess: (data) => {
            callbackSuccess(data);
        },
        onError: async (data) => {
            const errObj = JSON.parse(data);
            callbackError(errObj);
        }
    };

}

export const getQueryFn = (remainUrl, cb, param = null) => {

    return async () => {
        let response = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}${remainUrl}${(param)?param:''}`
        )
        let json = await response.json();
        cb(json);
        return json;
    }

}

export const getQueryFnWithAuth = (token, csrf, remainUrl, body=null, callbackSuccess, callbackError, param = null) => {

    return async () => {
        let info = await (await fetch(`${ (import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}${remainUrl}`  , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                    Csrf: csrf
                }
            })).json();
        
        return info;
    }

}