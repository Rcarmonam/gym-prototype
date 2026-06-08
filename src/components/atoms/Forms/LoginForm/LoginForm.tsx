import { useEffect, useState } from 'react';
import './LoginForm.css';
import { Field, Input, MessageBar, MessageBarTitle, MessageBarBody, MessageBarIntent } from '@fluentui/react-components';
import GenButton from '../../Buttons/GeneralButton/generalButton.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../../../AuthContext.tsx';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { db } from '../../../../index.js';
import Trainers from '../../../../pages/Trainers Page/Trainers.tsx';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showMessageBar, setShowMessageBar] = useState(false);
  const [messageBarContent, setMessageBarContent] = useState({ message: '', intent: 'info' as MessageBarIntent });
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/TrackerDashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const auth = getAuth();

    if (!email || (!password && !email.endsWith("@PowerPit.com"))) {
      setEmailError('Email is required.');
      setPasswordError('Password is required.');
      setShowMessageBar(true);
      setMessageBarContent({ message: 'Email and password are required.', intent: 'error' });
      return;
    }

    try {
      if (email.endsWith("@PowerPit.com")) {
        // Manager check
        const isManager = await checkIfManager(email);
        if (isManager) {
          navigate('/Manager');
        } else {
          setEmailError('Access denied for manager.');
          setPasswordError('Access denied for manager.');
          setShowMessageBar(true);
          setMessageBarContent({ message: 'Not authorized as a manager.', intent: 'error' });
        }
      }
      else if (email.endsWith("@PowerTrainer.com")) {
        // Trainer check
        const isTrainer = await checkIfTrainer(email);
        if (isTrainer) {
          navigateToTrainersPage();
        } else {
          setEmailError('Access denied for trainer.');
          setPasswordError('Access denied for trainer.');
          setShowMessageBar(true);
          setMessageBarContent({ message: 'Not authorized as a trainer.', intent: 'error' });
        }
      }
      else {
        // Customer membership check
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          // User successfully authenticated
          const userRef = doc(db, 'customers', userCredential.user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data().membershipType) {
            navigate('/TrackerDashboard');
          } else {
            navigate('/ChooseMembership');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setEmailError('Invalid email');
      setPasswordError('Invalid password');
      setShowMessageBar(true);
      setMessageBarContent({ message: 'Login failed. Please try again.', intent: 'error' });
    }
  };
  
  const checkIfManager = async (email: string): Promise<boolean> => {
    const db = getFirestore();
    const managersRef = collection(db, "Managers");
    const q = query(managersRef, where("Email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Returns true if the manager is found
  };

  const checkIfTrainer = async (email: string): Promise<boolean> => {
    const db = getFirestore();
    const trainersRef = collection(db, "Trainers");
    const q = query(trainersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Returns true if the trainer is found
  };

  const navigateToTrainersPage = async () => {
      const db = getFirestore();
      const trainersRef = collection(db, "Trainers");
      const q = query(trainersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q); 
      const currTrainer = querySnapshot.docs[0].data();
      const trainerName = currTrainer.firstName;
      console.log("This is in Log in Form",trainerName)
      navigate('/Trainers', { state: { trainerName } });
  }
  
  return (
    <form className="login-form">
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
      <div className="forgot-password">
        <Link to="/ForgotPassword" className="forgot-password-link">
          Forgot Password?
        </Link>
      </div>
      <div className="logIn-button">
        <GenButton
          text="Log in"
          styleType="style2"
          buttonSize="large"
          width="100%"
          onClick={(event: { preventDefault: () => void }) =>
            handleLogin(event)
          }
        />
      </div>
    </form>
  );
};

export default LoginForm;