import React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridCell,
  createTableColumn,
  DataGridBody,
  Button,
} from '@fluentui/react-components';
import { Dismiss16Regular } from '@fluentui/react-icons';
import './DataGrid.css';

interface Exercise {
  name: string;
  id: string;
  sets: string;
  reps: string;
  weight: string;
  description: string;
  muscleGroup: string[];
  video: string;
}

const ExerciseDataGrid = (props: {
  selectedExercises: { [key: string]: Exercise };
  toggleSelectExercise: any;
}) => {

  const exercisesArray: Exercise[] = React.useMemo(
    () =>
      Object.entries(props.selectedExercises).map(([ID, exercise]) => ({
        ID,
        ...exercise,
      })),
    [props.selectedExercises]
  );

  const cellStyle = {
    display: 'flex',
    justifyContent: 'flex-end', 
    width: '100%', 
  };

  const cellStyleCentered = {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%', 
  };
  

  const columns = [
    createTableColumn<Exercise>({
      columnId: 'name',
      renderHeaderCell: () => <span>Exercise</span>,
      renderCell: (item: Exercise) => <span>{item.name}</span>,
    }),
    createTableColumn<Exercise>({
      columnId: 'sets',
      renderHeaderCell: () => <span style={cellStyleCentered}>Sets</span>,
      renderCell: (item: Exercise) => <span style={cellStyleCentered}>{item.sets}</span>,
    }),
    createTableColumn<Exercise>({
      columnId: 'reps',
      renderHeaderCell: () => <span style={cellStyleCentered}>Reps</span>,
      renderCell: (item: Exercise) => <span style={cellStyleCentered}>{item.reps}</span>,
    }),
    createTableColumn<Exercise>({
      columnId: 'weight',
      renderHeaderCell: () => <span style={cellStyleCentered}>Weight</span>,
      renderCell: (item: Exercise) => <span style={cellStyleCentered}>{item.weight}</span>,
    }),
    createTableColumn<Exercise>({
      columnId: 'remove',
      renderHeaderCell: () => '',
      renderCell: (item: Exercise) =>
      <div style={cellStyle}>
          <Button
            icon={<Dismiss16Regular />}
            appearance="subtle"
            onClick={() => props.toggleSelectExercise(item.id)}
            aria-label="Remove"
          />
        </div>
    }),
  ];

  if (!exercisesArray.length) {
    return <div className="no-exercises">No exercises selected</div>;
  }
  console.log(exercisesArray);

  return (
    <div className="customDataGrid">
      <DataGrid items={exercisesArray} columns={columns}>
        <div className="customDataGridHeader">
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridCell>{renderHeaderCell()}</DataGridCell>
              )}
            </DataGridRow>
          </DataGridHeader>
        </div>
        <DataGridBody>
          {({ item, rowId }) => (
            <DataGridRow key={rowId}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};

export default ExerciseDataGrid;
