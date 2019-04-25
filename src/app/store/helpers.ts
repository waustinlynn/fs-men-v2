export const dateRangeMap = {
    'Week 1': '5/5-5/11',
    'Week 2': '5/12-5/18',
    'Week 3': '5/19-5/25',
    'Week 4': '5/26-6/1',
    'Week 5': '6/2-6/8',
    'Week 6': '6/9-6/15',
    'Week 7': '6/16-6/22',
    'Week 8': '6/23-6/27'
} as any;

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

export function reverseScore(score) {
    return score.split(',').map(el => {
        let gameCounts = el.split('-');
        return `${gameCounts[1]}-${gameCounts[0]}`;
    }).join(',');
}