import * as React from "react";
import {
    makeStyles,
    Button,
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from "@fluentui/react-components";
import { InfoFilled } from '@fluentui/react-icons';

interface InfoWorkoutDialogProps {
    exercise?: string,
    description?: string,
    muscleGroups?: string[],
}

const useStyles = makeStyles({
    popoverContent: {
        maxWidth: "20rem", 
        backgroundColor: "var(--surface1);",
    },
    title: {
        fontWeight: "bold", 
        marginBottom: "0.5rem", 
    },
    description: {
        marginBottom: "0.5rem", 
        textOverflow: "ellipsis", 
        whiteSpace: "pre-wrap", 
    },
    muscleGroups: {
        fontStyle: "italic", 
        color: "var(--primary1);", 
        marginTop: "0.5rem", 
    },
});

const InfoWorkoutPopOver: React.FC<InfoWorkoutDialogProps> = ({
    exercise = "",
    description = "",
    muscleGroups = [],
}) => {
    const classes = useStyles();
    const prevent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };
    const formattedMuscleGroups = muscleGroups.join(", ");

    return (
        <div>
            <Popover withArrow>
                <PopoverTrigger disableButtonEnhancement>
                    <Button icon={<InfoFilled />} onClick={prevent} appearance="transparent"></Button>
                </PopoverTrigger>
                <PopoverSurface className={classes.popoverContent}>
                    <div>
                        <div className={classes.title}>
                            {exercise}
                        </div>
                        <div className={classes.description}>
                            {description}
                        </div>
                        <div className={classes.muscleGroups}>
                            Muscle Groups: {formattedMuscleGroups}
                        </div>
                    </div>
                </PopoverSurface>
            </Popover>
        </div>
    )
}

export default InfoWorkoutPopOver;
