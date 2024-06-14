import React from 'react'
import { useState,useEffect } from 'react';


const Adminorder = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    // Fetch orders from your backend
    fetchOrders();  
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://ecommerce-using-mern-0z75.onrender.com/fetchallorder',{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  console.log(orders);
  

  const handleStatusChange = (e, orderId) => {
    const newStatus = e.target.value;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Optionally, update the status in the backend
    updateOrderStatus(orderId, newStatus);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`https://ecommerce-using-mern-0z75.onrender.com/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }).then((res)=>res.json()).then((data)=>data.success?alert("update"):alert("not update"))

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  return (
    <div className="container mx-auto p-5">
    <h1 className="text-3xl font-bold mb-5 text-center">Admin Order page</h1>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">Product Name</th>
            <th className="py-3 px-6 text-left">Price</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
        {orders.map((item,index)=>{
            return <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">{item.id}</td>
            <td className="py-3 px-6 text-left">{item.items}</td>
            <td className="py-3 px-6 text-left">{item.total}</td>
            <td className="py-3 px-6 text-left">
              <select className="border border-gray-300 rounded p-2" onChange={(e)=>{handleStatusChange(e,item.id)}} value={item.status}>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </td>
          </tr>
        })}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default Adminorder


