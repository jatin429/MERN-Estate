import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaFacebook, FaFulcrum, FaParking, FaShare } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing,setListing]=useState(null);  
  const [contact,setContact]=useState(false);  
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);
  const [copied,setCopied]=useState(false);
  const params=useParams();
  const {currentUser}= useSelector((state)=>state.user);
  useEffect(()=>{
    const fetchListing=async()=>{
      try {
        setError(false);
        setLoading(true);
        const res=await fetch(`/api/listing/get/${params.listingId}`);
        const data=await res.json();
        if(data.success===false){
          setError(data.message);
          setLoading(false);
          return ;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
    fetchListing();
  },[params.listingId]);
  return (
    <div>
      {loading && <p className='text-center text-2xl my-7'>Loading...</p>}
      {error && <p className='text-center text-red-700 my-7 text-2xl'>Something Went Wrong!</p>}
    {listing && !loading && !error && (
      <div>
        <Swiper navigation>
          {listing.imageUrls.map(url => <SwiperSlide key={url}>
             <div className='h-[550px]'style={{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}>

             </div>
          </SwiperSlide>)}
        </Swiper>
        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold '>
              {listing.name} - <span className='text-green-700'>${' '}</span>
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
            <span className='font-semibold '>Description - </span>
            {listing.description}
            </p>
            <ul className='flex gap-4 items-center sm:gap-6 flex-wrap'>
              <li className='flex items-center gap-1 text-green-900 font-semibold text-sm'>
              <FaBed className='text-lg'/>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`} 
              </li>
              <li className='flex items-center gap-1 text-green-900 font-semibold text-sm'>
              <FaBath className='text-lg'/>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`} 
              </li>
              <li className='flex items-center gap-1 text-green-900 font-semibold text-sm'>
              <FaParking className='text-lg'/>
              {listing.parking  ? "Parking" : "No Parking"} 
              </li>
              <li className='flex items-center gap-1 text-green-900 font-semibold text-sm'>
              <FaChair className='text-lg'/>
              {listing.furnished  ? "Furnished" : "Not Furnished"} 
              </li>
            </ul>
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button onClick={()=>setContact(true)} className='text-white hover:opacity-95 font-semibold border rounded-lg border-slate-700 p-3 bg-gray-700'>CONTACT LANDLORD</button>
              )}
              {contact && <Contact listing={listing}/>}
            </div>
        
      </div>
    )}
    </div>
  )
}
