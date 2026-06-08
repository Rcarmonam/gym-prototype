import React from "react";
import { useNavigate } from "react-router-dom";
import {
    AddSquare32Filled,
    AddSquare32Regular,
    bundleIcon,
    iconFilledClassName,
    iconRegularClassName,
    FluentIconsProps
} from "@fluentui/react-icons";
import { makeStyles } from '@fluentui/react-components';

const iconStyleProps: FluentIconsProps = {
    primaryFill: '#9DE58D',
    cursor: 'pointer',  
};

const useIconStyles = makeStyles({
    icon: {
        ':hover': {
            [`& .${iconFilledClassName}`]: {
                display: 'none',
            },
            [`& .${iconRegularClassName}`]: {
                display: 'inline',

            },
        },
    },
});

const AddSqaure = bundleIcon(AddSquare32Filled, AddSquare32Regular);

interface createWorkoutButtonProps {
    navigationLink: string;
}

const createWorkoutButton: React.FC<createWorkoutButtonProps> = ({
    navigationLink,
}) => {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(navigationLink);
    };

    const styles = useIconStyles();

    return (
        <div className={styles.icon} >
            <AddSqaure
                {...iconStyleProps}
                onClick={handleClick}
            >
            </AddSqaure>
        </div>
    );
};

export default createWorkoutButton;