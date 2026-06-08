import {
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarIntent,
} from '@fluentui/react-components';
import GenButton from '../../Buttons/GeneralButton/generalButton.tsx';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../index.js';
import './PaymentInfo.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../AuthContext.tsx';

const PaymentInfo = () => {
  // State to store input values
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Separate error states for each field
  const [fullNameError, setFullNameError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expirationDateError, setExpirationDateError] = useState('');
  const [cvcError, setCvcError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');

  // MessageBar state hooks
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [messageBarContent, setMessageBarContent] = useState({
    message: '',
    intent: 'success' as MessageBarIntent,
  });

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const validateFields = () => {
    const errors = {
      fullName: '',
      cardNumber: '',
      expirationDate: '',
      cvc: '',
      postalCode: '',
    };

    let hasError = false;

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
      hasError = true;
    }
    if (!cardNumber.trim() || cardNumber.length !== 16) {
      errors.cardNumber = 'Please enter a valid Card Number.';
      hasError = true;
    }
    if (!cvc.trim()) {
      errors.cvc = 'CVC is required.';
      hasError = true;
    }
    if (!postalCode.trim()) {
      errors.postalCode = 'Postal Code is required.';
      hasError = true;
    }
    if (!expirationDate.trim()) {
      errors.expirationDate = 'Expiration Date is required.';
      hasError = true;
    }

    // Update error states
    setFullNameError(errors.fullName);
    setCardNumberError(errors.cardNumber);
    setCvcError(errors.cvc);
    setExpirationDateError(errors.expirationDate);
    setPostalCodeError(errors.postalCode);

    if (hasError) {
      // Update message bar for error feedback
      setMessageBarContent({
        message: 'Please correct the errors!',
        intent: 'error',
      });
      setShowMessageBar(true);
    }

    // Return true if there are no errors
    return !hasError;
  };

  const handlePaymentInfo = async () => {
    if (!validateFields()) {
      return;
    }

    if (!currentUser) return;

    const userRef = doc(db, 'customers', currentUser.uid);

    try {
      await updateDoc(userRef, {
        cardNumber: cardNumber,
        expirationDate: expirationDate,
        cvc: cvc,
        postalCode: postalCode,
      });
      console.log('Membership updated successfully');
      navigate('/TrackerDashboard');
    } catch (error) {
      console.error('Error updating payment info: ', error);
      setMessageBarContent({
        message: 'Error updating payment information. Please try again!',
        intent: 'error',
      });
      setShowMessageBar(true);
    }
  };

  return (
    <form className="Pay-form" onSubmit={handlePaymentInfo}>
      <div>
        {showMessageBar && (
          <MessageBar intent={messageBarContent.intent}>
            <MessageBarBody>
              <MessageBarTitle>
                {messageBarContent.intent.charAt(0).toUpperCase() +
                  messageBarContent.intent.slice(1)}
              </MessageBarTitle>
              {messageBarContent.message}
            </MessageBarBody>
          </MessageBar>
        )}
      </div>

      <div className="name-field">
        <Field
          label={fullNameError ? 'First Name *' : 'Name on Card'}
          validationMessage={fullNameError}
        >
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() =>
              !fullName.trim() && setFullNameError('First name is required.')
            }
          />
        </Field>
      </div>

      <div className="card-number-field">
        <Field
          label={cardNumberError ? 'Card Number *' : 'Card Number'}
          validationMessage={cardNumberError}
        >
          <Input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            onBlur={() =>
              !cardNumber.trim() &&
              setCardNumberError('Card Number is required.')
            }
          />
        </Field>
      </div>

      <div className="card-info-field">
        <div className="exp-num">
          <Field
            label={expirationDateError ? 'Expiration*' : 'Expiration (MM/YY)'}
            validationMessage={expirationDateError}
          >
            <Input
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              onBlur={() =>
                !expirationDate.trim() &&
                setExpirationDateError('Expiration Date is required.')
              }
            />
          </Field>
        </div>
        <div className="cvc">
          <Field
            label={cvcError ? 'CVC *' : 'CVC'}
            validationMessage={cvcError}
          >
            <Input
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              onBlur={() => !cvc.trim() && setCvcError('CVC is required')}
            />
          </Field>
        </div>
      </div>

      <div className="postal-code-field">
        <Field
          label={postalCodeError ? 'Postal Code *' : 'Postal Code'}
          validationMessage={postalCodeError}
        >
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            onBlur={() =>
              !postalCode.trim() &&
              setPostalCodeError('Postal Code is required.')
            }
          />
        </Field>
      </div>

      <div className="log-button">
        <GenButton
          text="Purchase Membership"
          styleType="style2"
          buttonSize="medium"
          onClick={handlePaymentInfo}
          width="100%"
        />
      </div>
    </form>
  );
};
export default PaymentInfo;
