import {
  makeStyles,
  Caption1,
  Button,
  Card,
  CardHeader,
  CardFooter,
  useId,
  Link,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastTrigger,
  tokens,
  Avatar,
  CardPreview,
  ToastBody,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import PremadeViewCard from '../../organisms/PremadeWorkoutCards/PremadeViewCard.tsx';
import { useState } from 'react';
import useWorkoutCardData from '../PremadeUse/UseWorkoutCardData.tsx';

const useStyles = makeStyles({
  card: {
    width: '20rem',
    height: '22rem',
    backgroundColor: 'var(--surface1);',
  },

  headerImage: {
    maxWidth: '100%',
    maxHeight: '12rem',
  },

  caption: {
    color: tokens.colorNeutralForeground3,
  },

  customCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'auto',
  },

  toast: {
    backgroundColor: 'var(--surface1);',
  },
});

interface PremadeWorkoutCardProps {
  description?: any;
  trainer?: any;
  workoutName?: any;
  imageSrc?: any;
}

const PremadeWorkoutCard: React.FC<PremadeWorkoutCardProps> = ({
  description = '',
  trainer = '',
  workoutName = '',
  imageSrc = '',
}) => {
  const styles = useStyles();
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { premadeToQuickAdd } = useWorkoutCardData();

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const notify = () =>
    dispatchToast(
      <Toast
        className={styles.toast}
        onClick={(event) => event.stopPropagation()}
      >
        <ToastTitle
          action={
            <ToastTrigger>
              <Link>Dismiss</Link>
            </ToastTrigger>
          }
        >
          Workout Added!
        </ToastTitle>
        <ToastBody>Selected workout was added to the Quick add</ToastBody>
      </Toast>,
      { position: 'top-end', intent: 'success' }
    );

  return (
    <div onClick={handleDrawerToggle}>
      <Card className={styles.card}>
        <CardHeader
          image={
            <Avatar
              name={trainer}
              size={48}
              active="active"
              activeAppearance="ring-shadow"
            />
          }
          header={workoutName}
          description={
            <Caption1 className={styles.caption}>Trainer: {trainer}</Caption1>
          }
          action={
            <div>
              <Toaster toasterId={toasterId} limit={5} />
              <Button
                appearance="transparent"
                icon={<AddRegular />}
                aria-label="More options"
                onClick={(event) => {
                  event.stopPropagation();
                  premadeToQuickAdd(workoutName);
                  notify();
                }}
              />
            </div>
          }
        />
        <CardPreview>
          <img className={styles.headerImage} src={imageSrc} />
        </CardPreview>
        <CardFooter className={styles.customCardFooter}>
          <div className="workoutcard-description">{description}</div>
        </CardFooter>
        <PremadeViewCard
          workoutName={workoutName}
          trainer={trainer}
          description={description}
        />
      </Card>
    </div>
  );
};

export default PremadeWorkoutCard;
