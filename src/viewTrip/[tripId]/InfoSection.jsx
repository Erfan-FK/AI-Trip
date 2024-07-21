import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button';
import { FaShareNodes } from "react-icons/fa6";
import { getPlace, IMG_REF_URL } from '../../service/ImageApi';
import { query } from 'firebase/firestore';

function InfoSection({ destination, budget }) {
    const [placeImg, setPlaceImg] = useState();

    useEffect(() => {
        destination && getPlaceImg();
    }, [destination])


    const getPlaceImg = async () => {
        const data = {
            textQuery: destination?.destination
        }

        const res = await getPlace(data).then((res) => {
            const imageUrl = IMG_REF_URL.replace('{NAME}', res.data.places[0].photos[0].name).replace('{API_KEY}', import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY)
            setPlaceImg(imageUrl)
        })
    }

    return (
        <div className='mt-4'>
            <img src={placeImg} alt='placeholder' className='h-[250px] w-full object-cover rounded-md' />

            <div className='flex justify-between items-center'>
                <div className='my-5 flex flex-col gap-2'>
                    <h2 className='text-2xl font-bold'>{destination?.destination}</h2>
                    <div className='flex gap-4'>
                        <h2 className='p-1 px-4 bg-gray-200 rounded-full text-gray-500'>
                            📅 {destination?.days?.length} {destination?.days?.length === 1 ? 'day' : 'days'}
                        </h2>
                        <h2 className='p-1 px-4 bg-gray-200 rounded-full text-gray-500'> 💵 {budget} </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoSection