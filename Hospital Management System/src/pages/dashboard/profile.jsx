import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Image,
} from "@material-tailwind/react";
import Cookies from 'js-cookie'; // Import js-cookie

export function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    const storedEmail = Cookies.get('email');

    if (storedUsername) {
      setUsername(storedUsername);
      if (storedUsername === 'specificUsername') {
        setShowPhoto(true);
      }
    }

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
        <div className="absolute inset-0 flex items-center justify-center">
          {showPhoto && <Image src="/specific-user-photo.jpg" alt="Profile" className="h-32 w-32 rounded-full border-4 border-white" />}
        </div>
      </div>
      
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-center">
            <div>
              <Typography variant="h5" color="blue-gray" className="mb-1">
                Welcome, {username}!
              </Typography>
              <Typography variant="body" color="blue-gray">
                Email: {email}
              </Typography>
              <Typography variant="body" color="blue-gray">
                You're now logged in. Enjoy your experience!
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
