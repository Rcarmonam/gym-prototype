import * as React from 'react';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../index.js';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  makeStyles
} from '@fluentui/react-components';
import { Dismiss24Regular, AddFilled } from '@fluentui/react-icons';
import { SearchBox } from '@fluentui/react-search-preview';
import DrawerToggleButton from '../../atoms/Buttons/DrawerToggleButton/DrawerToggleButton.tsx';
import ExerciseBox from '../ExerciseBox/ExerciseBox.tsx';
import ExerciseDataGrid from '../../atoms/Charts/DataGrid/DataGrid.tsx';
import SubmissionButton from '../../atoms/Buttons/GeneralButton/generalButton.tsx';
import './CreateWorkoutCalendarTrainer.css';
import { useExercises } from '../ExercisesData/useExercises.tsx';
import { update } from 'firebase/database';
import { JSX } from 'react/jsx-runtime';


const useStyles = makeStyles({
  customDialogSurface: {
    backgroundColor: 'var(--surface1);',
    height: '100%',
    width: '100%',
    maxHeight: '80vh',
    maxWidth: '80vw',
  },
  customBody: {
    marginTop: '-1rem',
  },
  dismissButton: {
    marginRight: '-0.9rem',
  },
});

const CreateWorkoutCalendarTrainer = (props: {
  setWorkoutAdded: any;
  workoutAdded: any;
  trainerName: any
  

}) => {
  const styles = useStyles();
  const { exercises } = useExercises();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workoutName, setWorkoutName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imgSrc, setImgSrc] = React.useState('');
  const [muscleGroups, setMuscleGroups] = React.useState<string[]>([]);
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [selectedExercises, setSelectedExercises] = useState<{
    [key: string]: Exercise;
  }>({});

  interface WorkoutData {
    description: string;
    exercises: { [exerciseName: string]: Exercise };
    imageSrc: string;
    muscleGroups: string[];
    trainerName: string;
  }

  interface Exercise {
    name: string;
    id: string;
    sets: string;
    reps: string;
    weight: string;
    description: string;
    muscleGroup: string[];
    video: string;
  }

  const handleSearchChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setSearchQuery(newValue || '');
  };

  const toggleSelectExercise = (id: string, name: string, description: string, muscleGroup: string[], video:string) => {
    setSelectedExercises((prevState) => {
      if (prevState[id]) {
        const newState = { ...prevState };
        delete newState[id];
        return newState;
      } else {
        const newExercise = {
          name: name,
          id: id,
          sets: '0',
          reps: '0',
          weight: '0',
          description: description,
          muscleGroup: muscleGroup,
          video: video,
        };
        return { ...prevState, [id]: newExercise };
      }
    });
  };

  const handleDetailChange = (
    id: string,
    detail: 'sets' | 'reps' | 'weight',
    value: string
  ) => {
    if (detail === 'sets') {
      setSelectedExercises((prev) => ({
        ...prev,
        [id]: { ...prev[id], sets: value },
      }));
    } else if (detail === 'reps') {
      setSelectedExercises((prev) => ({
        ...prev,
        [id]: { ...prev[id], reps: value },
      }));
    } else if (detail === 'weight') {
      setSelectedExercises((prev) => ({
        ...prev,
        [id]: { ...prev[id], weight: value },
      }));
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = exercises.filter((exercise) => {
        return (
          exercise.name.toLowerCase().includes(lowerCaseQuery) ||
          exercise.muscleGroup.some((muscle) =>
            muscle.toLowerCase().includes(lowerCaseQuery)
          )
        );
      });
      console.log("FILTERED",filtered);

      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchQuery, exercises]);

  const constructAndSaveWorkoutData = (
    workoutData: WorkoutData
  ) => {
    return saveWorkout(workoutName, workoutData); // Save the workout data to Firebase
  };

  const handleSaveWorkout = () => {
   
    if(!checkTrainer(props.trainerName)){
      console.log("there is no trainer name specified")
    }
    
    console.log("This is the updated",muscleGroups) 
    const workoutData: WorkoutData = {
      description: description,
      imageSrc: imgSrc,
      muscleGroups: muscleGroups,
      trainerName: props.trainerName,
      exercises: selectedExercises,
    };

    console.log(workoutData.muscleGroups)
    // Save the workout data to Firebase
    constructAndSaveWorkoutData(workoutData)
      .then(() => {

        
        setIsOpen(false);
        setWorkoutName('');
        setDescription('');
        setImgSrc('');
        setMuscleGroups([]);
        setSelectedExercises({});
        setDescription('');
        setImgSrc(''); 
        props.setWorkoutAdded(true);
        console.log('Workout saved successfully');
        // notify();

      })
      .catch((error) => {
        console.error('Error saving workout: ', error);
      });

  };


  const saveWorkout = async (workoutName: string, workoutData: WorkoutData) => {
    try{
      await updateDoc(doc(db, 'Trainers', 'Collective Workouts'), {
        [workoutName]: workoutData
    });
      console.log("This worked");

    }catch(error){
      console.log("This did not work", error);
    }
};


  const checkTrainer = (trainerName: any): boolean =>{
    if(trainerName = null){
      return false;
    }
    return true;
  };
  
  const handleSetMuscleGroups = (listOfMuscles: String) =>{

    const muscleArray = listOfMuscles.split(',').map(item => item.trim());
    setMuscleGroups(muscleArray)
    
  };


  return (
    <div>
      <Dialog
        modalType="non-modal"
        open={isOpen}
        onOpenChange={(_e, data) => setIsOpen(data.open)}
      >
        <DialogTrigger disableButtonEnhancement>
          <DrawerToggleButton
            icon={<AddFilled/>}
            onClick={() => setIsOpen(true)}
            text={'Create Workout'}
          />
        </DialogTrigger>

        <DialogSurface className={styles.customDialogSurface}>
          <DialogBody className={styles.customBody}>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    className={styles.dismissButton}
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            />
            <DialogContent>
              <div className="menu-containers">
                <div className="left-menu-container">
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className={`workout-name-input ${
                      workoutName ? 'filled' : ''
                    }`}
                    placeholder="Enter workout name"
                    maxLength={35}
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`description-input ${
                      description ? 'filled' : ''
                    }`}
                    placeholder="Enter a workout description"
                    maxLength={200}
                  />
                  <input
                    type="text"
                    value={imgSrc}
                    onChange={(e) => setImgSrc(e.target.value)}
                    className={`img-src-input ${
                      imgSrc ? 'filled' : ''
                    }`}
                    placeholder="Enter the image link"
                    maxLength={200}
                  />
                  <input
                    type="text"
                    value={muscleGroups}
                    onChange={(e) => handleSetMuscleGroups(e.target.value)}
                    className={`muscle-groups ${
                      muscleGroups ? 'filled' : ''
                    }`}
                    placeholder="Enter the muscle groups"
                    maxLength={70}
                  />

                  <div className="workout-calendar-repeat">
                    <div className="hori-divider">
                      <Divider />
                    </div>
                    <div className="data-grid">
                      <div className="data-grid-title">
                        Exercises Currently Added
                      </div>
                      <ExerciseDataGrid
                        selectedExercises={selectedExercises}
                        toggleSelectExercise={toggleSelectExercise}
                      />
                    </div>
                  </div>
                </div>
                <div className="ver-divider">
                  <Divider vertical style={{ height: '90%' }} />
                </div>
                <div className="right-menu-container">
                  <div className="exercise-searchbar">
                    <SearchBox
                      appearance="underline"
                      style={{ width: '80%' }}
                      placeholder="Search exercises"
                      onChange={(event: any, data) =>
                        handleSearchChange(event, data?.value)
                      }
                      value={searchQuery}
                    />
                    {exercises && exercises.length > 0 && (
                      <div className="exer-box">
                        <ExerciseBox
                          exercises={filteredExercises}
                          selectedExercises={selectedExercises}
                          toggleSelectExercise={toggleSelectExercise}
                          handleDetailChange={handleDetailChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="save-button">
                  <SubmissionButton
                    text="Save Workout"
                    styleType="style2"
                    buttonSize="small"
                    onClick={handleSaveWorkout}

                  />    
                </div>
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default CreateWorkoutCalendarTrainer;


