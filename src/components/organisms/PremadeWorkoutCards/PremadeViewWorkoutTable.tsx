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
import '../../atoms/Charts/ViewWorkoutTable/ViewWorkoutTable.css';
import useWorkoutCardData from '../PremadeUse/UseWorkoutCardData.tsx';

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

const PremadeViewWorkoutTable = (props: { workoutName: any }) => {
  const { collectiveWorkouts } = useWorkoutCardData()
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([]);

  useEffect(() => {
    const fetchWorkout = () => {
      const workout = collectiveWorkouts[props.workoutName]
    
      if (workout) {
        const exercises = workout.exercises;
        if (exercises) {
            const items = Object.entries(exercises).map(([key, value]) => ({
            exercise: key,
            sets: (value as any).sets,
            reps: (value as any).reps,
            weight: (value as any).weights,
            }));
            setWorkoutItems(items);
        }
      }
    };

    fetchWorkout();
  }, [props.workoutName, collectiveWorkouts]);

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

export default PremadeViewWorkoutTable;
