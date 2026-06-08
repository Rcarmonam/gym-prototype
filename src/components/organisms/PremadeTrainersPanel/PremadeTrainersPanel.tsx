import React, { useState } from 'react';
import './PremadeTrainersPanel.css';
import {
    Avatar,
    Tab,
    TabList,
} from "@fluentui/react-components";
import TrainerProfile from './TrainerProfile.tsx';

interface PremadeTrainersPanelProps {
    trainers: { [key: string]: any }; 
}

const isTrainer = (key: string) => {
    return key !== 'Collective Workouts' && key !== 'Muscle Groups';
}

const PremadeTrainersPanel: React.FC<PremadeTrainersPanelProps> = ({ trainers }) => {
    const [selectedTrainer, setSelectedTrainer] = useState<string | null>(
        Object.keys(trainers).filter(key => isTrainer(key))[0] || null
    );

    const handleTabSelect = (_: any, data: any) => {
        setSelectedTrainer(data.value);
    };

    return (
        <div className="trainer-container">
            <p className='meet-trainers'>Meet the Trainers!</p>
            <TabList size="large" selectedValue={selectedTrainer} onTabSelect={handleTabSelect}>
                {Object.keys(trainers)
                    .filter(key => isTrainer(key))
                    .map((key) => {
                        const trainer = trainers[key];
                        return (
                            <Tab className="trainer" key={key} id={trainer.firstName} value={trainer.firstName}>
                                <Avatar
                                    name={trainer.firstName}
                                    image={{
                                        src: trainer.imageCircle,
                                    }}
                                    size={96}
                                />
                                <div className='trainer-name-tab'>{trainer.firstName}</div>
                            </Tab>
                        );
                    })}
            </TabList>
            {selectedTrainer && (
                <TrainerProfile trainer={trainers[selectedTrainer]}/>
            )}
        </div>
    );
};

export default PremadeTrainersPanel;
