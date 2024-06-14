import React from "react";
import add from "../../assets/Product_Cart.svg";
import list from "../../assets/Product_list_icon.svg";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <div>
      <div className="operations m-2 p-2 bg-gray-100 h-[85vh]">
        <Link to="/addproduct" className="add-product flex items-center m-2 p-2 my-5 rounded-md bg-white">
          <img src={add} alt="" className="m-1 mx-2"/>
          <p>Add Product</p>
        </Link>
        <Link to="/listproducts" className="list-product flex items-center m-2 p-2 my-5 rounded-md bg-white">
          <img src={list} alt="" className="m-1 mx-2"/>
          <p>Show All Product</p>
        </Link>
        <Link to="/orders" className="list-product flex items-center m-2 p-2 my-5 rounded-md bg-white">
          <img src={list} alt="" className="m-1 mx-2"/>
          <p>Show All Orders</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
