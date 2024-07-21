import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../service/FireBaseConfig'
import InfoSection from './InfoSection'
import Accommodations from './Accommodations'
import DailyPlan from './DailyPlan'
import Footer from './Footer'
import { toast } from 'sonner'

function ViewTrip() {
  const { tripId } = useParams()
  useEffect(() => {
    tripId && getTripData()
  }, [])

  const [tripData, setTripData] = useState({})
  const getTripData = async () => {
    const docRef = doc(db, 'trips', tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTripData(docSnap.data());
    } else {
      toast("Document does not exist", "error");
    }
  }


return (
  <div className='pd-8 md:px-16 lg:px-24 xl:px-32'>
      {tripData?.GeminiResponse?.trip_plan?.destinations?.map((destination, index) => (
        <div key={index}>
          <InfoSection destination={destination} budget={tripData?.GeminiResponse?.trip_plan?.budget} />
          <Accommodations accommodations={destination?.accommodations} />
          <DailyPlan days={destination?.days} />
        </div>
      ))}

      <Footer />
    </div>
)
}

export default ViewTrip