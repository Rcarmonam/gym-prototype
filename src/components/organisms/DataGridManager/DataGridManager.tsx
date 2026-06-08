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
import './DataGridManager.css';

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    genderValue: string;
    membershipType: string;
    price: string;
}

const ManagerDataGrid = (props: {
    selectedCustomer: { [key: string]: Customer };
  toggleSelectCustomer: any;
}) => {
  const customersArray: Customer[] = React.useMemo(
    () =>
      Object.entries(props.selectedCustomer).map(([ID, customer]) => ({
        ID,
        ...customer,
      })),
    [props.selectedCustomer]
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
    createTableColumn<Customer>({
      columnId: 'firstName',
      renderHeaderCell: () => <span>Name</span>,
      renderCell: (item: Customer) => <span>{item.firstName} {item.lastName}</span>,
    }),
    createTableColumn<Customer>({
      columnId: 'email',
      renderHeaderCell: () => <span style={cellStyleCentered}>Email</span>,
      renderCell: (item: Customer) => <span style={cellStyleCentered}>{item.email}</span>,
    }),
    createTableColumn<Customer>({
      columnId: 'genderValue',
      renderHeaderCell: () => <span style={cellStyleCentered}>Gender</span>,
      renderCell: (item: Customer) => <span style={cellStyleCentered}>{item.genderValue}</span>,
    }),
    createTableColumn<Customer>({
      columnId: 'membershipType',
      renderHeaderCell: () => <span style={cellStyleCentered}>Membership Tier</span>,
      renderCell: (item: Customer) => <span style={cellStyleCentered}>{item.membershipType}</span>,
    }),
    createTableColumn<Customer>({
        columnId: 'price',
        renderHeaderCell: () => <span style={cellStyleCentered}>Price</span>,
        renderCell: (item: Customer) => <span style={cellStyleCentered}>{item.price}</span>,
      }),
    createTableColumn<Customer>({
      columnId: 'remove',
      renderHeaderCell: () => '',
      renderCell: (item: Customer) =>
      <div style={cellStyle}>
          <Button
            icon={<Dismiss16Regular />}
            appearance="subtle"
            onClick={() => props.toggleSelectCustomer(item.id)}
            aria-label="Remove"
          />
        </div>
    }),
  ];

  if (!customersArray.length) {
    return <div className="no-exercises">No customer selected</div>;
  }

  return (
    <div className="customDataGrid">
      <DataGrid items={customersArray} columns={columns}>
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

export default ManagerDataGrid;
