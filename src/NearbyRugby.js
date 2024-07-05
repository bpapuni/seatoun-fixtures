import React, { useEffect, useState } from 'react';
import Fixture from './components/Fixture';

function NearbyRugby() {
    const [dataCache, setDataCache] = useState([]);
    let dateDiff = 365;

    async function fetchData() {
        const response = await fetch("/api/v1/nearbyrugby");
        const data = await response.json(); // Parse response JSON
        
        setDataCache(data);
    }

    useEffect(() => {
        fetchData();
    }, [])
    
    return (
        <>
            {dataCache.map((match, i) => {
                const diff = Math.floor(new Date(match.fixtureDate) - new Date()) / (1000 * 60 * 60 * 24);
                dateDiff = diff >= 0 && diff <= dateDiff ? diff : dateDiff;
                return <Fixture key={i} match={match} nextMatch={diff >= 0 && diff <= dateDiff} />
            })}
        </>
    )
}

export default NearbyRugby;