import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../index.js';

const useTrainers = () => {
    const [trainers, setTrainers] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const trainersData: { [key: string]: any } = {};
                const querySnapshot = await getDocs(collection(db, 'Trainers'));
                
                if (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        trainersData[doc.id] = doc.data();
                    });
                }
                console.log("got trainers")
                setTrainers(trainersData);
            } catch (e) {
                console.log(e);
            }
        };

        fetchTrainers();
    }, []);

    return { trainers };
};

export default useTrainers;
