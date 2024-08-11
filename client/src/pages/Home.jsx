import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [offerListing,setOfferListing]=useState([]);
  const [rentListing,setRentListing]=useState([]);
  const [sellListing,setSellListing]=useState([]);
  SwiperCore.use([Navigation]);
  
  useEffect(()=>{
    const fetchOfferListing=async()=>{
      try {
        const res=await fetch('/api/listing/get?offer=true&limit=4');
        const data=await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }
  
    const fetchRentListing=async()=>{
       try {
        const res=await fetch('/api/listing/get?type=rent&limit=4');
        const data=await res.json();
        setRentListing(data);
        fetchSellListing();
      } catch (error) {
        console.log(error);
      }
    }
  
    const fetchSellListing=async()=>{
      try {
        const res=await fetch('/api/listing/get?type=sell&limit=4');
        const data=await res.json();
        setSellListing(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListing();
  },[]);

  return (
    <div>
    {/* top section */}
     <div className='flex flex-col gap-6 px-3 py-28 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold text-slate-700 lg:text-6xl'>
        Find your next <span className='text-gray-500'>perfect</span>
        <br/>
        place with ease
      </h1>
      <div className='text-gray-400 text-xs sm:text-sm'>
        Jain Estate will help you find your home fast,easy and confortable.
        <br/>
        Our expert support are always available.
      </div>
      <Link to={'/search'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>
        Let's Start Now...
      </Link>
     </div>

    {/* swiper section */}
     <Swiper navigation>
     {offerListing && 
      offerListing.map((listing)=>(
         <SwiperSlide>
          <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:'cover'}} className='h-[550px]' key={listing._id}></div>
         </SwiperSlide>
      ))
    }
     </Swiper>

    {/* cards section for offer,sale and rent*/}
     <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
      {
        offerListing && (
          <div>
            <div className='my-3'>
              <h2 className='text-slate-600 font-semibold text-2xl'>Recent Offers</h2>
              <Link to={'/search?offer=true'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                offerListing.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
      }
      {
        rentListing && (
          <div>
            <div className='my-3'>
              <h2 className='text-slate-600 font-semibold text-2xl'>Recent Places For Rent</h2>
              <Link to={'/search?type=rent'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                rentListing.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
      }
      {
        sellListing && (
          <div>
            <div className='my-3'>
              <h2 className='text-slate-600 font-semibold text-2xl'>Recent Places For Sale</h2>
              <Link to={'/search?type=sell'} className='text-blue-800 text-xs sm:text-sm font-bold hover:underline'>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {
                sellListing.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
      }
     </div>
    </div>
  )
}
