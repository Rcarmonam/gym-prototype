import React, { useEffect } from 'react';
import './FitnessPlans.css'
import {
    makeStyles,
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    TabValue,
} from "@fluentui/react-components";
import { DumbbellRegular, PersonStarburstRegular } from '@fluentui/react-icons';
import PremadeTrainersPanel from '../../PremadeTrainersPanel/PremadeTrainersPanel.tsx';
import PremadeWorkoutPanel from '../../PremadeWorkoutPanel/PremadeWorkoutPanel.tsx';
import useTrainers from '../../PremadeUse/UseTrainers.tsx';
import useWorkoutCardData from '../../PremadeUse/UseWorkoutCardData.tsx';

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: '4rem',
        paddingLeft: '6rem',
    },
    tabListContainer: {
        display: "flex",
        justifyContent: "center",
    },
});

const FitnessPlans = React.memo(() => {
    const styles = useStyles();
    const { trainers } = useTrainers();
    const { collectiveWorkouts, collectiveMuscleGroups } = useWorkoutCardData();

    const [selectedValue, setSelectedValue] = React.useState<TabValue>("workouts");
    const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    useEffect(() => {
        // Add any side effects related to FitnessPlans component here
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.tabListContainer}>
                <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} size="large"  >
                    <Tab id="Workouts" value="workouts" icon={<DumbbellRegular />} >
                        Workouts
                    </Tab>
                    <Tab id="Trainers" value="trainers" icon={<PersonStarburstRegular />}>
                        Trainers
                    </Tab>
                </TabList>
            </div>
            <div>
                {selectedValue === "workouts" && (
                    <div className='workout-container-panel'>
                        <PremadeWorkoutPanel collectiveMuscleGroups={collectiveMuscleGroups} collectiveWorkouts={collectiveWorkouts} />
                    </div>
                )}
                {selectedValue === "trainers" && (
                    <div className='trainers-container-panel'>
                        <PremadeTrainersPanel trainers={trainers} />
                    </div>
                )}
            </div>
        </div>
    );
});

export default FitnessPlans;
