import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlace, IMG_REF_URL } from '../../service/ImageApi';
import { IoMdImage } from "react-icons/io";

function Activity({ activity }) {
    const [placeImg, setPlaceImg] = useState();

    useEffect(() => {
        activity && getPlaceImg();
    }, [activity])


    const getPlaceImg = async () => {
        const data = {
            textQuery: activity?.location
        }

        const res = await getPlace(data).then((res) => {
            const imageUrl = IMG_REF_URL.replace('{NAME}', res.data.places[0].photos[0].name).replace('{API_KEY}', import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY)
            setPlaceImg(imageUrl)
        })
    }

    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + activity?.location} target='_blank' rel='noreferrer'>
            <div className='mb-2 border rounded-lg p-2 flex gap-4 hover:scale-105 transition-all hover:shadow-lg cursor-pointer'>
                {placeImg ? (
                    <img
                        src={placeImg}
                        alt={activity?.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                        }}
                        className='h-[125px] w-[125px] rounded-lg'
                    />
                ) : (
                    <IoMdImage className='h-[125px] w-[125px] rounded-lg text-gray-400' />
                )}

                <div>
                    <h2 className='font-bold text-large'>{activity?.name}</h2>
                    <p className='text-sm text-gray-500'>{activity?.description}</p>

                    <h2 className='text-sm font-bold mt-4'>🏷️{activity?.price}</h2>
                    <h2 className='text-sm font-bold'>⌛{activity?.duration}</h2>
                </div>
            </div>
        </Link>
    )
}

export default Activity