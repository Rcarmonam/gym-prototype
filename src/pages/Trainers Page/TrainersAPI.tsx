import './TrainersAPI.css'
import { useEffect, useState } from "react";
import axios from 'axios'
import {
    Avatar,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    makeStyles,
} from "@fluentui/react-components";

const useStyles = makeStyles({
    card: {
        width: "20rem",
        height: "25rem",
        backgroundColor: 'var(--surface1);',
    },

    headerImage: {
        width: '20rem',
        height: '15rem',
    },

    customCardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

const TrainerAPI = () => {
    const styles = useStyles();
    const [newsData, setNewsData] = useState([]);

    async function getNewsData() {
        const resp = await axios.get("https://newsapi.org/v2/everything?q=Gym Workouts&apiKey=95004f62a7544925a0b9ec28e9db0d9b");
        setNewsData(resp.data.articles);
    }

    const truncateText = (text: any, maxLength: any) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else {
            return text;
        }
    };

    useEffect(() => {
        getNewsData();
    }, []);

    return (
        <div>
            <div className='news-feed-title'>
                Fitness News Feed
            </div>
            <div className="card-container">
                {newsData.map((newsData: any, index: any) =>
                    <Card className={styles.card} key={index}>
                        <CardHeader
                            header={
                                <div>
                                    <div className='card-header-source'>
                                        {newsData.source.name}
                                    </div>
                                    <div className='card-header-trainers-api'>
                                        <Avatar name={newsData.author} active="active" />
                                        <div className='newsData-title'>
                                            {newsData.title}
                                        </div>
                                    </div>
                                </div>
                            }
                        />

                        <CardPreview className={styles.headerImage} >
                            <img
                                src={newsData.urlToImage}
                            />
                        </CardPreview>

                        <CardFooter className={styles.customCardFooter} >
                            <div>
                                {truncateText(newsData.description, 100)}
                                {newsData.description.length > 100 && (
                                    <span>
                                        {' '}
                                        <a href={newsData.url} style={{color: 'white'}}>
                                            read more
                                        </a>
                                    </span>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                )}
            </div>

        </div>
    );
}

export default TrainerAPI;