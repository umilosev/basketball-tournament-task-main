const {simulateMatch, probabilityVictory, calculateFormAdjustment} = require(`./simulate`)

function simulateQuarterFinalBracket(quarterFinalPairs, formData) {
    console.log("\nQuarterfinals Bracket:\n");
    
    const quarterFinalWinners = [];
    
    quarterFinalPairs.forEach((pair, index) => {
        const result = simulateMatch(pair[0], pair[1], formData);
        console.log(`   Mec ${index + 1}: ${pair[0].Team} vs ${pair[1].Team}`);
        console.log(`   Rezultat: ${result.pointsTeam1} - ${result.pointsTeam2}`);
        
        // Store the winner for semifinal matchups
        quarterFinalWinners.push(result.victor);
    });
    
    return quarterFinalWinners;
}

function simulateSemiFinalsAndFinal(semiFinalPairs, formData) {
    console.log("\nSemifinals Bracket:\n");

    const finalPair = [];
    const thirdPlacePair = [];

    // Simulate the first semifinal match (between the first and second teams in the list)
    let matchResult1 = simulateMatch(semiFinalPairs[0], semiFinalPairs[1], formData);
    console.log(`   Semifinal Match 1: ${semiFinalPairs[0].Team} vs ${semiFinalPairs[1].Team}`);
    console.log(`   Rezultat: ${matchResult1.pointsTeam1} - ${matchResult1.pointsTeam2}`);

    // Simulate the second semifinal match (between the third and fourth teams in the list)
    let matchResult2 = simulateMatch(semiFinalPairs[2], semiFinalPairs[3], formData);
    console.log(`   Semifinal Match 2: ${semiFinalPairs[2].Team} vs ${semiFinalPairs[3].Team}`);
    console.log(`   Rezultat: ${matchResult2.pointsTeam1} - ${matchResult2.pointsTeam2}`);

    // The winners go to the final, and the losers go to the third-place match
    finalPair.push(matchResult1.victor, matchResult2.victor);
    thirdPlacePair.push(matchResult1.defeated, matchResult2.defeated);

    // Simulate the third-place match
    console.log("\nThird Place Match:\n");
    const thirdPlaceResult = simulateMatch(thirdPlacePair[0], thirdPlacePair[1], formData);
    console.log(`   ${thirdPlacePair[0].Team} vs ${thirdPlacePair[1].Team}`);
    console.log(`   Rezultat: ${thirdPlaceResult.pointsTeam1} - ${thirdPlaceResult.pointsTeam2}`);



    // Simulate the final match
    console.log("\nFinal Match:\n");
    const finalResult = simulateMatch(finalPair[0], finalPair[1], formData);
    console.log(`   ${finalPair[0].Team} vs ${finalPair[1].Team}`);
    console.log(`   Rezultat : ${finalResult.pointsTeam1} - ${finalResult.pointsTeam2}`)

    console.log(`\n------------------------\n\n   Final Winner: ${finalResult.victor.Team}`);
    console.log(`   Runner-Up: ${finalResult.defeated.Team}`);
    console.log(`   Third Place Winner: ${thirdPlaceResult.victor.Team}\n`);

}



module.exports = {
    simulateQuarterFinalBracket, 
    simulateSemiFinalsAndFinal
};