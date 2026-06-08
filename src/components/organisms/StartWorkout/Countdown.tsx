import { useEffect, useState } from 'react';
import StartWorkout from './StartWorkout.tsx';
import './Countdown.css';

const Countdown = (props: { workoutName: any }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="count-container">
      {count > 0 ? (
        <div className="countdown">{count}</div> 
      ) : (
        <StartWorkout workoutName={props.workoutName} /> 
      )}
    </div>
  );
};

export default Countdown;
