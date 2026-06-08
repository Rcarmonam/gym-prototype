import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-components";

const CustomerInfoDialog: React.FC<CustomerInfoDialogProps> = ({ open, onClose, customer }) => {
    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Customer Information</DialogTitle>
                    <DialogContent>
                        {customer && (
                            <>
                                <div>
                                    <strong>First Name:</strong> {customer.firstName}
                                </div>
                                <div>
                                    <strong>Last Name:</strong> {customer.lastName}
                                </div>
                                <div>
                                    <strong>Email:</strong> {customer.email}
                                </div>
                                <div>
                                    <strong>Membership Tier:</strong> {customer.membershipType}
                                </div>
                                <div>
                                    <strong>Gender:</strong> {customer.genderValue}
                                </div>
                                <div>
                                    <strong>Price:</strong> {customer.price}
                                </div>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={onClose}>
                            Close
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default CustomerInfoDialog;