import React from 'react'
import Accommodation from './Accommodation'

function Accommodations({ accommodations }) {
    return (
        <div>
            <h2 className='text-xl font-bold mt-4'>Recommender Accommodations</h2>

            <div className='mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {accommodations?.map((accommodation, index) => (
                    <div key={index} className='hover:scale-105 transition-all pd-4 cursor-pointer'>
                        <Accommodation accommodation={accommodation} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Accommodations