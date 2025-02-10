import React from 'react'
import { pic2,pic6,pic7,pic8 } from '../assets'
import Carousel from './Carousel'
import { ImageCard } from './ImageCard'
import {ArrowLeft } from './icons'
import { useNavigate } from 'react-router-dom'

function Picture() {
  const navigate = useNavigate();

  const pictures = [
    { Image: pic2, title: 'May 11, 2024', description: "matching autism cat pfps <3"},   
    { Image: pic6, title: 'March 30, 2024', description: "we were losing it over 'emotioning' for the first time,, it feels like so long ago"},
    { Image: pic7, title: 'July 7, 2024', description: "bummy ass austin aquarium where that loud ass monkey 100% did not like us"},   
    { Image: pic8, title: 'February 7, 2025', description: "i love holding your hand more than anything <3 i love you in general tho so"},
  ]
  return (
  
    <div className="min-h-screen bg-black/20 flex flex-col items-center justify-center">

      <div className="w-[90%] max-w-[400px]">
        <h1 className="text-2xl sm:text-2xl font-bold -mb-4 drop-shadow-lg text-white text-center">
            Our Pictures
          </h1>
        <Carousel>
          {pictures.map(({Image,title,description,index}) => (
            <ImageCard
              key={index}
              imageUrl={Image}
              altText="Placeholder image"
              title={title}
              description={description}
            />
          ))}
        </Carousel>

        <div className="flex justify-center w-full mt-12">
          <button
            className="px-4 py-2 flex justify-center items-center bg-white/20 gap-2 hover:bg-white/30 backdrop-blur-sm text-white text-sm border border-white/50 rounded-lg"
            onClick={() => navigate('/recap')}
          >
            <ArrowLeft /> Previous page
          </button>

        </div>
      </div>
    </div>


  )
}

export default Picture