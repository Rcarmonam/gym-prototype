import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
} from '@fluentui/react-components';
import './ViewWorkoutTable.css';
import { useUserWorkouts } from '../../../../components/organisms/WeekCalendarNavigator/UseUserWorkouts.tsx';

interface WorkoutItem {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

const columns = [
  { columnKey: 'exercise', label: 'Exercise' },
  { columnKey: 'sets', label: 'Sets' },
  { columnKey: 'reps', label: 'Reps' },
  { columnKey: 'weight', label: 'Weight' },
];

const ViewWorkoutTable = (props: { workoutName: any }) => {
  const { getUserWorkouts } = useUserWorkouts();
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([]);

  useEffect(() => {
    const fetchWorkout = async () => {
      const workoutsData = await getUserWorkouts();
      if (workoutsData && workoutsData[props.workoutName]) {
        const exercises = workoutsData[props.workoutName].exercises;
        const items = Object.entries(exercises).map(([key, value]) => ({
          exercise: key,
          sets: (value as any).sets,
          reps: (value as any).reps,
          weight: (value as any).weight,
        }));
        setWorkoutItems(items);
      }
    };

    fetchWorkout();
  }, [props.workoutName]);

  return (
    <Table size="medium">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.columnKey}>
              {column.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {workoutItems.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <TableCellLayout>
                {item.exercise}
              </TableCellLayout>
            </TableCell>
            <TableCell>
              <TableCellLayout>
                <div className="exercise-details-view">{item.sets}</div>
              </TableCellLayout>
            </TableCell>
            <TableCell>
              <TableCellLayout>
                <div className="exercise-details-view">{item.reps}</div>
              </TableCellLayout>
            </TableCell>
            <TableCell>
              <TableCellLayout>
                <div className="exercise-details-view">{item.weight}</div>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ViewWorkoutTable;
