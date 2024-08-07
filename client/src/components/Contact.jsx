import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

    const onChange=(e)=>{
        setMessage(e.target.value);
    }
    const [landlord,setLandlord]=useState(null);
    const [message,setMessage]=useState(null);
    useEffect(()=>{
        const fetchLandLord=async()=>{
            try {
                const res=await fetch(`/api/user/${listing.userRef}`);
                const data=await res.json();
                console.log(data);
                setLandlord(data);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchLandLord();
    },[listing.userRef])
  return (
    <div>
        {landlord && (
            <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{landlord.username} </span> for <span className='font-semibold '>{listing.name.toLowerCase()}</span></p>
                <textarea onChange={onChange} className='w-full p-3  border rounded-lg bg-slate-200' placeholder='Enter your message here...' rows={2} name='message' value={message}/>
                <Link
                to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} 
                className='hover:opacity-95 p-3 bg-slate-700 uppercase text-center rounded-lg'>Send Message</Link>
            </div>
        )}
    </div>
  )
}
