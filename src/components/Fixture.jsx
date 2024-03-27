const Fixture = ({ match, i, nextMatch}) => {
    return (
        <>
            <div key={i} className={nextMatch ? "fixture font-normal next-match" : "fixture font-normal" }>
                <span>
                    <div className="teams">
                        <span>
                            <img className="logo" src={"https:" + match.homeLogo} alt={match.homeTeam + "'s Logo"} />
                            <p>
                                {match.homeTeam}
                                <strong>{match.homeScore}</strong>
                            </p>
                        </span>
                        <span>
                            <img className="logo" src={"https:" + match.awayLogo} alt={match.awayTeam + "'s Logo"} />
                            <p>
                                {match.awayTeam}
                                <strong>{match.awayScore}</strong>
                            </p>
                        </span>
                    </div>
                    <div className="date">
                        <p>{new Date(match.fixtureDate).toLocaleString('en-NZ', {
                            day: 'numeric',
                            month: 'short',
                        })}</p>
                        <p>{new Date(match.fixtureDate).toLocaleString('en-NZ', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        })}</p>
                    </div>
                </span>
                <a href={match.map} target="_blank" rel="noreferrer" >{match.venue}</a>
            </div>
        </>
    );
};

export default Fixture;