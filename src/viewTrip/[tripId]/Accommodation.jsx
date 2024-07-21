import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlace, IMG_REF_URL } from '../../service/ImageApi';
import { IoMdImage } from "react-icons/io";

function Accommodation({ accommodation }) {
    const [placeImg, setPlaceImg] = useState();

    useEffect(() => {
        accommodation && getPlaceImg();
    }, [accommodation])


    const getPlaceImg = async () => {
        const data = {
            textQuery: accommodation?.name
        }

        const res = await getPlace(data).then((res) => {
            const imageUrl = IMG_REF_URL.replace('{NAME}', res.data.places[0].photos[0].name).replace('{API_KEY}', import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY)
            setPlaceImg(imageUrl)
        })
    }

    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + accommodation?.name + " " + accommodation?.address} target='_blank' rel='noreferrer'>
            {placeImg ? (
                <img
                    src={placeImg}
                    alt={accommodation?.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                    }}
                    className='h-[175px] w-full object-cover rounded-lg'
                />
            ) : (
                <IoMdImage className='h-[125px] w-[125px] rounded-lg text-gray-400' />
            )}

            <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>{accommodation?.name}</h2>
                <p className='text-xs text-gray-500'>📍{accommodation?.address}</p>
                <p className='text-sm '>🏷️{accommodation?.price_per_night}</p>
                <p className='text-sm '>⭐{accommodation?.rating}</p>
            </div>
        </Link>
    )
}

export default Accommodation