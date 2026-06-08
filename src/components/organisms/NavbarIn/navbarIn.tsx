import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import avatar from '../../../assets/Avatar.svg';
import './navbarIn.css';
import { Avatar } from '@fluentui/react-components';
import {
  Person24Regular,
  Settings24Regular,
  CalendarLtr24Regular,
  ArrowExit20Filled,
} from '@fluentui/react-icons';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { useAuth } from '../../../AuthContext.tsx';
import {
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  TextField,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import bear from '../../../assets/bear.png';
import cat from '../../../assets/cat.png';
import chicken from '../../../assets/chicken.png';
import dog from '../../../assets/dog.png';
import gamer from '../../../assets/gamer.png';
import panda from '../../../assets/panda.png';
import rabbit from '../../../assets/rabbit.png';
import user from '../../../assets/user.png';
import woman from '../../../assets/woman.png';
import woman2 from '../../../assets/woman2.png';
import ChatBotButton from '../../../components/atoms/ChatBot/ChatBotButton.tsx';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../index.js';

interface NavbarInProps {
  firstName: string;
  lastName: String;
  email: string;
  setLoaded: any;
  gender: string;
  age: string;
  updateUserInfo: (updatedInfo: {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    gender: string;
    membershipType: string;
    price: string;
  }) => void;
  membershipType: string;
  price: string;
}


const defaultAvatars = [
  bear,
  cat,
  chicken,
  dog,
  gamer,
  panda,
  rabbit,
  user,
  woman,
  woman2,
];

const NavbarIn: React.FC<NavbarInProps> = ({
  firstName,
  lastName,
  email,
  setLoaded,
  gender,
  age,
  updateUserInfo,
  membershipType,
  price,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || avatar);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedFirstName, setUpdatedFirstName] = useState(firstName);
  const [updatedLastName, setUpdatedLastName] = useState(lastName);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [updatedAge, setUpdatedAge] = useState(age);
  const [updatedGender, setUpdatedGender] = useState(gender);
  const [isProfilePictureDialogOpen, setIsProfilePictureDialogOpen] = useState(false);
  const [isAccountInfoDialogOpen, setIsAccountInfoDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(MessageBarType.info);
  const [showToast, setShowToast] = useState(false);
  const [isUpgradePlanDialogOpen, setIsUpgradePlanDialogOpen] = useState(false);

  const handleUpgradePlan = async () => {
    try {
      if (currentUser) {
        const userDocRef = doc(db, 'customers', currentUser.uid);
        await updateDoc(userDocRef, {
          membershipType: 'Ultimate Power',
          price: '$29.99/month',
        });
        setIsUpgradePlanDialogOpen(false);
        showNotification('Plan upgraded successfully!', MessageBarType.success);
        
        // Fetch the updated user data from Firestore
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          updateUserInfo({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            age: userData.age,
            gender: userData.gender,
            membershipType: userData.membershipType,
            price: userData.price,
          });
        }
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      showNotification('Failed to upgrade plan. Please try again.', MessageBarType.error);
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const showNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const [visibleChatBot, setVisibleChatBot] = useState(false);

  useEffect(() => {
    const fetchMembershipType = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'customers', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.membershipType === 'Ultimate Power') {
            setVisibleChatBot(true);
          }
        }
      }
    };

    fetchMembershipType();
  }, [currentUser]);

  // useOutsideClick hook to close the dropdown when clicking outside of it
  function useOutsideClick(ref: any, callback: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref, callback]);
  }

  const handleAvatarSelection = (avatar: string) => {
    // Update the avatar in the application state
    setPhotoURL(avatar);

    // Update the avatar in the backend database
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, {
        photoURL: avatar,
      })
        .then(() => {
          showNotification('Avatar updated successfully!', MessageBarType.success);
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          showNotification('Failed to update avatar. Please try again.', MessageBarType.error);
        });
    }
  };

  const [photo, setPhoto] = useState<File | null>(null);
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Create a state variable for loading
  const [isLoading, setIsLoading] = useState(false);

  const toggleSettingsDialog = () => {
    setIsSettingsDialogOpen(!isSettingsDialogOpen);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Check if a file was selected
    if (photo) {
      // Set isLoading to true before starting the upload
      setIsLoading(true);

      // Upload the photo to Firebase Storage
      const storage = getStorage();
      const uniqueName = `${photo.name}_${Date.now()}`;

      const storageRef = ref(storage, 'User-photo/' + uniqueName);
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle the upload progress
        },
        (error) => {
          // Handle unsuccessful uploads
          // Set isLoading to false if an error occurs
          setIsLoading(false);
          showNotification('Failed to upload profile picture. Please try again.', MessageBarType.error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            // Update the user profile with the new photo URL
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
              updateProfile(user, {
                photoURL: downloadURL,
              })
                .then(() => {
                  // Profile updated!
                  // Update the avatar in the navbar
                  setPhotoURL(downloadURL);
                  // Set isLoading to false after the operation is complete
                  // Add a delay of 3 seconds (3000 milliseconds)
                  setTimeout(() => setIsLoading(false), 3000);
                  showNotification('Profile picture updated successfully!', MessageBarType.success);
                })
                .catch((error) => {
                  // An error occurred
                  // Set isLoading to false if an error occurs
                  setIsLoading(false);
                  showNotification('Failed to update profile picture. Please try again.', MessageBarType.error);
                });
            }
          });
        }
      );
    }
  };

  const handleSaveAccountInfo = async () => {
    try {
      if (currentUser) {
        const userDocRef = doc(db, 'customers', currentUser.uid);
        await updateDoc(userDocRef, {
          firstName: updatedFirstName,
          lastName: updatedLastName,
          email: updatedEmail,
          age: updatedAge,
          gender: updatedGender,
        });
        setIsAccountInfoDialogOpen(false);
        showNotification('Account information updated successfully!', MessageBarType.success);
        updateUserInfo({
          firstName: updatedFirstName,
          lastName: updatedLastName,
          email: updatedEmail,
          age: updatedAge,
          gender: updatedGender,
        });
      }
    } catch (error) {
      console.error('Error updating account info:', error);
      showNotification('Failed to update account information. Please try again.', MessageBarType.error);
    }
  };

  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPhotoURL(currentUser?.photoURL || avatar);
  }, [currentUser]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, [setLoaded]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Use the isLoading state during logout
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  // Display the error message if there is one
  {
    error && <p>Error: {error}</p>;
  }

  if (!currentUser) {
    return null;
  }

  if (!firstName || !email) {
    return null;
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="title">
        <RouterLink to="/TrackerDashboard" className="power-pit-text">
          POWER PIT
        </RouterLink>
      </div>

      <div className="avatar" onClick={toggleDropdown}>
        {visibleChatBot && (
          <div className="chatGPT-box-helper" onClick={(event) => {event.stopPropagation();}}>
            <ChatBotButton />
          </div>
        )}

        <Avatar
          name="Avatar"
          image={{
            src: photoURL,
          }}
          size={56}
        />

        {showDropdown && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                <Avatar
                  name="Avatar"
                  image={{
                    src: photoURL,
                  }}
                  size={40}
                />
              </div>
              <div className="user-info">
                <div className="user-name">
                  {firstName} {lastName}
                </div>
                <div className="user-email">{email}</div>
              </div>
            </div>
            <div className="dropdown-item-list">
            <div className="dropdown-item" onClick={openDialog}>
              <Person24Regular />{' '}
              <span style={{ marginLeft: '1rem' }}>My Account</span>
            </div>
            <div className="dropdown-item" onClick={toggleSettingsDialog}>
              <Settings24Regular />{' '}
              <span style={{ marginLeft: '1rem' }}>Settings</span>
            </div>
            <div className="dropdown-item">
              <CalendarLtr24Regular />{' '}
              <span style={{ marginLeft: '1rem' }}>My Fitness Calendar</span>
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              <ArrowExit20Filled />{' '}
              <span style={{ marginLeft: '1rem' }}>Log Out</span>
            </div>
          </div>
          </div>
        )}
      </div>
      <Dialog
        hidden={!isDialogOpen}
        onDismiss={closeDialog}
        dialogContentProps={{
          title: 'My Account',
          subText: 'Profile Information',
          styles: {
            title: { color: 'var(--primary1)', textAlign: 'center' },
            subText: { color: 'var(--fontColor)', textAlign: 'center' },
          },
        }}
        styles={{
          main: { backgroundColor: 'var(--background)' },
        }}
      >
        <p style={{ color: 'var(--fontColor)', textAlign: 'center' }}>
          Name: {firstName} {lastName}
        </p>
        <p style={{ color: 'var(--fontColor)', textAlign: 'center' }}>
          Email: {email}
        </p>
        <p style={{ color: 'var(--fontColor)', textAlign: 'center' }}>
          Age: {age}
        </p>
        <p style={{ color: 'var(--fontColor)', textAlign: 'center' }}>
          Gender: {gender}
        </p>
        <p style={{ color: 'var(--fontColor)', textAlign: 'center' }}>
          Membership: {membershipType}
        </p>
      </Dialog>

      <Dialog
        hidden={!isSettingsDialogOpen}
        onDismiss={toggleSettingsDialog}
        dialogContentProps={{
          title: 'Settings',
          styles: {
            title: { color: 'var(--primary1)', textAlign: 'center' },
          },
        }}
        styles={{
          main: { backgroundColor: 'var(--background)' },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <PrimaryButton
            onClick={() => {
              setIsProfilePictureDialogOpen(true);
              setIsSettingsDialogOpen(false);
            }}
            text="Change Profile Picture"
            styles={{
              root: {
                backgroundColor: 'var(--surface1)',
                color: 'var(--fontColor)',
                width: '10rem',
                height: '4rem',
                fontSize: '1rem',
              },
            }}
          />
          <PrimaryButton
            onClick={() => {
              setIsAccountInfoDialogOpen(true);
              setIsSettingsDialogOpen(false);
            }}
            text="Change Account Information"
            styles={{
              root: {
                backgroundColor: 'var(--surface1)',
                color: 'var(--fontColor)',
                width: '10rem',
                height: '4rem',
                fontSize: '1rem',
              },
            }}
          />
        </div>
        {membershipType !== 'Ultimate Power' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <PrimaryButton
              onClick={() => {
                setIsUpgradePlanDialogOpen(true);
                setIsSettingsDialogOpen(false);
              }}
              text="Upgrade Plan"
              styles={{
                root: {
                  backgroundColor: 'var(--surface1)',
                  color: 'var(--fontColor)',
                  width: '10rem',
                  height: '4rem',
                  fontSize: '1rem',
                },
              }}
            />
          </div>
        )}
      </Dialog>

      <Dialog
        hidden={!isProfilePictureDialogOpen}
        onDismiss={() => setIsProfilePictureDialogOpen(false)}
        dialogContentProps={{
          title: 'Change Profile Picture',
          styles: {
            title: { color: 'var(--primary1)', textAlign: 'center' },
          },
        }}
        styles={{
          main: { backgroundColor: 'var(--background)' },
        }}
      >
        {defaultAvatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            onClick={() => handleAvatarSelection(avatar)}
            style={{ maxWidth: '4rem', maxHeight: '4rem' }}
          />
        ))}
        <br />
        <input
          type="file"
          id="file"
          onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
          style={{ display: 'none' }}
        />
        <label htmlFor="file" className="custom-file-upload">
          Choose File
        </label>
        {isLoading && (
          <div
            style={{
              width: '100%',
              height: '0',
              paddingBottom: '75%',
              position: 'relative',
            }}
          >
            <iframe
              src="https://giphy.com/embed/3oz8xRsCP14cAnCtIA"
              width="100%"
              height="100%"
              style={{ position: 'absolute' }}
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <DialogFooter>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PrimaryButton
              onClick={handleSubmit}
              text="Save"
              styles={{
                root: {
                  backgroundColor: 'var(--surface1)',
                  color: 'var(--fontColor)',
                  marginRight: '4rem',
                },
              }}
            />
            <DefaultButton onClick={() => setIsProfilePictureDialogOpen(false)}
              text="Cancel"
              styles={{
              root: {
              backgroundColor: 'var(--surface1)',
              color: 'var(--fontColor)',
              },
            }}
            />
          </div>
        </DialogFooter>
      </Dialog>
      <Dialog
    hidden={!isAccountInfoDialogOpen}
    onDismiss={() => setIsAccountInfoDialogOpen(false)}
    dialogContentProps={{
      title: 'Change Account Information',
      styles: {
        title: { color: 'var(--primary1)', textAlign: 'center' },
      },
    }}
    styles={{
      main: { backgroundColor: 'var(--background)' },
    }}
  >
    <TextField
      label="First Name"
      value={updatedFirstName}
      onChange={(_, newValue) => setUpdatedFirstName(newValue || '')}
    />
    <TextField
      label="Last Name"
      value={updatedLastName}
      onChange={(_, newValue) => setUpdatedLastName(newValue || '')}
    />
    <TextField
      label="Email"
      value={updatedEmail}
      onChange={(_, newValue) => setUpdatedEmail(newValue || '')}
    />
    <TextField
      label="Age"
      value={updatedAge}
      onChange={(_, newValue) => setUpdatedAge(newValue || '')}
    />
    <TextField
      label="Gender"
      value={updatedGender}
      onChange={(_, newValue) => setUpdatedGender(newValue || '')}
    />
    <DialogFooter>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PrimaryButton
          onClick={handleSaveAccountInfo}
          text="Save"
          styles={{
            root: {
              backgroundColor: 'var(--surface1)',
              color: 'var(--fontColor)',
              marginRight: '4rem',
            },
          }}
        />
        <DefaultButton
          onClick={() => setIsAccountInfoDialogOpen(false)}
          text="Cancel"
          styles={{
            root: {
              backgroundColor: 'var(--surface1)',
              color: 'var(--fontColor)',
            },
          }}
        />
      </div>
    </DialogFooter>
  </Dialog>
  <Dialog
        hidden={!isUpgradePlanDialogOpen}
        onDismiss={() => setIsUpgradePlanDialogOpen(false)}
        dialogContentProps={{
          title: 'Upgrade Plan',
          styles: {
            title: { color: 'var(--primary1)', textAlign: 'center' },
          },
        }}
        styles={{
          main: { backgroundColor: 'var(--background)' },
        }}
      >
        <p style={{ color: 'var(--fontColor)', textAlign: 'center' }}>
          Upgrade to Ultimate Power for an additional $10.00/month.
        </p>
        <DialogFooter>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PrimaryButton
              onClick={handleUpgradePlan}
              text="Upgrade"
              styles={{
                root: {
                  backgroundColor: 'var(--surface1)',
                  color: 'var(--fontColor)',
                  marginRight: '4rem',
                },
              }}
            />
            <DefaultButton
              onClick={() => setIsUpgradePlanDialogOpen(false)}
              text="Cancel"
              styles={{
                root: {
                  backgroundColor: 'var(--surface1)',
                  color: 'var(--fontColor)',
                },
              }}
            />
          </div>
        </DialogFooter>
      </Dialog>
     {showToast && (
        <MessageBar
          messageBarType={toastType}
          isMultiline={false}
          onDismiss={() => setShowToast(false)}
          dismissButtonAriaLabel="Close"
        >
          {toastMessage}
        </MessageBar>
      )}
</header>
  );
};
export default NavbarIn;
