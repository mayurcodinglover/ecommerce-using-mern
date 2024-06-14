import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes ,Route} from 'react-router-dom'
import Addproduct from '../../Components/AddProduct/Addproduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import Adminorder from '../../Components/Adminorder/Adminorder'


const Admin = () => {
  return (
    <div>
      <div className="admin flex">
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<Addproduct/>}></Route>
        <Route path='/listproducts' element={<ListProduct/>}></Route>
        <Route path='/orders' element={<Adminorder/>}></Route>
      </Routes>
      </div>
      
    </div>
  )
}

export default Admin
