import { useState } from 'react';
import './ForgotPassForm.css';
import {
  Field,
  Input,
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
  MessageBarIntent,
} from '@fluentui/react-components';
import GenButton from '../../Buttons/GeneralButton/generalButton.tsx';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [messageBarContent, setMessageBarContent] = useState({
    message: '',
    intent: 'info' as MessageBarIntent,
  });

  const handleResetPassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!email) {
      setEmailError('Email is required.');
      return;
    }

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessageBarContent({
          message: 'Password reset email sent.',
          intent: 'success',
        });
        setShowMessageBar(true);
      })
      .catch((error: any) => {
        setEmailError('Invalid email. Please try again.');
        setMessageBarContent({
          message: 'Failed to send password reset email.',
          intent: 'error',
        });
        setShowMessageBar(true);
      });
  };

  return (
    <form className="forgot-form">
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
      <Field
        label={emailError ? 'Email *' : 'Email'}
        size="large"
        validationMessage={emailError}
      >
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <div className="forgot-button">
        <GenButton
          text="Reset Password"
          styleType="style2"
          buttonSize="medium"
          width="100%"
          onClick={handleResetPassword}
        />
      </div>
    </form>
  );
};

export default ForgotPassForm;
