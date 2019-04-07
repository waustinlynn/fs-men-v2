export function teamsToDisplayTeams(teams, playerMap) {
    let dispTeams = [];
    teams.forEach(team => {
        let player1 = playerMap.get(team.players[0]);
        let player2 = playerMap.get(team.players[1]);
        dispTeams.push(
            {
                id: team.id,
                teamName: team.name,
                names: `${player1.firstName} ${player1.lastName} | ${player2.firstName} ${player2.lastName}`
            }
        );
    });
    return dispTeams;
}

export function divisionsToDisplayDivisions(divisions, dispTeams) {
    let dispMap = {};
    dispTeams.forEach(team => {
        dispMap[team.id] = team;
    });
    let dispDivisions = [];
    divisions.forEach(division => {
        let teamList = [];
        division.teams.forEach(teamId => {
            teamList.push(dispMap[teamId]);
        });
        dispDivisions.push({
            divisionName: division.divisionName,
            teams: teamList,
            id: division.id
        });
    });
    return dispDivisions;
}