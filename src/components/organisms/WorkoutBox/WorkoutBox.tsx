import './WorkoutBox.css'
import WorkoutMenuButton from "../../atoms/Buttons/WorkoutMenuButton/WorkoutMenuButton.tsx";
import { Subtitle2 } from '@fluentui/react-components';
import { useEffect } from 'react';

const WorkoutBox = (props: { workoutName: any , time: any, setWorkoutDeleted: any, setDuration: any, selectedDay: any}) => {
    useEffect(() => {
        
    }, [])
    return (
        <div className="container" draggable="true">
            <div className="workoutInfo">
                <Subtitle2 className='workoutName'>{props.workoutName}</Subtitle2>
                <caption className="workoutTime">{props.time}</caption>
            </div>
            <div className='workoutMenuBtn'>
                <WorkoutMenuButton workoutName={props.workoutName} setWorkoutDeleted={props.setWorkoutDeleted} setDuration={props.setDuration} selectedDay={props.selectedDay}/>
            </div>
        </div>
    )
}

export default WorkoutBox;