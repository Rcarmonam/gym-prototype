import {
    Button,
    makeStyles,
    OverlayDrawer,
    DrawerHeaderTitle,
    DrawerHeader,
} from '@fluentui/react-components';
import { Eye16Regular, Dismiss24Regular } from '@fluentui/react-icons';
import background from '../../../assets/Pic4.svg';
import { useEffect, useState } from 'react';
import useWorkoutCardData from '../PremadeUse/UseWorkoutCardData.tsx';
import PremadeViewWorkoutTable from './PremadeViewWorkoutTable.tsx';

const useStyles = makeStyles({
    viewWorkout: {
        justifyContent: 'center',
        paddingRight: '1rem',
        width: '100%',
        '&:hover': {
            backgroundColor: 'var(--surface3)',
        },
        position: 'absolute',
        bottom: '0',
        left: '0',
    },
    closeButton: {
        paddingRight: '0.5rem',
    },
    customDialogSurface: {
        width: '100%',
        height: '90vh',
        display: 'flex',
        backgroundColor: '#070707',
    },
    pictureBackground: {
        backgroundColor: '#070707',
        backgroundImage: 'url(' + background + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        alignSelf: 'center',
        width: '95vw',
        height: '90vh',
    },
});

const PremadeViewCard = (props: { workoutName: any, trainer: any, description: any }) => {
    const { collectiveWorkouts } = useWorkoutCardData()
    const currentWorkout = collectiveWorkouts[props.workoutName]
    const [isOpen, setIsOpen] = useState(false);
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const styles = useStyles();

    useEffect(() => {
        updateMuscleGroups();
    }, [props.workoutName, collectiveWorkouts]);

    const updateMuscleGroups = () => {
        if (currentWorkout) {
            setMuscleGroups(currentWorkout.muscleGroups)
        }
    }

    return (
        <div>
            <OverlayDrawer
                position="bottom"
                open={isOpen}
                modalType="alert"
                className={styles.customDialogSurface}
            >
                <DrawerHeader className={styles.pictureBackground}>
                    <DrawerHeaderTitle
                        className={styles.closeButton}
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<Dismiss24Regular />}
                                onClick={() => setIsOpen(false)}
                            />
                        }
                    >
                        <div className="workout-name-view">{props.workoutName}</div>
                    </DrawerHeaderTitle>
                    <div className="top-section">
                        <div className="muscle-title">
                            Muscle Focus
                            <div className="muscle-list">
                                <ul>
                                    {muscleGroups.map((muscleGroup, index) => (
                                        <li key={index}>{muscleGroup}</li>
                                    ))}
                                    {muscleGroups.length === 0 && <li>None</li>}
                                </ul>
                                Trainer: {props.trainer}
                                <div>
                                    {props.description}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="table-background">
                        <div className="workout-table">
                            <PremadeViewWorkoutTable workoutName={props.workoutName} />
                        </div>
                    </div>
                </DrawerHeader>
            </OverlayDrawer>
            <Button
                appearance="outline"
                className={styles.viewWorkout}
                onClick={() => setIsOpen(true)}
                icon={<Eye16Regular />}
            >
                View
            </Button>
        </div>
    );
};

export default PremadeViewCard;