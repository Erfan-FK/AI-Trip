import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { db } from '../service/FireBaseConfig';
import Trip from './Trip';

function MyTrips() {
    const navigator = useNavigate();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        getUserTrips();
    }, []);

    const getUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigator('/');
            return;
        }
        setTrips([]);
        const q = query(collection(db, 'trips'), where('user.email', '==', user?.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
            setTrips(prevVal => [...prevVal, doc.data()])
        });
    }

    return (
        <div className='sm:px-8 md:px-32 lg:px-64 xl:px-72 px-6 mt-10'>
            <h2 className='text-3xl font-bold'>My Trips</h2>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
                {trips?.length > 0 ? trips.map((trip, index) => (
                    <div key={index}>
                        <Trip trip={trip}/>
                    </div>
                )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
                    <div key={index} className='h-[175px] w-full  bg-slate-200 animate-pulse rounded-lg'>
                        
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default MyTrips