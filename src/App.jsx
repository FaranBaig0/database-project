import { BrowserRouter, Routes,Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Contacts from "./components/Contacts"
import Footer from "./components/Footer"
import Users from "./components/Users"
import Register from "./components/Register"
import Login from "./components/Login"
import Update from "./components/Update"
import AddContact from "./components/AddContact"
import ShowContacts from "./components/ShowContacts"


import Chat from "./components/Chat";
import SendMessage from "./components/SendMessage";
import ChatWrapper from "./components/ChatWrapper"

import CreateGroup from "./components/CreateGroup"
import GroupMembers from "./components/GroupMembers"
import GroupChat from "./components/GroupChat"
import Groups from "./components/Groups"
import FriendRequests from "./components/FriendRequests"
import BlockUser from "./components/BlockUser"
import BlockedList from "./components/BlockedList"





function App() {
  
const isLoggedIn = !!localStorage.getItem("userId");  

  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Users/>} />
        <Route path="/users" element={ <Users/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/showContact" element={<ShowContacts/>} />
        <Route path="/sendMessage" element={<SendMessage/>} />
        
        <Route path="/home" element={ <> <Home/>  </>} />
        <Route path="/addContact" element={<AddContact />} />
        <Route path="/update/:User_ID" element={<Update />} />
        <Route path="/chat/:friendId"  element={<><ChatWrapper/></>} /> 
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId/members" element={<GroupMembers />} />
        <Route path="/groups/:groupId/chat" element={<GroupChat />} />
       <Route path="/add-contact" element={<AddContact />} />
        <Route path="/requests" element={<FriendRequests />} />
        <Route path="/blockuser" element={<BlockUser />} />
        <Route path="/blockedlist" element={<BlockedList />} />

         
        </Routes>
        <Footer/>
    </BrowserRouter>
      
    </>
  )
}

export default App
