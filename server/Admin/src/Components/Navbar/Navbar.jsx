import React from 'react'
import logo from '../../assets/nav-logo.svg'
import profile from '../../../public/profile.jpg'

const Navbar = () => {
  return (
    <div>
      <div className="navbar flex justify-between items-center mx-2 my-2 m-2 p-1 bg-gray-100">
            <img src={logo} alt="logo-image" />
            <img src={profile} alt="profile"  className='h-[3rem] w-[3rem] rounded-[50%]'/>
      </div>
    </div>
  )
}

export default Navbar