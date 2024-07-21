import React from 'react'
import Activity from './Activity'
import Meal from './Meal'

function DailyPlan({ days }) {
    return (
        <div>
            <h2 className='text-xl font-bold mt-4'>Daily Plan</h2>

            <div>
                {days?.map((day, index) => (
                    <div key={index}>
                        <h2 className='text-lg font-bold my-2'>{day?.day}</h2>

                        <h2 className='text-md font-bold my-2 text-blue-500'>Activities:</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            {day?.activities?.map((activity, index) => (
                                <div key={index} >
                                    <Activity activity={activity} />
                                </div>
                            ))}
                        </div>
                        
                        <h2 className='text-md font-bold my-2 text-blue-500'>Meals</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            {day?.meals?.map((meal, index) => (
                                <div key={index} >
                                    <Meal meal={meal} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DailyPlan