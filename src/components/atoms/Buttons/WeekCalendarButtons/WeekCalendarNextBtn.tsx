import { Button } from '@fluentui/react-components';
import { ChevronRight32Filled } from '@fluentui/react-icons';

interface fitnessCalendarDrawerProps {
  onClick: () => void;
}

const WeekCalendarNextBtn: React.FC<fitnessCalendarDrawerProps> = ({
  onClick,
}) => {
    return (
        <div>
            <Button
                    icon={<ChevronRight32Filled />}
                    size='large'
                    onClick={onClick}
                    appearance="subtle"
                >
            </Button>
        </div>
    )
};

export default WeekCalendarNextBtn;
