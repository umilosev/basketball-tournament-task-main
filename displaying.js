// Funkcija za prikaz konačnog rangiranja
function displayGroupRanking(results) {
    for (const group in results) {
        const teams = results[group];
        teams.sort((a, b) => {
            if (b.points === a.points) {
                return b.basketDifference - a.basketDifference;
            }
            return b.points - a.points;
        });

        console.log(`\nGroup ${group}:`);
        teams.forEach((team, index) => {
            console.log(`${index + 1}. ${team.Team} - wins: ${team.victories}, losses: ${team.defeats}, points: ${team.points}, scored baskets: ${team.basketsScored}, received baskets: ${team.receivedBaskets}, basket difference: ${team.basketDifference}`);
        });
        console.log('');
    }
}

module.exports = {
    displayGroupRanking,
};