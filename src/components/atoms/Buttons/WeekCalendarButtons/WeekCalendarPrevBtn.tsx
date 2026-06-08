import { Button } from '@fluentui/react-components';
import { ChevronLeft32Filled } from '@fluentui/react-icons';

interface fitnessCalendarDrawerProps {
  onClick: () => void;
}

const WeekCalendarPrevBtn: React.FC<fitnessCalendarDrawerProps> = ({
    onClick
}) => {
    return (
        <div>
            <Button
                icon={<ChevronLeft32Filled />}
                size='large'
                onClick={onClick}
                appearance="subtle"
            >
            </Button>
        </div>
    )
};

export default WeekCalendarPrevBtn;
