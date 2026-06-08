import { useEffect, useState } from 'react';
import {
  FluentProvider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Button,
  makeStyles,
} from '@fluentui/react-components';
import { Dismiss24Regular, PlayFilled } from '@fluentui/react-icons';
import DrawerToggleButton from '../../atoms/Buttons/DrawerToggleButton/DrawerToggleButton.tsx';
import { useUserWorkouts } from '../WeekCalendarNavigator/UseUserWorkouts.tsx';
import WorkoutBox from '../WorkoutBox/WorkoutBox.tsx';
import { JSX } from 'react/jsx-runtime';
import './QuickAddCalendarDrawer.css';

const useStyles = makeStyles({
  workouts: {
    marginTop: '2rem',
  },
  customHeader: {
    backgroundColor: 'var(--Surface-1, #242424)',
    fontSize: '2rem',
  },
  customBody: {
    backgroundColor: 'var(--Surface-1, #242424)',
  },
});

const QuickAddCalendarDrawer = (props: {
  setWorkoutAdded: any;
  workoutAdded: any;
  setWorkoutDeleted: any;
  workoutDeleted: any
}) => {
  const styles = useStyles();
  const { getUserWorkouts } = useUserWorkouts();
  const [isOpen, setIsOpen] = useState(false);
  const [workoutList, setWorkoutList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutData = await getUserWorkouts();
        if (workoutData) {
          const updatedWorkoutList:
            | ((prevState: never[]) => never[])
            | JSX.Element[] = [];

          Object.keys(workoutData).forEach((key) => {
            updatedWorkoutList.push(
              <WorkoutBox
                workoutName={key}
                time={''}
                setWorkoutDeleted={props.setWorkoutDeleted}
                setDuration={undefined}
                selectedDay={''}
              />
            );
          });

          setWorkoutList(updatedWorkoutList);
        }
      } catch (error) {
        console.error('Error fetching and processing workout data:', error);
      }
    };

    fetchWorkoutData();
  }, [props.workoutAdded, props.workoutDeleted]);

  return (
    <div>
      <FluentProvider>
        <OverlayDrawer
          open={isOpen}
          onOpenChange={(_, { open }) => setIsOpen(open)}
          style={{ width: '25rem' }}
        >
          <DrawerHeader className={styles.customHeader}>
            <DrawerHeaderTitle
              action={
                // Inside Btn to Close Drawer
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => setIsOpen(false)}
                />
              }
            ></DrawerHeaderTitle>
            Quick Start
          </DrawerHeader>
          <DrawerBody className={styles.customBody}>
            {workoutList.map((workout, index) => (
              <div key={index} className={styles.workouts}>
                {workout}
              </div>
            ))}
          </DrawerBody>
        </OverlayDrawer>
        <DrawerToggleButton
          icon={<PlayFilled />}
          onClick={() => setIsOpen(true)}
          text={'Quick Start'}
        />
      </FluentProvider>
    </div>
  );
};

export default QuickAddCalendarDrawer;
