
import './NavBar.css';
import { Link } from 'react-router-dom';
import { UseItemsStore } from '../store/store.jsx';

export const NavBar = () => {

    const setSearch = UseItemsStore(state => state.setSearch);
    const setIsSearch = UseItemsStore(state => state.setIsSearch);
    const setCurrentPage = UseItemsStore(state => state.setCurrentPage);
    const user = UseItemsStore(state => state.user);

    const clearSearch = () => {
        setSearch('');
        setIsSearch(false);
        setCurrentPage(0);
    }


    return (
        <>
        <div className=" md:h-10 w-[100%] flex my-1">
            <div className=" md:w-[50%] h-full item-center "></div>
            <div className=" md:w-[50%] sm:w-full h-full  ">
                    <div className='flex justify-center items-center h-[100%] w-[100%]'>

                        <div onClick={ clearSearch } className='navItem cursor-pointer hover:shadow-md'>All Categories</div>
                        
                        <div className={`${(user.username !== 'guest')?'hidden':'inline-block'} line1`}></div>
                        
                        <div className={`${(user.username !== 'guest')?'hidden':'inline-block'} w-18`}>
                            <Link to={(user.username !== 'guest')? '/account' :'/signup'}>
                                <li className='navItem hover:shadow-md' >Sing Up</li>
                            </Link>
                        </div>                

                        <div className='line1' ></div>
                        
                        <Link to={(user.username !== 'guest')? '/account' : '/login'}>
                            <li  className='navItem hover:shadow-md' >{(user.username === 'guest')?'Login':'Account'}</li>
                        </Link>

                    </div>
                
            </div>

        </div>
        <div className='line2'></div>
        </>
    )


}
