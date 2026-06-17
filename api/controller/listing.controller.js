import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing=async(req,res,next)=>{
  try {
    // sanitize imageUrls: ensure array of clean url strings
    if (req.body.imageUrls) {
      let urls = [];
      const raw = req.body.imageUrls;

      if (Array.isArray(raw)) {
        urls = raw.slice();
      } else if (typeof raw === 'string') {
        // try JSON parse first
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            urls = parsed;
          } else if (typeof parsed === 'string') {
            urls = [parsed];
          }
        } catch (e) {
          // fallback: extract http/https urls from the string
          const matches = raw.match(/https?:\/\/[^\s"'\\]+/g);
          if (matches) urls = matches;
          else urls = [raw];
        }
      }

      // clean each url: remove backslashes, surrounding quotes, newlines, and trim
      req.body.imageUrls = urls
        .map((u) => {
          if (u == null) return '';
          let s = String(u);
          s = s.replace(/\\+/g, ''); // remove backslashes
          s = s.replace(/\r?\n/g, ''); // remove newlines
          s = s.trim();
          if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
          if (s.startsWith("'") && s.endsWith("'")) s = s.slice(1, -1);
          return s.trim();
        })
        .filter(Boolean);
    }

    const listing=await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

export const deleteListing=async(req,res,next)=>{
  const listing= await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandler(404,'Listing not found!'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'You can only delete your own listings!'))
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted ')
  } catch (error) {
    next(error);
  }
}

export const updateListing=async(req,res,next)=>{
  const listing= await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandler(404,'Listing not found!'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'You can only update your own listings!'))
  }
  try {
    const updateListing=await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  } 
}

export const getListing=async(req,res,next)=>{
  try {
    const listing=await Listing.findById(req.params.id);
    if(!listing){
      return next(errorHandler(404,'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

export const getListings=async(req,res,next)=>{
  try {
    const limit=parseInt(req.query.limit) || 9;
    const startIndex=parseInt(req.query.startIndex) || 0 ;

    let offer=req.query.offer;
    if(offer ===undefined || offer ==='false'){
      offer= {$in : [false , true]};
    }

    let furnished=req.query.furnished;
    if(furnished ===undefined || furnished ==='false'){
      furnished= {$in : [false , true]};
    }

    let parking=req.query.parking;
    if(parking ===undefined || parking ==='false'){
      parking= {$in : [false , true]};
    }

    let type=req.query.type;
    if(type ===undefined || type ==='all'){
      type= {$in : ['sell' , 'rent']};
    }

    const searchTerm= req.query.searchTerm || '';

    const sort=req.query.sort || 'createdAt';

    const order=req.query.order || 'desc';

    const listings=await Listing.find({
      name: {$regex : searchTerm, $options:'i'},
      offer,
      furnished,
      parking,
      type,
    }).sort(
      {
        [sort]:order
      }
    ).limit(limit).skip(startIndex);

    return res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
}