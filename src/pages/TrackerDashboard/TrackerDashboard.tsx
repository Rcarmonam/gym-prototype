import './TrackerDashboard.css';
import NavBar from '../../components/organisms/NavbarIn/navbarIn.tsx';
import SideBar from '../../components/organisms/sideBar/sideBar.tsx';
import Tracker from '../../components/organisms/TrackerPages/Tracker Page/Tracker.tsx';
import FitnessCalendar from '../../components/organisms/TrackerPages/FitnessCalendar/FitnessCalendar.tsx';
import FitnessPlans from '../../components/organisms/TrackerPages/FitnessPlans/FitnessPlans.tsx';
import Nutrition from "../../components/organisms/TrackerPages/Nutrition/Nutrition.tsx";
import { memo, useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../index.js';

const TrackerDashboard = () => {
  const [currentPage, setCurrentPage] = useState('/Tracker');
  const { currentUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [membershipType, setMembershipType] = useState('');
  const [price, setPrice] = useState(''); 
  const MemoizedNavBar = memo(NavBar);

  // Fetch user data from Firestore
  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'customers', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        // If user document exists, set user data
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
          setAge(userData.age);
          setGender(userData.genderValue);
          setMembershipType(userData.membershipType); // Set the membership type
          setLoaded(true);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Handle page change
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  // Update user info function
  const updateUserInfo = (updatedInfo: {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    gender: string;
    price: string;
  }) => {
    setFirstName(updatedInfo.firstName);
    setLastName(updatedInfo.lastName);
    setEmail(updatedInfo.email);
    setAge(updatedInfo.age);
    setGender(updatedInfo.gender);
    setPrice(updatedInfo.price);
  };

  return (
    <div className="TrackerDashboard">
<MemoizedNavBar
        firstName={firstName}
        lastName={lastName}
        email={email}
        age={age}
        gender={gender}
        setLoaded={setLoaded}
        updateUserInfo={updateUserInfo}
        membershipType={membershipType}
        price={price}
      />
      <SideBar onPageChange={handlePageChange} />
      <div>
        {currentPage === '/Tracker' && <Tracker firstName={firstName}/>}
        {currentPage === '/FitnessCalendar' && <FitnessCalendar />}
        {currentPage === '/FitnessPlans' && <FitnessPlans />}
        {currentPage === '/Nutrition' && <Nutrition />}
      </div>
    </div>
  );
};

export default TrackerDashboard;