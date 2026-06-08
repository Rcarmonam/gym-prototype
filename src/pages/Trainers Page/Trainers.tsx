import './Trainers.css';
import CreateWorkoutCalendarTrainer from '../../components/organisms/CreateWorkoutCalendarTrainer/CreateWorkoutCalendarTrainer.tsx';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../index.js';
import * as React from "react";
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar, Button, Field, Textarea, makeStyles,
  useId,
  Link,
  SpinButton,
  Toaster,
  useToastController,
  ToastTitle,
  Toast,
  ToastTrigger,
} from '@fluentui/react-components';
import TrainerAPI from './TrainersAPI.tsx'

const useStyles = makeStyles({
  bio: {
    height: '8rem',
  },
  save: {
    "&:hover": {
      backgroundColor: 'var(--surface3);',
    },
    fontSize: '1rem'
  },
  out: {
    "&:hover": {
      backgroundColor: 'var(--surface3);',
    },
    fontSize: '1rem',
    marginLeft: '65rem',
  }
});

const Trainers = () => {
  const [timeout, setDismissTimeout] = React.useState(1000);
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const styles = useStyles();
  const location = useLocation();
  const { trainerName } = location.state;
  const [workoutAdded, setWorkoutAdded] = useState<boolean>(false);
  const [trainer, setTrainer] = useState<any>({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (trainerName) {
        const userDocRef = doc(db, 'Trainers', trainerName);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setTrainer(userDocSnap.data());
        }
      }
    };
    fetchUserData();
  }, [trainerName]);

  const handleUpdateProfile = async () => {
    try {
      const userDocRef = doc(db, 'Trainers', trainerName);
      await updateDoc(userDocRef, {
        email: trainer.email,
        fullName: trainer.fullName,
        bio: trainer.bio,
      });
      console.log('Profile updated successfully');
      notify();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleWorkoutAdded = () => {
    setWorkoutAdded(true);
    setTimeout(() => {
      setWorkoutAdded(false);
    }, 1000);
    notify();
  };

  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle
          action={
            <ToastTrigger>
              <Link>Dismiss</Link>
            </ToastTrigger>
          }
        >
          {timeout >= 0 ? `Saved successfully` : `Dismiss manually`}
        </ToastTitle>
      </Toast>,
      { timeout, intent: "info" }
    );

  return (
    <div className="TrainerPageContainer">
      <div className="top-container-trainers">
        Welcome {trainerName} !
        <div>
          <RouterLink to="/">
            <Button className={styles.out} >Sign Out</Button>
          </RouterLink>
        </div>
      </div>
      <div className='bottom-container-trainers'>
        <div>
          <TrainerAPI />
        </div>
        <div className='trainer-profile-trainers'>
          <div className='trainer-profile-picture-trainers'>
            <div className='actual-avatar'>
              <Avatar
                size={128}
                active="active"
                activeAppearance="ring-shadow"
                image={{
                  src: trainer.imageCircle,
                  alt: `${trainer.firstName}'s profile picture`
                }}
              />
            </div>
          </div>
          <div >
            <Field label="Full Name" className='trainers-input'>
              <Textarea
                placeholder={trainer.fullName}
                onChange={(e) => setTrainer({ ...trainer, fullName: e.target.value })}
              />
            </Field>
            <Field label="Email" className='trainers-input'>
              <Textarea
                placeholder={trainer.email}
                onChange={(e) => setTrainer({ ...trainer, email: e.target.value })}
              />
            </Field>
            <Field label="Bio" size="large" className='trainers-input'>
              <Textarea
                className={styles.bio}
                placeholder={trainer.bio}
                onChange={(e) => setTrainer({ ...trainer, bio: e.target.value })}
              />
            </Field>
          </div>
          <div className='buttons-trainers'>
            <Button className={styles.save} onClick={handleUpdateProfile}>Save Changes</Button>
            <CreateWorkoutCalendarTrainer
              setWorkoutAdded={handleWorkoutAdded}
              workoutAdded={workoutAdded}
              trainerName={trainerName}
            />
          </div>
          <Toaster toasterId={toasterId} />
        </div>
      </div>
    </div>
  );
};

export default Trainers;
