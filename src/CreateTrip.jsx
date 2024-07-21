import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { DatePickerWithRange } from './components/custom/datePicker';
import { Button } from './components/ui/button';
import { accommodations, activities, AI_PROMPT, budgets, meals, transportations, travelCompanions } from './constants/constants';
import { NumberInput } from './components/ui/input';
import { toast } from 'sonner';
import { chatSession } from './service/Gemini';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./components/ui/dialog"
import { FaGoogle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGoogleLogin } from '@react-oauth/google';
import { db } from './service/FireBaseConfig';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [destinations, setDestinations] = useState([
    { id: 1, destination: null, dateRange: { from: null, to: null } }
  ]);
  const [numPeople, setNumPeople] = useState(1);
  const [signInFrom, setSignInForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState({ city: '', country: '' });
  useEffect(() => {
    const getUserCity = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY}`)
          .then(response => response.json())
          .then(data => {
            const city = data.results[0].address_components.find(component => component.types.includes('locality')).long_name;
            const country = data.results[0].address_components.find(component => component.types.includes('country')).long_name;
            setLocation({ city, country });
          });
      });
    }

    getUserCity();
  });

  const navigate = useNavigate();

  const handleAddDestination = () => {
    if (destinations.length >= 2) {
      toast('You can only add up to 2 destinations.');
      return;
    }
    setDestinations([...destinations, { id: destinations.length + 1, destination: null, dateRange: { from: null, to: null } }]);
  };

  const handleRemoveDestination = (id) => {
    setDestinations(destinations.filter(destination => destination.id !== id));
  };

  const handleDestinationChange = (id, value) => {
    setDestinations(destinations.map(destination => destination.id === id ? { ...destination, destination: value } : destination));
  };

  const handleDateRangeChange = (id, dateRange) => {
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);

    const differenceInTime = toDate - fromDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 2) {
        toast('Date range can only be up to 2 days.');
        setDestinations(destinations.map(destination => destination.id === id ? { ...destination, dateRange: { from: null, to: null } } : destination));
        return;
    }

    setDestinations(destinations.map(destination => destination.id === id ? { ...destination, dateRange } : destination));
};

  const handleNumberChange = (e) => {
    setNumPeople(Number(e.target.value));
  };

  const handleGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setSignInForm(true);
      return;
    }


    if (!selectedBudget) {
      toast('Please select a budget for your trip.');
      return;
    }

    if (numPeople > 1 && selectedCompanions.length === 0) {
      toast('Please select who you are traveling with.');
      return;
    }

    if (selectedAccommodations.length === 0) {
      toast('Please select your preferred accommodations.');
      return;
    }

    if (selectedTransportations.length === 0) {
      toast('Please select your preferred mode of transportation.');
      return;
    }

    if (selectedActivities.length === 0) {
      toast('Please select the activities you are interested in.');
      return;
    }

    if (selectedMeals.length === 0) {
      toast('Please select the meals you plan to have during your trip.');
      return;
    }

    if (destinations.some(destination => !destination.destination || !destination.dateRange.from || !destination.dateRange.to)) {
      toast('Please fill out all the destination fields.');
      return;
    }

    setLoading(true);
    const tripData = {
      destinations,
      location,
      budget: selectedBudget,
      numPeople,
      travelCompanions: selectedCompanions,
      accommodations: selectedAccommodations,
      activities: selectedActivities,
      meals: selectedMeals
    };

    const PROMPT = AI_PROMPT
      .replace('{destination1}', destinations[0].destination.label)
      .replace('{startDate1}', destinations[0].dateRange.from)
      .replace('{endDate1}', destinations[0].dateRange.to)
      .replace('{destination2}', destinations[1]?.destination.label || 'N/A')
      .replace('{startDate2}', destinations[1]?.dateRange.from || 'N/A')
      .replace('{endDate2}', destinations[1]?.dateRange.to || 'N/A')
      .replace('{destination3}', destinations[2]?.destination.label || 'N/A')
      .replace('{startDate3}', destinations[2]?.dateRange.from || 'N/A')
      .replace('{endDate3}', destinations[2]?.dateRange.to || 'N/A')
      .replace('{location}', location.city + ', ' + location.country)
      .replace('{peopleCount}', numPeople)
      .replace('{budget}', selectedBudget.title + ' ' + selectedBudget.range)
      .replace('{travelCompanions}', selectedCompanions.map(c => c.title).join(', '))
      .replace('{accommodationType}', selectedAccommodations.map(a => a.title).join(', '))
      .replace('{transportationModes}', selectedTransportations.map(t => t.title).join(', '))
      .replace('{activityTypes}', selectedActivities.map(a => a.title).join(', '))
      .replace('{mealTypes}', selectedMeals.map(m => m.title).join(', '));
    const res = await chatSession.sendMessage(PROMPT);
    setLoading(false);
    saveTrip(res.response.candidates[0].content.parts[0].text, tripData);
  };

  const saveTrip = async (AITrip, tripData) => {
    setLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem('user'));
    let tripPayload = {};
    try {
      console.log(AITrip)
      const parsedTrip = JSON.parse(AITrip);

      tripPayload = {
        id: docId,
        user: user,
        userPreferences: tripData,
        GeminiResponse: parsedTrip,
      };
    } catch (error) {
      console.error("Error parsing AI trip:", error);
    } finally {
        setLoading(false);
    }

    console.log("Saving trip with data:", tripPayload);

    try {
      await setDoc(doc(db, "trips", docId), tripPayload);
      console.log("Trip saved successfully");
    } catch (error) {
      toast('An error occurred while saving your trip. Please try again later.');
    } finally {
      setLoading(false);
    }

    navigate(`/view-trip/${docId}`);
  }

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [selectedTransportations, setSelectedTransportations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);

  const handleSelectBudget = (budget) => setSelectedBudget(budget);
  const handleSelectCompanion = (companion) => {
    setSelectedCompanions(prev => {
      if (prev.includes(companion)) {
        return prev.filter(c => c !== companion);
      }
      return [...prev, companion];
    });
  };
  const handleSelectAccommodation = (accommodation) => {
    setSelectedAccommodations(prev => {
      if (prev.includes(accommodation)) {
        return prev.filter(a => a !== accommodation);
      }
      return [...prev, accommodation];
    });
  };
  const handleSelectTransportation = (transportation) => {
    setSelectedTransportations(prev => {
      if (prev.includes(transportation)) {
        return prev.filter(t => t !== transportation);
      }
      return [...prev, transportation];
    });
  };
  const handleSelectActivity = (activity) => {
    setSelectedActivities(prev => {
      if (prev.includes(activity)) {
        return prev.filter(a => a !== activity);
      }
      return [...prev, activity];
    });
  };
  const handleSelectMeal = (meal) => {
    setSelectedMeals(prev => {
      if (prev.includes(meal)) {
        return prev.filter(m => m !== meal);
      }
      return [...prev, meal];
    });
  };

  const companionsToShow = numPeople === 2 ? travelCompanions : travelCompanions.slice(0, 2);

  const signIn = useGoogleLogin({
    onSuccess: (codeResp) => getUserProfile(codeResp),
    onError: (error) => console.log(error),
  })

  const getUserProfile = (tokenInfo) => {
    axios.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + tokenInfo?.access_token, {
      headers: {
        'Authorization': 'Bearer ' + tokenInfo?.access_token,
        'Accept': 'application/json'
      }
    }).then((response) => {
      localStorage.setItem('user', JSON.stringify(response.data));
      setSignInForm(false);
      handleGenerateTrip();
    })
  }

  return (
    <div className='sm:px-8 md:px-32 lg:px-64 xl:px-72 px-6 mt-10'>
      <h2 className='font-bold text-3xl'>Plan Your Perfect Trip</h2>
      <p className='mt-3 text-gray-500 text-xl'>Fill out the form below to help us understand your travel preferences and requirements.</p>

      <div>
        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>Where would you like to go?</h2>
          {destinations.map(({ id, destination, dateRange }, index) => (
            <div key={id} className='relative mb-4'>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY}
                selectProps={{
                  value: destination,
                  onChange: (value) => handleDestinationChange(id, value),
                }}
                autocompletionRequest={{
                  types: ['(cities)'],
                }}
              />
              <DatePickerWithRange
                className='mt-2'
                value={dateRange}
                onChange={(range) => handleDateRangeChange(id, range)}
              />
              {index > 0 && (
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='mt-2'
                  onClick={() => handleRemoveDestination(id)}
                >
                  Remove Destination
                </Button>
              )}
            </div>
          ))}

          <Button type='button' onClick={handleAddDestination}>
            Add Destination
          </Button>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>What is your budget for the trip?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {budgets.map((item, id) => (
              <div
                key={id}
                className={`p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer ${selectedBudget === item ? 'shadow-lg border-gray-900' : ''}`}
                onClick={() => handleSelectBudget(item)}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                <h2 className='text-sm font-bold '>{item.range}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>How many people are traveling with you?</h2>
          <NumberInput type='number' value={numPeople} onChange={handleNumberChange} />

          {numPeople > 1 && (
            <div className='mt-4'>
              <h2 className='text-xl font-medium my-4'>Who are you traveling with?</h2>
              <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-${numPeople === 2 ? '3' : '2'} lg:grid-cols-${numPeople === 2 ? '3' : '2'} gap-3`}>
                {companionsToShow.map((item, id) => (
                  <div
                    key={id}
                    className={`p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer flex items-center ${selectedCompanions.includes(item) ? 'shadow-lg border-gray-900' : ''}`}
                    onClick={() => handleSelectCompanion(item)}
                  >
                    <h2 className='text-4xl mr-2'>{item.icon}</h2>
                    <div>
                      <h2 className='font-bold text-lg'>{item.title}</h2>
                      <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>What type of accommodation do you prefer?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {accommodations.map((item, id) => (
              <div
                key={id}
                className={`p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer ${selectedAccommodations.includes(item) ? 'shadow-lg border-gray-900' : ''}`}
                onClick={() => handleSelectAccommodation(item)}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>How do you plan to travel?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {transportations.map((item, id) => (
              <div
                key={id}
                className={`p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer ${selectedTransportations.includes(item) ? 'shadow-lg border-gray-900' : ''}`}
                onClick={() => handleSelectTransportation(item)}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>What kind of activities are you interested in?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {activities.map((item, id) => (
              <div
                key={id}
                className={`p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer ${selectedActivities.includes(item) ? 'shadow-lg border-gray-900' : ''}`}
                onClick={() => handleSelectActivity(item)}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-medium my-4'>What meals do you plan to have during your trip?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {meals.map((item, id) => (
              <div
                key={id}
                className={`p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer ${selectedMeals.includes(item) ? 'shadow-lg border-gray-900' : ''}`}
                onClick={() => handleSelectMeal(item)}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='my-8 justify-center flex'>
          <Button type='button' className='w-1/2' onClick={handleGenerateTrip} disabled={loading}>
            {loading ? <AiOutlineLoading3Quarters className='h-6 w-6 animate-spin' /> : 'Generate Trip'}
          </Button>
        </div>

        <Dialog open={signInFrom} onOpenChange={setSignInForm}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <div className='flex items-center'>
                  <img src='/logo.svg' alt='logo' />
                  <span className='ml-2 text-2xl font-extrabold text-[#007DFC]'>
                    AI Trip
                  </span>
                </div>
                <div className='text-center'>
                  <h2 className='text-xl font-bold mt-4 text-black'>Sign In</h2>
                  <p className='text-gray-500 text-sm'>Please sign in to continue and save your trips.</p>
                  <Button className='w-full mt-4' onClick={signIn}> <FaGoogle className="mr-2 h-6 w-6" /> Sign In with Google</Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;
