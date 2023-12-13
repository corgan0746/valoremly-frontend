import { UseItemsStore } from "../store/store";

export const Brief = () => {

    const user = UseItemsStore( state => state.user);

    return( 
        <div className=" p-16">
            <h1 className=" text-2xl">Hi, {user.username}</h1>
            <br></br>
            <h2 className=" text-lg pl-10">email: {user.email}</h2>
        </div>
            )
}