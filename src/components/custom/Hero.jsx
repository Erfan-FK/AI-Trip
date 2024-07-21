import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-4'>
        <h1 className='text-[65px] font-extrabold text-center'>Unlock Your Ultimate Journey with <span className='text-[#007DFC]'>AI</span></h1>
        <p className='text-l text-gray-500 text-center' >Craft, customize, and enhance your travel plans effortlessly with advanced AI trip planner. Tailored for vacations, workations, and all your explorations.</p>
        
        <Link to='/create-trip'>
            <Button>Create A Trip</Button>
        </Link>

        <img src='/trip.webp' className='h-[350px] w-[400x]'/>
    </div>
  )
}

export default Hero