import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess,signOutUserFailure } from "../redux/user/userSlice";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const [formData, setFormData] = useState({});
  const [fileError, setFileError] = useState(false);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(""); // New state for update messages
  const [file, setFile] = useState(undefined);
  const [showListingError, setShowListingError]=useState(false); 
  const [userListing, setUserListing]=useState([]); 
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setFileError(error.message);
        setFileUploadSuccess(false); // Ensure file upload success state is reset
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
          setFileError(false);
          setFileUploadSuccess(true); // Set file upload success state
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage(""); // Clear previous messages
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateMessage(data.message); // Set error message
        setUpdateSuccess(false); // Ensure update success state is reset
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setUpdateMessage("User is updated successfully"); // Set success message
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateMessage(error.message); // Set error message
      setUpdateSuccess(false); // Ensure update success state is reset
    }
  };
  
  const handleDeleteUser=async()=>{
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data=await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
  }

  const handleSignOut=async()=>{
    try {
      dispatch(signOutUserStart());
      const res=await fetch('/api/auth/signout');
      const data= await res.json();
      if(data.success==false){
        dispatch(signOutUserFailure);
        return ;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings=async()=>{
    try {
      setShowListingError(false);
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      const data=await res.json();
      console.log(data);
      if(data.success === false){
        setShowListingError(true);
        return ;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleListingDelete=async(listingId)=>{
    try {
       const res=await fetch(`/api/listing/delete/${listingId}`,{
        method:"DELETE",
       });
       const data=await res.json();
       if(data.success===false){
        console.log(data.message);
        return ;
       }
       setUserListing((prev)=>prev.filter((listing)=>listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col items-center'>
          <img
            className='rounded-full w-24 h-24 object-cover cursor-pointer'
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            onClick={() => fileRef.current.click()}
          />
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            className='hidden'
            accept='image/*'
          />
          {fileError ? (<span className="text-red-700">Error Image upload (image must be less than 2mb)!</span>) : null}
          {fileUploadSuccess ? (<span className="text-green-700">Image successfully uploaded!</span>) : null}
        </div>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button disabled={loading}
          className='rounded-lg bg-slate-700 text-white p-3 hover:opacity-95 disabled:opacity-80'
        >
         {loading ? "Loading...":"UPDATE"}
        </button>
        <Link to='/create-listing'
          className='rounded-lg bg-green-700 text-center text-white p-3 hover:opacity-95 disabled:opacity-80'
        >
          CREATE LISTING
        </Link>
      </form>
      <div className='flex justify-between gap-2 mt-5 text-red-700'>
        <p className='cursor-pointer' onClick={handleDeleteUser}>
          Delete Account
        </p>
        <Link to="/sign-in">
          <span onClick={handleSignOut}>Sign out</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error || ''}</p>
      <p className="text-green-700 mt-5">{updateMessage}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listing</button>
      <p className="text-red-700 mt-5">{showListingError ? "Error Showing Listing":""}</p>
      {userListing && userListing.length > 0 && (
         <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-center mt-7">Your Listings</h1>
         {userListing.map((listing) => (
        <div key={listing._id} className="flex justify-between items-center border rounded-lg p-3 gap-4">
          <Link to={`/listing/${listing._id}`}>
           <img src={listing.imageUrls[0]} className="h-16 w-16 object-contain "/>
         </Link>
         <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
           <p>{listing.name}</p>
         </Link>
         <div className="flex flex-col ">
          <button  onClick={()=>handleListingDelete(listing._id)} className="text-red-700">DELETE</button>

          <Link to={`/update-listing/${listing._id}`}><button className="text-green-700">EDIT</button></Link>
         </div>
       </div>
     ))}
  </div>
)}
    </div>
  );
}
