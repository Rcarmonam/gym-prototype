import React, { useState, useRef, useEffect } from 'react';
import './sideBar.css';
import dumbBell from '../../../assets/DumbBell.svg';
import {
  DataBarVerticalAscending16Filled,
  CalendarLtr28Filled,
  Food24Filled,
} from '@fluentui/react-icons';
import { useAuth } from '../../../AuthContext.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../index.js';

interface SideBarProps {
  onPageChange: (page: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onPageChange }) => {
  const [activeIcon, setActiveIcon] = useState<string>('');
  const [circleTop, setCircleTop] = useState<string>('0px');
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { currentUser } = useAuth();
  const [membershipType, setMembershipType] = useState<string>('');
  const [visibleIconsCount, setVisibleIconsCount] = useState(0);

  useEffect(() => {
    const fetchMembershipType = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'customers', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setMembershipType(userData.membershipType);
  
          let count = 0;
          if (userData.membershipType === 'Ultimate Power') {
            count = 4;
          } else if (userData.membershipType === 'Power Boost') {
            count = 3;
          } else if (userData.membershipType === 'Starter Power') {
            count = 2;
          }
          setVisibleIconsCount(count);
        }
      }
    };
  
    fetchMembershipType();
  }, [currentUser]); // Removed membershipType from dependency array
  

  const handleNavigation = (path: string, index: number) => {
    onPageChange(path);
    setActiveIcon(path);
    const iconRef = iconRefs.current[index];
    if (iconRef) {
      const adjustmentValue = (iconRef.offsetHeight - 46) / 2;
      const newTop = iconRef.offsetTop + adjustmentValue + 'px';
      setCircleTop(newTop);
    }
  };

  const isIconVisible = (path: string) => {
    switch (path) {
      case '/Tracker':
        return membershipType === 'Ultimate Power' || membershipType === 'Power Boost' || membershipType === 'Starter Power';
      case '/FitnessCalendar':
        return membershipType === 'Ultimate Power' || membershipType === 'Power Boost' || membershipType === 'Starter Power';
      case '/FitnessPlans':
        return membershipType === 'Ultimate Power' || membershipType === 'Power Boost';
      case '/Nutrition':
        return membershipType === 'Ultimate Power';
      default:
        return false;
    }
  };

  return (
    <aside>
      <div className="side-bar">
      <div className="side-bar-icons" style={{ height: `${visibleIconsCount * 3.35}rem` }}>
          <div className="circle" style={{ top: circleTop }}></div>
          {isIconVisible('/Tracker') && (
            <div
              className={`data-bar ${activeIcon === '/Tracker' ? 'active' : ''}`}
              onClick={() => handleNavigation('/Tracker', 0)}
              ref={el => iconRefs.current[0] = el}
            >
              <DataBarVerticalAscending16Filled />
            </div>
          )}
          {isIconVisible('/FitnessCalendar') && (
            <div
              className={`calendar ${activeIcon === '/FitnessCalendar' ? 'active' : ''}`}
              onClick={() => handleNavigation('/FitnessCalendar', 1)}
              ref={el => iconRefs.current[1] = el}
            >
              <CalendarLtr28Filled />
            </div>
          )}
          {isIconVisible('/FitnessPlans') && (
            <div
              className={`dumb-bell ${activeIcon === '/FitnessPlans' ? 'active' : ''}`}
              onClick={() => handleNavigation('/FitnessPlans', 2)}
              ref={el => iconRefs.current[2] = el}
            >
              <img src={dumbBell} alt="Dumbbell" />
            </div>
          )}
          {isIconVisible('/Nutrition') && (
            <div
              className={`food ${activeIcon === '/Nutrition' ? 'active' : ''}`}
              onClick={() => handleNavigation('/Nutrition', 3)}
              ref={el => iconRefs.current[3] = el}
            >
              <Food24Filled />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;