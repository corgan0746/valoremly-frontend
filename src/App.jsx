
import './App.css'
import {HomeBanner} from './components/Home/HomeBanner.jsx';
import {NavBar} from './components/Home/NavBar.jsx';
import {ItemList} from './components/Items/ItemsList';
import { ItemListingShowcase } from './components/Items/ItemListingShowcase';
import { MainContent } from './components/Account/MainContent';
import { Route, Routes } from 'react-router-dom';
import { SignUp } from './components/Account/SignUp';
import { CreatePassword } from './components/Account/CreatePassword';
import { Login } from './components/Account/Login';
import { Dev } from './components/Home/Dev';
import { UserItems } from './components/Items/UserItems';
import { Pagination } from './components/Items/Pagination.jsx';
import { AboutPage } from './components/Items/AboutPage.jsx';
import { AboutInformation } from './components/Items/AboutInformation.jsx';

function App() {

  return (
    <div className="App h-[100vh] w-[100%]">
      <Routes>
        <Route path="/" element={<> <HomeBanner /> <NavBar/> <ItemList /> < AboutPage/> <Pagination/> </>}/>
        <Route path="/item/:id" element={<> <HomeBanner /> <NavBar/> <ItemListingShowcase/></>}/>
        <Route path="/user/:id" element={<> <HomeBanner /> <NavBar/> <UserItems /> </>}/>
        <Route path="/dev" element={<Dev/>}/>
        <Route path="/account" element={ <MainContent/>} /> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/> 
        <Route path="/signup/createpassword" element={<CreatePassword/>}/>
        <Route path='/about' element={<> <HomeBanner /> <NavBar/> <AboutInformation/></>} />
        <Route path="*" element={<> <HomeBanner /> <NavBar/> <ItemList /> </>}/>
      </Routes>
    </div>
  )
}
export default App