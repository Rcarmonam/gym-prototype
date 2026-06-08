import "./PremadeWorkoutPanel.css";
import PremadeWorkoutCard from "../PremadeWorkoutCards/PremadeWorkoutCards.tsx";
import { useEffect } from "react";

interface PremadeWorkoutPanelProps {
    collectiveWorkouts: { [key: string]: any };
    collectiveMuscleGroups: string[];
}

const PremadeWorkoutPanel: React.FC<PremadeWorkoutPanelProps> = ({ collectiveWorkouts, collectiveMuscleGroups }) => {
    useEffect(() => {
        console.log(collectiveMuscleGroups)
    }, [collectiveWorkouts, collectiveMuscleGroups]);

    return (
        <div>
            {collectiveMuscleGroups.map((muscleGroup: any, index) => (
                <div key={index}>
                    <div className="muscle-group-title"> {muscleGroup.toUpperCase()} </div>
                    <div className="muscle-group-container">
                        {Object.entries(collectiveWorkouts).map(([key, workout]) => (
                            // Render the workout card directly inside the muscle group container
                            workout.muscleGroups && workout.muscleGroups.includes(muscleGroup) && (
                                <PremadeWorkoutCard
                                    key={key}
                                    workoutName={key}
                                    trainer={workout.trainerName}
                                    description={workout.description}
                                    imageSrc={workout.imageSrc}
                                />
                            )
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PremadeWorkoutPanel;
