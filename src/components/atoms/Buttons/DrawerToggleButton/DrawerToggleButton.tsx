import { Button, makeStyles } from '@fluentui/react-components';
import { Add32Filled } from '@fluentui/react-icons';


interface fitnessCalendarDrawerProps {
  onClick: () => void;
  text: String;
  icon: any;
}

const useStyles = makeStyles ({
  drawerToggleButton: {
    "&:hover": {
      backgroundColor: 'var(--surface3);', 
    },
  }
}) 

const DrawerToggleButton: React.FC<fitnessCalendarDrawerProps> = ({
  
  onClick,
  text,
  icon,
}) => {
  const styles = useStyles();
  return (
    <div>
      <Button icon={icon} size="large" onClick={onClick} className={styles.drawerToggleButton}>
        {text}
      </Button>
    </div>
  );
};

export default DrawerToggleButton;
