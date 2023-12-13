export const DeployMiniGallery = ({imgArr}) => {

    return(
        imgArr.map((img, indx) => 
            <div key={indx} className={`bg-gray-300  row-start-${indx} sm:col-start-1 sm:col-end-9  md:col-start-3  md:col-end-6 hover:scale-105 hover:duration-200`}>
                <img className="h-full w-full " style={{objectFit: 'cover'}} onError={(e)=> e.target.src = '../images/Fn_iGOeWQAMrhxg.jpg'} src={ (img === null)?'../images/Fn_iGOeWQAMrhxg.jpg': (img.includes('https'))?img: `${import.meta.env.VITE_AWS_BUCKET}${img}`}></img>
            </div>
        )
    )
}