import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlace, IMG_REF_URL } from '../../service/ImageApi';
import { IoMdImage } from "react-icons/io";

function Meal({ meal }) {
    const [placeImg, setPlaceImg] = useState();

    useEffect(() => {
        meal && getPlaceImg();
    }, [meal])


    const getPlaceImg = async () => {
        const data = {
            textQuery: meal.restaurant
        }

        const res = await getPlace(data).then((res) => {
            const imageUrl = IMG_REF_URL.replace('{NAME}', res.data.places[0].photos[0].name).replace('{API_KEY}', import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY)
            setPlaceImg(imageUrl)
        })
    }

    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + meal?.restaurant + ' ' + meal?.address} target='_blank' rel='noreferrer'>
            <div className='mb-2 border rounded-lg p-2 flex gap-4 hover:scale-105 transition-all hover:shadow-lg cursor-pointer'>
                {placeImg ? (
                    <img
                        src={placeImg}
                        alt={meal?.restaurant}
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
                    <h2 className='font-bold text-large'>{meal?.restaurant}</h2>
                    <h2 className='text-sm text-blue-500'>{meal?.cuisine}</h2>
                    <p2 className='text-xs text-gray-500'>{meal?.address}</p2>

                    <div className='flex gap-4'>
                        <h2 className='text-sm font-bold'>⭐{meal?.rating}</h2>
                        <h2 className='text-sm font-bold'>🏷️{meal?.price_range}</h2>
                    </div>

                    <h2 className='text-sm font-bold'>🍽️{meal?.meal_types.join(" ")}</h2>
                </div>
            </div>
        </Link>
    )
}

export default Meal