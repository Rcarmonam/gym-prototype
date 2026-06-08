import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './index.js';

interface MembershipProtectedRouteProps {
  children: React.ReactNode;
}

const MembershipProtectedRoute: React.FC<MembershipProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      if (!currentUser) {
        setIsChecked(true);
        return;
      }

      const userRef = doc(db, 'customers', currentUser.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const hasMembership = userData.membershipType && userData.membershipType !== '';
          setIsMember(hasMembership);
        } else {
          console.log("No such document!");
          setIsMember(false);
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
        setIsMember(false);
      } finally {
        setIsChecked(true);
      }
    };

    fetchMembershipStatus();
  }, [currentUser]);

  if (!isChecked) {
    return <div>Checking authentication and membership...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/Login" replace />;
  } else if (!isMember) {
    return <Navigate to="/ChooseMembership" replace />;
  }

  return <>{children}</>;
};

export default MembershipProtectedRoute;