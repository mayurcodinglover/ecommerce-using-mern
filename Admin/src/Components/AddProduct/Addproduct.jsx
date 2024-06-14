import React from 'react'
import filupload from '../../assets/upload_area.svg'
import { useState } from 'react'

const Addproduct = () => {
    const [image, setimage] = useState(false)
    const [productdetails, setproductdetails] = useState({
        name:"",
        image:"",
        old_price:"",
        new_price:"",
        category:"women"
    });

    const handleimage=(e)=>{
        setimage(e.target.files[0])
    }

    const handleChange=(e)=>{
        setproductdetails({...productdetails,[e.target.name]:e.target.value});

    }
        const handleSave=async ()=>{
            console.log(productdetails);
                let responseData;
                const product=productdetails;

                const formData=new FormData();
                console.log(image);
                formData.append('product',image);
                // console.log(formData);

                await fetch("http://localhost:3000/upload",{
                    method:"POST",
                    body:formData
                }).then((res)=>res.json()).then((data)=>{responseData=data})

                if(responseData.success)
                {
                    product.image=responseData.image_url;
                    console.log(product);

                    await fetch("http://localhost:3000/addproduct",{
                        method:"POST",
                        headers: {
                            "Content-Type": "application/json",
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          body:JSON.stringify(product)
                    }).then((res)=>(res.json())).then((data)=>{
                        data.success?alert("Data Inserted"):alert("Failed")
                        setproductdetails({
                            name:"",
                            image:"",
                            old_price:"",
                            new_price:"",
                            category:""
                        })
                    })
                }
                
        }
    
  return (
    <div>
    <div className="add-product bg-gray-100 m-2 p-2 w-[50rem]">
            <div className="title flex flex-col m-2 p-3">
                <label htmlFor="title" className='my-1'>Product title</label>
                <input value={productdetails.name} type="text" name="name" id="title" placeholder='Type here' className='h-12 my-1 p-2 rounded-md' onChange={handleChange}/>
            </div>
            <div className="price grid m-2 p-2 grid-cols-2">
                <div className="old-price flex flex-col m-1 p-1">
                    <label htmlFor="price" className='my-1'>Price</label>
                    <input value={productdetails.old_price} type="text" name="old_price" id="old_price" placeholder='Type here' className='h-12 my-1 p-2 rounded-md' onChange={handleChange}/>
                </div>
                <div className="new-price flex flex-col m-1 p-1">
                    <label htmlFor="offerprice" className='my-1'>Offer Price</label>
                    <input value={productdetails.new_price} type="text" name="new_price" id="new_price" placeholder='Type here' className='h-12 my-1 p-2 rounded-md' onChange={handleChange}/>
                </div>
            </div>  
            <div className="category flex m-1 mx-5 p-1">
                <select name="category" value={productdetails.category}  id="category" className='h-12 my-1 p-3 rounded-md' onChange={handleChange}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="iamge mx-5 p-0">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):filupload} alt="" className='h-[120px] w-[120px]'/>
                </label>
                    <input onChange={handleimage} type="file" name="image" id="file-input" hidden/>
            </div>
            <div className="button flex m-2 p-2 justify-center items-center">
                <button type="submit" className='h-12 p-3 rounded-md bg-green-300 w-[8rem]' onClick={handleSave}>Add</button>
            </div>
    </div>
      
    </div>
  )
}

export default Addproduct
