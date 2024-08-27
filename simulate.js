const fs = require('fs');

// Function to simulate a match considering form
function simulateMatch(team1, team2, formData) {
    if (!team1 || !team2) {
        console.error("One of the teams is undefined:", { team1, team2 });
        return null; // or handle the error appropriately
    }

    // Calculate form adjustment based on past results
    const formAdjustment = calculateFormAdjustment(team1, team2, formData);

    const victoryProb = probabilityVictory(team1.FIBARanking, team2.FIBARanking, formAdjustment);

    // Variables for number of threes and twos
    let threes1, twos1, threes2, twos2;
    let whoWon = Math.random();

    // Determine winner and adjust points
    if (whoWon < victoryProb) {
        threes1 = (Math.random() * 20) + 10;
        twos1 = (Math.random() * 20) + 8;

        threes2 = (Math.random() * 15) + 5;
        twos2 = (Math.random() * 18) + 2;
    } else {
        threes1 = (Math.random() * 15) + 5;
        twos1 = (Math.random() * 18) + 2;

        threes2 = (Math.random() * 15) + 10;
        twos2 = (Math.random() * 18) + 8;
    }

    if (whoWon === victoryProb) {
        threes1 = (Math.random() * 20);
        twos1 = (Math.random() * 20);

        threes2 = (Math.random() * 20);
        twos2 = (Math.random() * 20);
    }

    let basketsTeam1 = Math.round(threes1) + Math.round(twos1);
    let basketsTeam2 = Math.round(threes2) + Math.round(twos2);

    // Calculate total points
    let pointsTeam1 = Math.round(threes1) * 3 + Math.round(twos1) * 2;
    let pointsTeam2 = Math.round(threes2) * 3 + Math.round(twos2) * 2;
    let defeated, victor;

    while (pointsTeam1 === pointsTeam2) {
        threes1 = (Math.random() * 3);
        twos1 = (Math.random() * 5);

        threes2 = (Math.random() * 3);
        twos2 = (Math.random() * 5);

        basketsTeam1 +=  Math.round(threes1) + Math.round(twos1);
        basketsTeam2 += Math.round(threes2) + Math.round(twos2);

        pointsTeam1 += Math.round(threes1) * 3 + Math.round(twos1) * 2;
        pointsTeam2 += Math.round(threes2) * 3 + Math.round(twos2) * 2;
    } 
        // Determine winner
        victor = pointsTeam1 > pointsTeam2 ? team1 : team2;
        defeated = victor === team1 ? team2 : team1;
    

    saveMatchResult(team1, team2, pointsTeam1, pointsTeam2, formData);

    return {
        victor: victor,
        defeated: defeated,
        basketsTeam1: basketsTeam1,
        basketsTeam2: basketsTeam2,
        pointsTeam1: pointsTeam1,
        pointsTeam2: pointsTeam2
    };
}

// Funkcija za izračunavanje verovatnoće pobede uzimajući u obzir formu
function probabilityVictory(rankA, rankB, formAdjustment, k = 0.2) {
    const deltaRank = rankA - rankB + formAdjustment;
    return 1 / (1 + Math.exp(k * deltaRank));
} 

// Calculate form adjustment based on past results
function calculateFormAdjustment(team1, team2, formData) {
    let formAdjustments = [];

    // Check for past matches of team1 against team2
    const team1Exhibitions = formData[team1.ISOCode] || [];
    team1Exhibitions.forEach(match => {
        if (match.Opponent === team2.ISOCode) {
            const scoreDifference = parseResult(match.Result);
            formAdjustments.push(Math.round(scoreDifference / 5)); // Positive for own perspective
        }
    });

    // Average the adjustments
    const totalAdjustment = formAdjustments.reduce((sum, adj) => sum + adj, 0);
    return formAdjustments.length ? totalAdjustment / formAdjustments.length : 0;
}

// Parse result from a match string, e.g., "66-90" -> -24
function parseResult(result) {
    const [score1, score2] = result.split('-').map(Number);
    return score1 - score2;
}

// Function to save match result to exhibitions.json
function saveMatchResult(team1, team2, pointsTeam1, pointsTeam2, formData) {

    const newMatch1 = {
        Date: new Date().toISOString().split('T')[0],
        Opponent: team2.ISOCode,
        Result: `${pointsTeam1}-${pointsTeam2}`
    };

    const newMatch2 = {
        Date: new Date().toISOString().split('T')[0],
        Opponent: team1.ISOCode,
        Result: `${pointsTeam2}-${pointsTeam1}`
    };

    if (!formData[team1.ISOCode]) {
        formData[team1.ISOCode] = [];
    }
    formData[team1.ISOCode].push(newMatch1);

    if (!formData[team2.ISOCode]) {
        formData[team2.ISOCode] = [];
    }
    formData[team2.ISOCode].push(newMatch2);

    fs.writeFileSync('exhibitions.json', JSON.stringify(formData, null, 2));
}

module.exports = {
    simulateMatch,
    calculateFormAdjustment,
    probabilityVictory
};