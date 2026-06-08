import { useState } from 'react';
import './ChooseMembership.css';
import accPic from '../../assets/CreatePic.svg';
import MembershipButton from '../../components/atoms/Buttons/GeneralButton/generalButton.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.tsx';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../index.js';

const ChooseMembership = () => {
  const { currentUser } = useAuth();

  const [selectedMembership, setSelectedMembership] = useState('');
  const [membershipPrice, setMembershipPrice] = useState('');
  const navigate = useNavigate();

  const handleMembershipSelection = (membershipType: any, price: any) => {
    setSelectedMembership(membershipType);
    setMembershipPrice(price);
  };

  const saveMembershipSelection = async () => {
    if (!currentUser) return;

    const userRef = doc(db, 'customers', currentUser.uid);
    const user = (await getDoc(userRef)).data();
    try {
      await updateDoc(userRef, {
        age: user!.age,
        email: user!.email,
        firstName: user!.firstName,
        lastName: user!.lastName,
        genderValue: user!.genderValue,
        membershipType: selectedMembership,
        price: membershipPrice,
      });
      console.log('Membership updated successfully');
      navigate(
        `/PaymentCheckout?membershipType=${encodeURIComponent(
          selectedMembership
        )}&price=${encodeURIComponent(membershipPrice)}`
      );
      // navigate('/PaymentCheckout');
      console.log('Navigated to CreateAcc');
    } catch (error) {
      console.error('Error updating membership: ', error);
    }
  };

  const isSelected = (membershipType: string) =>
    selectedMembership === membershipType;

  return (
    <div className="full-page">
      <div className="form-big-container">
        <div className="form-small-container">
          <div className="header-text-box">
            <div className="acc-welcome">
              Choose your Power Pit <br /> Membership
            </div>
          </div>
          <div className="membership-options">
            <div
              className={`first-membership ${
                isSelected('Starter Power') ? 'selected' : ''
              }`}
              onClick={() =>
                handleMembershipSelection('Starter Power', '$0.00/year')
              }
            >
              <div className="membership-header">
                Starter Power - It’s on Us
              </div>
              <div className="membership-description">
                Embark on your fitness quest—free! Upgrade anytime
              </div>
              <div className="membership-price">$0.00/year</div>
            </div>
            <div
              className={`second-membership ${
                isSelected('Power Boost') ? 'selected' : ''
              }`}
              onClick={() =>
                handleMembershipSelection('Power Boost', '$19.99/month')
              }
            >
              <div className="membership-header">
                Power Boost - Commit to Fit
              </div>
              <div className="membership-description">
                Elevate your training with exclusive features. <br /> 12-month
                commitment.
              </div>
              <div className="membership-price">$19.99/month</div>
            </div>

            <div
              className={`third-membership ${
                isSelected('Ultimate Power') ? 'selected' : ''
              }`}
              onClick={() =>
                handleMembershipSelection('Ultimate Power', '$29.99/month')
              }
            >
              <div className="membership-header">
                Ultimate Power - Peak Performance
              </div>
              <div className="membership-description">
                Exclusive access to all features and personalized plans.
                12-month commitment.
              </div>
              <div className="membership-price">$29.99/month</div>
            </div>
          </div>
        </div>

        <div className="next-button">
          <MembershipButton
            text="Next"
            onClick={saveMembershipSelection}
            styleType="style2"
            buttonSize="large"
            width="10rem"
          />
        </div>
      </div>

      <div className="acc-second-Box">
        <div className="image-caption">
          <div className="big-caption">PEAK FITNESS. UNBEATABLE RESULTS.</div>
          <div className="little-caption">
            Join to transform your fitness journey with tailored workouts,
            relentless tracking, and a community that fuels your triumph.
          </div>
        </div>
        <img src={accPic} alt="accPic" className="accPic-image" />
      </div>
    </div>
  );
};

export default ChooseMembership;
