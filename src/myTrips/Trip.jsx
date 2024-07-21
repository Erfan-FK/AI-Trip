import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlace, IMG_REF_URL } from '../service/ImageApi';
import { IoMdImage } from "react-icons/io";

function Trip({ trip }) {
    const [placeImg, setPlaceImg] = useState();

    useEffect(() => {
        trip && getPlaceImg();
    }, [trip])


    const getPlaceImg = async () => {
        const data = {
            textQuery: trip?.GeminiResponse?.trip_plan?.destinations[0]?.destination
        }

        const res = await getPlace(data).then((res) => {
            const imageUrl = IMG_REF_URL.replace('{NAME}', res.data.places[0].photos[0].name).replace('{API_KEY}', import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY)
            setPlaceImg(imageUrl)
        })
    }

    return (
        <Link to={'/view-trip/' + trip?.id} target='_blank' rel='noreferrer'>
            <div className='hover:scale-105 transition-all pd-4 cursor-pointer'>
                {placeImg ? (
                    <img src={placeImg} className='h-[175px] w-full object-cover rounded-lg' />
                ) : (
                    <IoMdImage className='h-[125px] w-[125px] rounded-lg text-gray-400' />
                )}

                <div>
                    <h2 className='font-bold text-sm'>
                        {trip?.GeminiResponse?.trip_plan?.destinations?.map(destination => destination.destination).join(" - ")}
                    </h2>
                    <h2 className='text-xs text-gray-500'>
                        📅{trip?.GeminiResponse?.trip_plan?.destinations?.reduce((totalDays, destination) => totalDays + (destination.days?.length || 0), 0)} {(trip?.destinations?.reduce((totalDays, destination) => totalDays + (destination.days?.length || 0), 0)) === 1 ? 'Day' : 'Days'} Trip
                    </h2>
                </div>
            </div>
        </Link>
    )
}

export default Trip