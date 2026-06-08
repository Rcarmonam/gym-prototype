import React, { useEffect, useState, useRef } from 'react';
import TextButtons from '../../components/atoms/Buttons/GeneralButton/generalButton.tsx';
import './Manager.css';
import { db } from '../../index.js';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent, Button} from "@fluentui/react-components";
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ArrowDownloadFilled, FilterFilled, DeleteFilled, PersonEditFilled, SignOutFilled, StackFilled, SearchRegular } from '@fluentui/react-icons';
import CustomerInfoDialog from '../../components/atoms/Buttons/ManagerInfoButton/CustomerInfoDialog.tsx';

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    genderValue: string;
    email: string;
    membershipType: string;
    price: string;
}

interface EditUserDialogProps {
    open: boolean;
    onClose: () => void;
    user: Customer | null;
    onSave: (updatedUser: Customer) => void;
}


const Manager = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
    const [selectedTier, setSelectedTier] = useState<string>(''); 
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
    const customersPerPage = 10;
    const [customerInfoDialogOpen, setCustomerInfoDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectOpen, setSelectOpen] = useState(false);   
    const selectRef = useRef<HTMLDivElement>(null);

    
    const toggleDropdown = (event:any) => {
        event.stopPropagation();
        setSelectOpen(!selectOpen);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setSelectOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            const customersCollection = collection(db, 'customers');
            const customersSnapshot = await getDocs(customersCollection);
            const customersList = customersSnapshot.docs.map(doc => {
                const docData = doc.data() as Customer;
                return {
                    ...docData,
                    id: doc.id
                };
            });
            setCustomers(customersList);
        };
        fetchCustomers();
    }, []);

    const handleDownloadCSV = () => {
        // Convert customer data to CSV format
        const csvContent = "data:text/csv;charset=utf-8," +
            "First Name,Last Name,Email,Membership Tier,Gender,Price\n" + // Add headers
            customers.map(customer =>
                `${customer.firstName},${customer.lastName},${customer.email},${customer.membershipType},${customer.genderValue},${customer.price}`
            ).join("\n");
    
        // Create a virtual link and trigger the download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try{
            await signOut(auth);
            navigate('/Login');
        }catch(error){
            console.error("Logout failed ", error);
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSelectedTier(''); // Reset selected tier when performing a new search
        setSortOrder('asc'); // Reset sorting order when performing a new search
        setCurrentPage(1); // Reset to first page when performing a new search
    };

    const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTier(e.target.value);
        setSearchQuery(''); // Reset search query when changing the tier
        setSortOrder('asc'); // Reset sorting order when changing the tier
        setCurrentPage(1); // Reset to first page when changing the tier
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleOpenCustomerInfo = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerInfoDialogOpen(true);
    };

    const handleCloseCustomerInfo = () => {
        setSelectedCustomer(null);
        setCustomerInfoDialogOpen(false);
    };

    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        const tierMatch = selectedTier ? customer.membershipType.toLowerCase() === selectedTier.toLowerCase() : true;
        const searchMatch = fullName.includes(searchQuery.toLowerCase());
        return tierMatch && searchMatch;
    });

    const sortedCustomers = filteredCustomers.slice().sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEdit = (user: Customer) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async (updatedUser: any) => {
        // Update user in state
        const updatedCustomers = customers.map((c) =>
            c.id === updatedUser.id ? updatedUser : c
        );
        setCustomers(updatedCustomers);
        // Update user in database
        await updateDoc(doc(db, 'customers', updatedUser.id), updatedUser);
        setEditDialogOpen(false);
    };

    const deleteCustomer = async (customerId: string) => {
        // Remove the customer from the React state
        setCustomers(customers.filter(customer => customer.id !== customerId));
        // Remove the customer from the Firebase database
        await deleteDoc(doc(db, 'customers', customerId));
    };

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const handleDropdownClick = (event: any) => {
        // Prevent toggleDropdown from being called when clicking on the select dropdown
        event.stopPropagation();
    };

    return (
        <div id="manager" className="manager-page">
            <div className="manager-welcome">POWER PIT</div>
            <div className="msearch-button"style={{ display: 'flex', alignItems: 'center' }}>
            <SearchRegular style={{ marginRight: '8px', color: 'var(--text-light)' }}/>
                <input
                    type="text"
                    placeholder="Search for a Customer..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ 
                        backgroundColor: 'var(--background-dark)', 
                        color: 'var(--text-light)', 
                        border: '1px solid white', 
                        borderRadius: '4px', 
                        padding: '8px', 
                        marginRight: '8px' 
                    }}
                />
            <div/>
            <div className='manager-bar'>
                <div className='manager-bar-icons'>
                        <div className='download-csv' onClick={handleDownloadCSV} title='Download CSV'
                        > 
                        <ArrowDownloadFilled/>
                        </div>
                        <div className='tiers'>
                            <div className="select-dropdown-button" ref={selectRef} onClick={toggleDropdown} title='Filter Membership Tier'> 
                                <select 
                                    className="select-dropdown" 
                                    style={{display: selectOpen ? "block" : "none"}}
                                    value={selectedTier} 
                                    onChange={handleTierChange}
                                    onClick={handleDropdownClick}
                                >
                                    <option value="">All Tiers</option>
                                    <option value="Starter Power">Starter Power</option>
                                    <option value="Power Boost">Power Boost</option>
                                    <option value="Ultimate Power">Ultimate Power</option>
                                </select>
                                <StackFilled/>
                            </div>
                        </div>
                        <div className='filter'onClick={handleSortOrderChange} title='Sort A-Z / Z-A'
                        >
                        <FilterFilled/>
                        </div>
                        <div className='logout' onClick={handleLogout} title='Logout'
                        >                            
                        <SignOutFilled/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='customers-table-container'>
                <h2>Customers</h2>
                <table className='customers-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Membership Tier</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td onClick={() => handleOpenCustomerInfo(customer)}>{customer.firstName} {customer.lastName}</td>
                                <td>{customer.email}</td>
                                <td>{customer.membershipType}</td>
                                <td>
                                    <TextButtons
                                        icon={<PersonEditFilled/>}
                                        text="Edit"
                                        styleType="style1"
                                        buttonSize="small"
                                        onClick={() => handleEdit(customer)}
                                    />
                                    <TextButtons
                                        icon={<DeleteFilled/>}
                                        text="Delete"
                                        styleType="style2"
                                        buttonSize="small"
                                        onClick={() => deleteCustomer(customer.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mnextprev-button">
                    {currentPage > 1 && (
                        <TextButtons
                            text="Previous Page"
                            styleType="style3"
                            buttonSize="medium"
                            onClick={() => paginate(currentPage - 1)}
                        />
                    )}
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                        <TextButtons
                            key={pageNumber}
                            text={pageNumber.toString()}
                            styleType={currentPage === pageNumber ? 'style3' : 'style1'}
                            buttonSize="medium"
                            onClick={() => paginate(pageNumber)}
                        />
                    ))}
                    {sortedCustomers.length > indexOfLastCustomer && (
                        <TextButtons
                            text="Next Page"
                            styleType="style3"
                            buttonSize="medium"
                            onClick={() => paginate(currentPage + 1)}
                        />
                    )}
                </div>
            </div>
            <EditUserDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                user={selectedUser}
                onSave={handleSaveEdit}
            />
            <CustomerInfoDialog
                open={customerInfoDialogOpen}
                onClose={handleCloseCustomerInfo}
                customer={selectedCustomer}
            />
        </div>
    );
};

const EditUserDialog = ({ open, onClose, user, onSave }: EditUserDialogProps) => {
    const [editedUser, setEditedUser] = useState<Customer | null>(null);

    useEffect(() => {
        if (user) {
            setEditedUser({ ...user });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedUser) {
            const { name, value } = e.target;
            setEditedUser({ ...editedUser, [name]: value });
        }
    };

    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        {editedUser && (
                            <>
                                <div className="input-row">
                                    <label htmlFor="firstName">First Name:</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editedUser.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-row">
                                    <label htmlFor="lastName">Last Name:</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editedUser.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-row">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button appearance="primary" onClick={() => onSave(editedUser!)}> 
                            Save
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default Manager;