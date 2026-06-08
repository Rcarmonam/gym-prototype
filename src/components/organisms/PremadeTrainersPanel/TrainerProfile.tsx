import PremadeWorkoutCard from '../PremadeWorkoutCards/PremadeWorkoutCards.tsx';
import useWorkoutCardData from '../PremadeUse/UseWorkoutCardData.tsx';
import './TrainerProfile.css';

interface TrainerProfileProps {
    trainer: any;
}

const TrainerProfile: React.FC<TrainerProfileProps> = ({ trainer }) => {
    const { collectiveWorkouts } = useWorkoutCardData();

    return (
        <div className="trainer-content">
            <div className="trainer-info">
                <div className='trainer-text-info'>
                    <div className='trainer-name'>{trainer.fullName}</div>
                    <div>{trainer.email}</div>
                    <div className='bio'>{trainer.bio}</div>
                </div>
                <div className="image-gallery">
                    <div className='image-container'>
                        <img src={trainer.image1} alt="Image1" />
                        <div className="image-overlay"> Thrive </div>
                    </div>
                    <div className='image-container'>
                        <img src={trainer.image2} alt="Image2" />
                        <div className="image-overlay"> Conquer  </div>
                    </div>
                    <div className='image-container'>
                        <img src={trainer.image3} alt="Image3" />
                        <div className="image-overlay"> Empower  </div>
                    </div>
                    <div className='image-container'>
                        <img src={trainer.image4} alt="Image4" />
                        <div className="image-overlay"> Rise </div>
                    </div>
                </div>
            </div>
            <div className="workout-cards">
                <div className='workout-card-container'>
                    {Object.entries(collectiveWorkouts)
                        .filter(([_, workout]) => workout.trainerName === trainer.firstName)
                        .map(([key, workout]) => (
                            <div key={key} className='workout-card'>
                                <PremadeWorkoutCard
                                    workoutName={key}
                                    trainer={workout.trainerName}
                                    description={workout.description}
                                    imageSrc={workout.imageSrc}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default TrainerProfile;
