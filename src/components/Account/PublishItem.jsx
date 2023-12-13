import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UseItemsStore } from "../store/store";
import { postMutation } from "../../extras/extras";
import Compressor from 'compressorjs';

export const PublishItem = ({setItemWindow, refreshItems}) => {

    const token = UseItemsStore( state => state.token);
    const csrf = UseItemsStore( state => state.csrf);
    const setCsrf = UseItemsStore( state => state.setCsrf);
    const setLogout = UseItemsStore( state => state.setLogout);
    
    const [Name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');

    const [wasSuccess, setWasSuccess] = useState(false);
    const [wasError, setWasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loadedImage, setLoadedImage] = useState(null);
    const [imageData, setImageData] = useState(null);

    const successCb = (data) => {
        setWasSuccess(true);
        setName('');
        setPrice('');
        setDescription('');
        setImage('');
        setCategory('');
        setCsrf(data.csrf)

        const timeout = setTimeout(() => {
            setWasSuccess(false);
            refreshItems();
            setItemWindow(false);
        }, 5000)

        return () => {
            clearTimeout(timeout);
        }
    }

    const temporaryError = async (messageString) => {
        setWasError(true);
        setErrorMessage(messageString);

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

    const errorCb = async (data) => {
        setWasError(true);
        if(data.csrf){
            setCsrf(data.csrf);
            setErrorMessage(data.message);
        }else{
            setLogout();
        }

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

    const closeWindow = () => {
        setItemWindow(false);
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    const publishITem = useMutation({
        mutationKey: ['publishItem'],
        mutationFn: async () => {

            
            const formData = new FormData();
            formData.append('image', imageData);
            formData.append('name', Name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('category', category);

            const res = await fetch(`${(import.meta.env.DEV)? 'http://localhost:4002' : import.meta.env.VITE_BACKEND_URL}/item/addItem`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: token,
                    Csrf: csrf
                },
                body: formData
            })
            
            const json = await res.json();
            json.status = res.status;
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

    const changePicture = (e) => {
        if(!e.target?.files){
          return;
        }
        const photo = e.target['files'][0];


        if(photo.type == 'image/png' || photo.type == 'image/jpeg' ){

            let imgBitmap = createImageBitmap(photo).then( async (img) => {

                let convertedImg = convertImage(img);

                const blobConverted = await (await fetch(convertedImg)).blob();

                const fileName = 'converted-image';
                const fileType = 'image/webp'; 
                const convertedFile = new File([blobConverted], fileName, { type: fileType });

                setImageData(convertedFile);
                setLoadedImage(convertedImg);

            })

        }else if(photo.type == 'image/webp'){

        
            new Compressor(e.target['files'][0], {
                quality: 0.2, success(result) {
                    setImageData(result);
                }, error(err){
                    console.log("error on conversion:", err);
                    return;
                }
            });
        


        const file = new FileReader();

        file.onloadend = async () => {
            const arrayBufferResult = file.result;

            let intoBlob = new Blob([arrayBufferResult], {type: "image/webp"});
            let realBlob = URL.createObjectURL(intoBlob);

            setLoadedImage(realBlob);
        }
        file.readAsArrayBuffer(photo);
        }else{
            temporaryError("Image File not compatible")
        }

      }

      function convertImage(pngImage){

        let canvas = document.getElementById('temp-canvas');
        let ctx = canvas.getContext('2d');

        canvas.width = pngImage.width;
        canvas.height = pngImage.height;

        ctx.drawImage(pngImage, 0, 0);

        const dataUrl = canvas.toDataURL(`image/webp`, 0.2);

        return dataUrl;

      }


    return (<>
        <div onClick={closeWindow} className="sm:fixed md:fixed left-0 z-40 overlay-publish md:w-[100%]  sm:h-[100vh] sm:w-[100vw] sm:top-0 ">
            
                {(wasError)? 
                <div className={` ${(wasError)?'block':'hidden' } text-center transition-opacity bg-gray-600 fixed z-[65] p-6 center-temporary-message sm:h-1/8 md:h-[100px] top-[20vh] pointer-events-none sm:w-[100%] md:w-[350px] `}>
                    <h2 className=" h-6 p-2 ml-auto text-xl mx-auto text-white">{errorMessage}</h2>
                </div> : null }

                {(publishITem.isSuccess && wasSuccess)?
                <div className={`${(wasSuccess)?'block':'hidden' } text-center transition-opacity bg-green-600 z-[65] p-6 center-temporary-message fixed sm:h-1/8 md:h-[100px] pointer-events-none  sm:w-[100%] md:w-[350px] top-[20vh]`}>
                    <h2 className=" h-6 p-2 ml-auto text-xl mx-auto text-white">Item published!</h2>
                </div> : null}
            
        <div className="md:w-96 sm:w-[100%] bg-white relative center-publish-item md:top-28 sm:top-3 rounded-lg" onClick={stopPropagation} >

            <div className={`sm:hidden md:block absolute top-[-20px] right-[-20px] h-12 w-12 bg-transparent  z-[60] `}>
                <button onClick={() => setItemWindow(false)} className=" bg-red-500 h-12 w-12 sm:absolute md:absolute rounded-3xl text-center text-white font-semibold z-[61]">X</button>
            </div>
            
                <div className="px-8 font-sans text-3xl flex flex-wrap ">
                    <h1 className="w-full text-center p-2" style={{fontFamily:'roboto'}} >Add Item</h1>
                    <div className="w-[100%] border-gray-200 border-[1px] h-[40px]  text-center rounded-lg my-4">
                    
                    <input name="name" placeholder="Item Name" value={Name} onChange={(e) => setName(e.target.value)}  className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                    </div>
                    <div className="w-[100%] border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-4">
                    <input name="price"  value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                    </div>
                    <div className="w-[100%] border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-4">
                    <input name="category"  value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category"  className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                    </div>
                    <div className="w-[100%] border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-4">
                    <input name="description"  value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"  className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                    </div>
                    <div className="w-[45%] border-gray-200 border-[1px] h-[40px] text-center rounded-lg my-4">
                       <input name="imageUpload" type="file" onChange={changePicture} placeholder="Image URL"  className=" placeholder:text-gray-500 text-lg w-full  inline-block p-2 bg-transparent -translate-y-1  h-full " ></input>
                        <canvas id="temp-canvas" className="hidden" />
                    </div>
                    {(loadedImage)?
                        <div className="w-[100px] h-[100px] overflow-hidden">
                            <img className="w-[100%] h-[100%]" src={loadedImage}></img>
                        </div>
                        :null
                    }
                    </div>
                    <div className="w-[100%] px-14 py-4">

                        <button style={{fontFamily:'roboto'}} onClick={closeWindow} className=" w-[27%] h-12 bg-gray-500 text-white rounded-lg text-lg hover:scale-105 hover:shadow-md duration-200 mr-3 ">Cancel</button>
                        <button disabled={ publishITem.isLoading || wasSuccess} style={{fontFamily:'roboto'}} onClick={() =>  publishITem.mutate()} className={` ${(publishITem.isLoading || wasSuccess)? 'bg-blue-200 opacity-40' :null} w-[65%] h-12 bg-blue-500 text-white rounded-lg text-lg hover:scale-105 hover:shadow-md duration-200 `}>Publish Item</button>
                    </div>
                </div>
        </div>
        </>
    )

}