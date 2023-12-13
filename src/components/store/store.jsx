import { create } from 'zustand';


export const UseItemsStore = create(set => ({
    search: '',
    currentPage:0,
    total:0,
    isSearch: false,
    items: [],
    token: null,
    csrf:null,
    user: {username:'guest', user_id: null}, //'guest'
    myItems: [],
    otherUserItems: [],
    myExchangeItems: [],
    otherUserExchangeItems: [],
    setLogout: (user, token, csrf) =>{set({user, token, csrf})},
    setToken: (token) => { set({token})},
    setCsrf: (csrf) => {set({csrf})},
    setUser: (user) => { set({user})},
    setItems: (items) => { set({items})},
    setSearch: (search) => { set({search})},
    setTotal: (total) => { set({total})},
    setCurrentPage: (currentPage) => { set({currentPage})},
    setIsSearch: (isSearch) => { set({isSearch})},
    setMyItems: (myItems) => { set({myItems}) },
    setOtherUserItems: (otherUserItems) => { set({otherUserItems}) },
    setMyExchangeItems: (myExchangeItems) => { set({myExchangeItems})},
    setOtherUserExchangeItems: (otherUserExchangeItems) => { set({otherUserExchangeItems}) }, 
}))

