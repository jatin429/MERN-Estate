import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import  { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
    const [files,setFiles]=useState([]);
    const {currentUser}=useSelector((state)=>state.user);
    const navigate=useNavigate();
    const params=useParams();
    const [formData,setFormData]=useState({
        imageUrls:[],
        name:"",
        description:"",
        address:"",
        type:"rent",
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    });
    const [imageUploadError,setImageUploadError]=useState(false);
    const [uploading,setUploading]=useState(false);
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    
    useEffect(()=>{
    const fetchListing= async ()=>{
        const listingId= params.listingId;
        const res=await fetch(`/api/listing/get/${listingId}`);
        const data=await res.json();
        if(data.success===false){
            console.log(data.message);
            return ;
        }
        setFormData(data);
    }
    fetchListing();
    },[])

    const handleImageSubmit=(e)=>{
         if(files.length > 0 && files.length + formData.imageUrls.length < 7){
             setUploading(true);
             setImageUploadError(false);
            const promises=[];
            for(let i=0;i<files.length;i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false);
            }).catch((error)=>{
                setImageUploadError('Image upload failed (2mb max per image)');
                setUploading(false);
            });
         }else{
            setImageUploadError("You can only upload 6 images per listing");
            setUploading(false);
         }
    }
    const storeImage=async(file)=>{
      return new Promise((reslove,reject)=>{
        const storage=getStorage(app);
        const fileName=new Date().getTime() + file.name;
        const storageRef=ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              reject(error) 
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                reslove(downloadURL);
              });
            }
          );
      })
    }
    
    const handleRemoveImage=async(index)=>{
       setFormData({
        ...formData,
        imageUrls:formData.imageUrls.filter((_,i)=>i!==index)
       })
    }

    const handleChange=(e)=>{
        if(e.target.id==='rent' || e.target.id=='sell'){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }
        if(e.target.id==='offer' || e.target.id==='furnished' || e.target.id==='parking'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
        if(e.target.type==='text' || e.target.type==='textarea' || e.target.type==='number'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
        if(formData.imageUrls.length < 1) return setError("You must upload atleast one image");
        if(+formData.regularPrice < +formData.discountPrice) return setError("Discounted price must be less than regular price");
            setLoading(true);
            setError(false);
            const res=await fetch(`/api/listing/update/${params.listingId}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                ...formData,
                userRef:currentUser._id,
                })
            })
            const data=await res.json();
            setLoading(false);
            if(data.success===false){
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }
    
  return (
    <div className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
         <div className='flex flex-col gap-4 flex-1'>
            <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name}/>
            <textarea type='text' placeholder='Description'  className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description}/>
            <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address}/>
         <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
            <input type='checkbox' id='sell' className='w-4' onChange={handleChange} checked={formData.type==='sell'}/>
            <span>Sell</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id='rent' className='w-4' onChange={handleChange} checked={formData.type==='rent'}/>
            <span>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id='parking' className='w-4' onChange={handleChange} checked={formData.parking}/>
            <span>Parking Spot</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id='furnished' className='w-4' onChange={handleChange} checked={formData.furnished}/>
            <span>Furnished</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id='offer' className='w-4' onChange={handleChange} checked={formData.offer}/>
            <span>Offer</span>
          </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
            <input type='number' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' id='bedrooms' onChange={handleChange} value={formData.bedrooms}/>
            <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
            <input type='number' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' id='bathrooms' onChange={handleChange} value={formData.bathrooms}/>
            <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
            <input type='number' min='50' max='100000' required className='p-3 border w-24 h-14 border-gray-300 rounded-lg' id='regularPrice' onChange={handleChange} value={formData.regularPrice}/>
            <div className='flex'>
            <div className='flex flex-col items-center'>
            <p>Regular Price</p>
            {formData.type==='rent' && (<span className='text-xs'>($/Month)</span>)}
            </div>
            </div>
            {formData.offer && 
            (
            <div className='flex items-center gap-2'>
            <input type='number' min='0' max='100000' required className='p-3 border w-24 h-14 border-gray-300 rounded-lg' id='discountPrice' onChange={handleChange} value={formData.discountPrice}/>
            <div className='flex flex-col items-center'>
            <p>Disounted Price</p>
            {formData.type==='rent' && (<span className='text-xs'>($/Month)</span>)}
            </div>
            </div>
            )
            }
            </div>
          </div>
         </div>
         <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='text-gray-600 font-normal ml-2'>The first image will be cover (max 6)</span></p>
            <div className='flex gap-4'>

            <input onChange={(e)=>setFiles(e.target.files)} type='file' id='images' accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full '/>

            <button type='button' onClick={handleImageSubmit} className='border border-green-700 p-3 rounded-lg text-green-700 hover:shadow-lg disabled:opacity-80'>
            {uploading ? "UPLOADING...":"UPLOAD"}</button>
         </div>
         <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
         {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                <div key={url} className='flex justify-between items-center border p-3 rounded-lg'>
                <img src={url} alt='listing image' className='w-20 h-20 object-cover rounded-lg'/>
                <button type='button' onClick={()=>handleRemoveImage(index)} className='text-red-700 hover:opacity-75'>DELETE</button>
                </div>
            ))
         }
         <button disabled={loading || uploading} className='text-white bg-slate-700 p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>
         {loading ? "UPDATING..." : "UPDATE LISTING"}</button>
         {error && <p className='text-red-700 text-sm'>{error}</p>}
         </div>
        </form>
    </div>
  )
}
