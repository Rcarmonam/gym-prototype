import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
} from '@fluentui/react-components';
import { MoreHorizontal32Regular, DeleteRegular } from '@fluentui/react-icons';
import { useUserWorkouts } from '../../../organisms/WeekCalendarNavigator/UseUserWorkouts.tsx';
import ViewWorkout from '../../../organisms/ViewWorkout/ViewWorkout.tsx';
import EditWorkout from '../../../organisms/EditWorkout/EditWorkout.tsx';

const useStyles = makeStyles({
  deleteWorkout: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    justifyContent: 'flex-start',
    width: '100%',
    '&:hover': {
      backgroundColor: 'var(--surface3)',
    },
  },
  customMenuSurface: {
    backgroundColor: 'var(--surface1);',
  },
});

const workoutMenu = (props: { workoutName: any; setWorkoutDeleted: any, setDuration: any, selectedDay: any}) => {
  const styles = useStyles();
  const { deleteUserWorkout } = useUserWorkouts();

  // handleDeleteWorkout deletes the workout from the user's database
  const handleDeleteWorkout = async () => {
    try {
      await deleteUserWorkout(props.workoutName);
      props.setWorkoutDeleted(true);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <div>
      <Menu>
        <MenuTrigger>
          <MenuButton
            icon={<MoreHorizontal32Regular />}
            appearance="transparent"
          ></MenuButton>
        </MenuTrigger>
        <MenuPopover className={styles.customMenuSurface}>
          <MenuList>
            <ViewWorkout workoutName={props.workoutName} setDuration={props.setDuration} selectedDay={props.selectedDay}></ViewWorkout>
            <EditWorkout workoutName={props.workoutName}></EditWorkout>
            <Button
              icon={<DeleteRegular />}
              className={styles.deleteWorkout}
              appearance="transparent"
              onClick={handleDeleteWorkout}
            >
              Delete
            </Button>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};

export default workoutMenu;
