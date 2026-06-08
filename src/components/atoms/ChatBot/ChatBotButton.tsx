import {
    makeStyles,
    Button,
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from "@fluentui/react-components";
import { ChatSparkleRegular } from "@fluentui/react-icons";
import ChatBot from "./ChatBot.tsx";

const useStyles = makeStyles({
    surface: {
        backgroundColor: 'var(--surface1)',
    },
    triggerButton: {
        width: '8rem',
        marginLeft: '40rem'
    }

});

const ChatBotButton = () => {
    const styles = useStyles();
    return (
        <div>
            <Popover>
                <PopoverTrigger disableButtonEnhancement>
                    <Button 
                        className={styles.triggerButton}
                        icon={<ChatSparkleRegular />}
                        size='large' 
                        appearance="transparent"
                    > Guac </Button>
                </PopoverTrigger>
                <PopoverSurface className={styles.surface}>
                    <ChatBot />
                </PopoverSurface>
            </Popover>
        </div>
    )
}

export default ChatBotButton;