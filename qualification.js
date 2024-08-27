function getQualifiedTeams(results) {
    // Prikupi sve timove iz svih grupa
    // ovde lomimo organizaciju objekta results iz lista grupa koje sadrzi liste timova na listu timova sto ce nam biti korisno za kasnije
    let allTeams = [];
    for (const group in results) {
        allTeams = allTeams.concat(results[group]);
    }
    allTeams.sort((a, b) => {
        if (b.points === a.points) {
            if (b.basketDifference === a.basketDifference) {
                return b.basketsScored - a.basketsScored;
            }
            return b.basketDifference - a.basketDifference;
        }
        return b.points - a.points;
    });

    // Izaberi 8 najboljih timova (za pretpostavku da treba 8 timova za eliminacionu fazu)
    const qualifiedTeams = allTeams.slice(0, 8);
    console.log(`\n Tim - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika \n`)
    qualifiedTeams.forEach((team, index) => {
        console.log(`${index + 1}. ${team.Team} / ${team.victories} / ${team.defeats} / ${team.points} / ${team.basketDifference} / ${team.basketsScored} / ${team.receivedBaskets} `);
    });
    //vracamo timove i njihove rezultate iz grupa
    return qualifiedTeams;
}

module.exports = getQualifiedTeams;