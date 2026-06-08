import './FitnessCalendar.css'
import WeekCalendarNavigator from '../../WeekCalendarNavigator/WeekCalendarNavigator.tsx';
import ChatBotButton from '../../../../components/atoms/ChatBot/ChatBotButton.tsx';

const FitnessCalendar = () => {

    return (
        <div className='FitnessCalendar'>
            <div className='WeekCalendarNavigatorBox'>
                <WeekCalendarNavigator/>
            </div>
        </div>
    );
};

export default FitnessCalendar;