import Fixture from './Fixture';

const Competition = ({ compName, fixtures }) => {
    return (
        <>
           <div className="comp" key={compName}>
                {fixtures.map((match, i) => (
                    <Fixture key={i} match={match} />
                ))}
            </div>
        </>
    );
};

export default Competition;