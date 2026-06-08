import './PaymentCheckout.css';
import NavBar from '../../components/organisms/NavbarOut/navbarOut.tsx';
import accPic from '../../assets/CreatePic.svg';
import PaymentInfo from '../../components/atoms/Forms/PaymentInfoForm/PaymentInfo.tsx';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PaymentCheckout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const membershipType = queryParams.get('membershipType');
  const price = queryParams.get('price');
  const numericPriceString = price ? price.replace(/[^0-9.]/g, '') : ''; // add null check for 'price' variable
  const priceNum = parseFloat(numericPriceString);
  let membershipISChosen = false;
  const enrollmentFee = 20.0;
  const tax = parseFloat(((priceNum + enrollmentFee) * 0.08).toFixed(2));

  // function to display specific information depending on chosen membership
  const getMembershipMessage = () => {
    switch (membershipType) {
      case 'Power Boost':
        membershipISChosen = true;
        return '  - Commit to Fit!';
      case 'Starter Power':
        membershipISChosen = true;
        return "  - It's on Us!";
      case 'Ultimate Power':
        membershipISChosen = true;
        return '  - Peak Performance!';
      default:
        return 'Please select a Membership type.';
    }
  };
  const getCommitmentInfo = () => {
    switch (membershipType) {
      case 'Power Boost':
        return '   with a 12-month commitment';
      case 'Starter Power':
        return '   Upgrade anytime!';
      case 'Ultimate Power':
        return '   with a 12-month commitment';
      default:
        return 'Please select a Membership type.';
    }
  };

  return (
    <div className="payment-page">
      <NavBar />
      <div className="payment-big-container">
        <div className="payment-small-container">
          <div className="payment-summary">
            <div className="membership-container">
              <div className="pricing-membership">
                <div className="membership-type">
                  {membershipType}
                  {getMembershipMessage()}
                </div>
                <div className="price-terms">
                  {price}
                  {getCommitmentInfo()}
                </div>
                <div className="choose-membership-return">
                  <Link to="/chooseMembership" className="link-text">
                    Return to Choose Membership
                  </Link>
                </div>
              </div>
            </div>
            <div className="pricing-container">
              <div className="pricing-prices">
                <div className="monthly-fee">
                  Monthly fee <span className="pay-value">${priceNum}</span>
                </div>
                <div className="enrollment-fee">
                  Enrollment fee{' '}
                  <span className="pay-value">${enrollmentFee}</span>
                </div>
                <div className="taxes">
                  Taxes <span className="pay-value">${tax}</span>
                </div>
                <div className="total">
                  Total{' '}
                  <span className="pay-value">
                    ${priceNum + enrollmentFee + tax}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="billing-info-title">
            Payment & Billing Information
          </div>
          <div className="checkout-form">
            <PaymentInfo/>
          </div>
        </div>
      </div>

      <div className="acc-second-Box">
        <div className="image-caption">
          <div className="big-caption">
            REVIEW AND <br />
            PAY
          </div>
        </div>
        <img src={accPic} alt="accPic" className="accPic-image" />
      </div>
    </div>
  );
};

export default PaymentCheckout;
