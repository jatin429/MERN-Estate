import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import { FaBath, FaBed } from 'react-icons/fa'

export default function ListingItem({listing}) {
  return (
    <div className='overflow-hidden shadow-md hover:shadow-lg transition-shadow rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0]} alt='listing-image' className='h-[320px] sm:h-[220px] object-cover w-full hover:scale-105 transition-scale duration-300'/>
        <div className='p-3 flex flex-col gap-2 w-full '>
          <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
          <div className='flex items-center gap-1'>
          <MdLocationOn className='text-green-700 h-4 w-4'/>
          <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p> 
        </div>
          <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
          <p className='text-slate-500 mt-1 font-semibold'>
            $ 
            {listing.offer ? 
            listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type==='rent' && '/ month'}
          </p>
          <div className='flex gap-4 text-slate-700'>
            <div className='font-bold text-xs flex items-center gap-1'>
            <FaBed/>
             {listing.bedrooms}
              {listing.bedrooms===1 ? ' Bed' : ' Beds'}
            </div>
            <div className='flex font-bold text-xs items-center gap-1'>
            <FaBath/>
             {listing.bathrooms}
              {listing.bathrooms===1 ? ' Bath' : ' Baths'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
