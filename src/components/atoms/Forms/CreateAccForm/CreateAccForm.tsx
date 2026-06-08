import { useState } from 'react';
import './CreateAccForm.css';
import {
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarIntent,
  Dropdown,
  Option,
  makeStyles,
  Text,
} from '@fluentui/react-components';
import GenButton from '../../Buttons/GeneralButton/generalButton.tsx';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../index.js';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    marginBottom: '0.5rem',
    color: 'var(--fontColor)',
    fontWeight: 500,
    fontSize: '1rem',
    paddingLeft: '0.1rem',
  },
  errorMessage: {
    color: '#D27F81',
    fontSize: '0.8rem',
    fontWeight: 400,
    marginTop: '4px',
    paddingLeft: '0.1rem',
  },
});

const CreateAccForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGenderOption, setSelectedGenderOption] = useState<string[]>(["not-specified"]);
  const [genderValue, setGenderValue] = useState<string>('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const styles = useStyles();

  // Separate error states for each field
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [ageError, setAgeError] = useState('');
  // MessageBar state hooks
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [messageBarContent, setMessageBarContent] = useState({
    message: '',
    intent: 'success' as MessageBarIntent,
  });

  const navigate = useNavigate();
  const validateFields = () => {
    const errors = {
      firstName: '',
      lastName: '',
      gender: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    let hasError = false;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
      hasError = true;
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
      hasError = true;
    }
    if (!genderValue) {
      errors.gender = 'Gender is required.';
      hasError = true;
    }
    if (!age.trim()) {
      errors.age = 'Age is required.';
      hasError = true;
    }
    if (!email.trim()) {
      errors.email = 'Email is required.';
      hasError = true;
    }
    if (!password) {
      errors.password = 'Password is required.';
      hasError = true;
    }
    if (password && !confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
      hasError = true;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
      hasError = true;
    }

    // Update error states
    setFirstNameError(errors.firstName);
    setLastNameError(errors.lastName);
    setGenderError(errors.gender);
    setAgeError(errors.age);
    setEmailError(errors.email);
    setPasswordError(errors.password);
    setConfirmPasswordError(errors.confirmPassword);

    if (hasError) {
      // Update message bar for error feedback
      setMessageBarContent({ message: 'Please try again!', intent: 'error' });
      setShowMessageBar(true);
    }

    // Return true if there are no errors
    return !hasError;
  };

  const handleGenderChange = (_event: any, option: any) => {
    _event.preventDefault();
    setSelectedGenderOption([...option.selectedOptions])
    setGenderValue(option.selectedOptions[0]);
  };

  // Function to handle account creation
  const handleCreateAccount = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!validateFields()) {
      console.log('Validation failed');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Set displayName using updateProfile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'customers', user.uid), {
        firstName,
        lastName,
        email,
        age,
        genderValue,
      });

      // Update message bar for success feedback
      setMessageBarContent({
        message: 'Account created successfully. Redirecting...',
        intent: 'success',
      });
      setShowMessageBar(true);

      // Redirect to Tracker page after a short delay
      setTimeout(() => {
        navigate('/ChooseMembership');
      }, 1000);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address.');
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError(
          'Password should be at least 6 characters and contain a mix of letters and numbers.'
        );
      }
      console.error('Error creating user:', error);
      setMessageBarContent({ message: 'Please try again!', intent: 'error' });
      setShowMessageBar(true);
    }
  };
  return (
    <form className="Acc-form" onSubmit={handleCreateAccount}>
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
      <div className="name-fields">
        <Field
          label={firstNameError ? 'First Name *' : 'First Name'}
          size="large"
          validationMessage={firstNameError}
        >
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() =>
              !firstName.trim() && setFirstNameError('First name is required.')
            }
          />
        </Field>
        <Field
          label={lastNameError ? 'Last Name *' : 'Last Name'}
          size="large"
          validationMessage={lastNameError}
        >
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() =>
              !lastName.trim() && setLastNameError('Last name is required.')
            }
          />
        </Field>
      </div>
      <div className="demographic-fields">
        <Field
          label={ageError ? 'Age *' : 'Age'}
          size="large"
          validationMessage={ageError}
        >
          <Input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onBlur={() => !age.trim() && setAgeError('Age is required.')}
          />
        </Field>

        <div className={styles.fieldContainer}>
          <label className={styles.name}>Gender</label>
          <Dropdown
            size="large"
            placeholder="Select an option"
            onOptionSelect={handleGenderChange}
            onBlur={() => !genderValue}
            selectedOptions={selectedGenderOption}
          >
            <Option value="female" text="Female">
              <Text>Female</Text>
            </Option>
            <Option value="male" text="Male">
              <Text>Male</Text>
            </Option>
            <Option value="not-specified" text="Prefer not to say">
              <Text>Prefer not to say</Text>
            </Option>
          </Dropdown>
          <div className={styles.errorMessage}>{genderError}</div>
        </div>
      </div>

      <Field
        label={emailError ? 'Email *' : 'Email'}
        size="large"
        validationMessage={emailError}
      >
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field
        label={passwordError ? 'Password *' : 'Password'}
        size="large"
        validationMessage={passwordError}
      >
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Field
        label={confirmPasswordError ? 'Confirm Password *' : 'Confirm Password'}
        size="large"
        validationMessage={confirmPasswordError}
      >
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Field>
      <div className="log-button">
        <GenButton
          text="Create Account"
          styleType="style2"
          buttonSize="large"
          onClick={(event: { preventDefault: () => void }) =>
            handleCreateAccount(event)
          }
          width="100%"
        />
      </div>
    </form>
  );
};
export default CreateAccForm;
