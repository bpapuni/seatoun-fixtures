import Fixture from './Fixture';

const Competition = ({ compName, fixtures }) => {
    const dateDiff = { compName: 365 };
    return (
        <>
           <div className="comp" key={compName}>
                {fixtures.map((match, i) => {
                    const diff = Math.floor((new Date(match.fixtureDate) - new Date()) / (1000 * 60 * 60 * 24));
                    dateDiff.compName = diff > 0 && diff < dateDiff.compName ? diff : dateDiff.compName;
                    return <Fixture key={i} match={match} nextMatch={diff > 0 && diff <= dateDiff.compName} />
                })}
            </div>
        </>
    );
};

export default Competition;