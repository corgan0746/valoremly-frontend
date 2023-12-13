export const AboutInformation = () => {

    return (
        <>
            <div className="mx-auto xl:w-[1400px] md:w-[600px] lg:w-[1000px] sm:w-[350px] shadow-md p-5 text-white text-center font-nice mt-2 bg-gradient-to-tr from-black to-indigo-900 rounded-xl ">
                <h1 className="text-3xl mb-4">About This Website</h1>

                <div className="w-[100%] p-2 bg-white text-black rounded-xl">
                <p className="md:px-24 sm:px-2 text-lg py-1 my-2 sm:text-center md:text-left">
                    Welcome to our beta e-commerce platform! Please note that this website is for demonstration purposes only. We kindly request that you refrain from providing real information or engaging in real transactions. This platform serves as a display website where users can publish items. Additionally, users have the opportunity to propose exchanges of items with one another.
                </p>
                <br></br>
                <p className="md:px-24 sm:px-2 text-lg py-1 my-2 sm:text-center md:text-left">
                    To facilitate exchanges, agreeing parties can communicate through messages within a one-week time frame. After one week, the messages and the deal information are automatically deleted from our database.
                </p>

                <p className="md:px-24 sm:px-2 text-lg py-1 my-2 sm:text-center md:text-left">
                    Technical Details:
                    Our front-end is built on a React-vite project, incorporating Tailwind for component styling. State management is handled efficiently using Zustand and TanStack-Query. On the back-end, we employ a simple Node.js Express server connected to a serverless PostgreSQL on CockroachDB. User sessions are managed through JWT tokens, complemented by CSRF tokens stored on Node-cache. For image uploads, files are compressed, converted, and securely stored in an S3 bucket.
                </p>
                <p className="md:px-24 sm:px-2 text-lg py-1 my-2 sm:text-center md:text-left">
                    Thank you for exploring our beta platform. Enjoy your browsing experience, and feel free to engage in simulated exchanges with other users!
                </p>
                </div>
            </div>


        
        </>
    )

}