import { useState } from 'react';
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog"
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';

function Header() {
  const [signInFrom, setSignInForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

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
      window.location.reload();
    })
  }

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-12'>
      <a href='/'>
        <div className='flex items-center'>
          <img src='/logo.svg' alt='logo' />
          <span className='ml-2 text-2xl font-extrabold text-[#007DFC]'>
            AI Trip
          </span>
        </div>
      </a>
      <div>
        {user ?
          <div className='flex items-center gap-4'>
            <a href='/create-trip' >
              <Button variant='outline' className='rounded-full'>Add Trip</Button>
            </a>

            <a href='/my-trips' >
              <Button variant='outline' className='rounded-full'>My Trips</Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} alt='user' className='w-10 h-10 rounded-xl' />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>
                  Sign Out
                </h2>
              </PopoverContent>
            </Popover>
          </div>
          :
          <Button onClick={() => { setSignInForm(true) }}>Sign In</Button>
        }
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
  )
}

export default Header