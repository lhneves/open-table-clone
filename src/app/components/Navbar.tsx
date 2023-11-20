'use client';

import Link from 'next/link';
import AuthModal from './AuthModal';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import useAuth from '../../hooks/useAuth';

export default function NavBar() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();

  const handleOpen = (isSignIn: boolean) => {
    isSignIn ? setIsSignInModalOpen(true) : setIsSignUpModalOpen(true);
  };

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button
                className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
                onClick={signout}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className={`bg-blue-400 text-white border p-1 px-4 rounded mr-3`}
                  onClick={() => handleOpen(true)}
                >
                  Sign In
                </button>
                <button
                  className={`border p-1 px-4 rounded mr-3`}
                  onClick={() => handleOpen(false)}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
        <AuthModal
          open={isSignInModalOpen}
          handleClose={() => setIsSignInModalOpen(false)}
          isSignin={true}
        />
        <AuthModal
          open={isSignUpModalOpen}
          handleClose={() => setIsSignUpModalOpen(false)}
          isSignin={false}
        />
      </div>
    </nav>
  );
}
