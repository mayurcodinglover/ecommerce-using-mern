import React from "react";
import remove from '../../assets/cross_icon.png'
import p1 from '../../assets/nav-profile.svg'
import { useState ,useEffect} from "react";

const ListProduct = () => {
  const [allproduct, setallproduct] = useState([])

  const fetchallproduct=async ()=>{
    await fetch("https://ecommerce-using-mern-0z75.onrender.com/allproducts").then((res)=>res.json()).then((data)=>setallproduct(data));
  }
  useEffect(() => {
    fetchallproduct();
  }, [])

  const removeProduct= async (id)=>{
    await fetch("https://ecommerce-using-mern-0z75.onrender.com/removeproduct",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:JSON.stringify({id:id})
    })
    await fetchallproduct();
  }
  
  
  return (
    <div>
      <div className="table-demo flex flex-col justify-center items-center bg-gray-100 m-1 p-1 ">
        <div className="heading grid grid-cols-7 m-2 p-2 w-[65rem] place-items-center">
          <p className="mx-2 py-2 px-2">Product</p>
          <p className="mx-2 py-2 px-2 col-span-2">Title</p>
          <p className="mx-2 py-2 px-2 text-center">Old Price</p>
          <p className="mx-2 py-2 px-2 text-center">New Price</p>
          <p className="mx-2 py-2 px-2 text-center">Category</p>
          <p className="mx-2 py-2 px-2">Remove</p>
        </div>
        {
          allproduct.map((product,index)=>{
            return <><div id={index} className="data grid grid-cols-7 m-2 p-2 w-[65rem] place-items-center">
          <img src={product.image} alt="" className=" mx-2 py-2 px-2 h-[100px] w-[100px] text-center"/>
          <p className="mx-2 py-2 px-2 col-span-2 ">{product.name}</p>
          <p className="mx-2 py-2 px-2 text-center">{product.old_price}</p>
          <p className="mx-2 py-2 px-2 text-center">{product.new_price}</p>
          <p className="mx-2 py-2 px-2 text-center">{product.category}</p>
          <div className="flex justify-center items-center  w-[5rem] h-[3rem]">
          <img src={remove} alt="" className="py-2 px-2 " onClick={()=>{removeProduct(product.id)}}/>
          </div>
        </div>
        <hr />
        </>
          })
        }
      </div>
    </div>
  );
};

export default ListProduct;
