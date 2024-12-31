document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const endBtn = document.getElementById('end-btn');
    const gameScreen = document.getElementById('game-screen');
    const playerInputs = document.getElementById('player-inputs');
    const saveRound = document.getElementById('save-round');
    const playAgain = document.getElementById('play-again');
    const results = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');

    let players = [];
    let currentRound = [];

    startBtn.addEventListener('click', startGame);
    endBtn.addEventListener('click', endGame);
    saveRound.addEventListener('click', saveRoundScores);
    playAgain.addEventListener('click', addNewRound);

    function startGame() {
        const numPlayers = prompt('How many players?');
        if (numPlayers && numPlayers > 0) {
            players = [];
            for (let i = 0; i < numPlayers; i++) {
                const name = prompt(`Enter name for Player ${i + 1}`);
                players.push({
                    name: name || `Player ${i + 1}`,
                    scores: [],
                    total: 0
                });
            }
            createInputFields();
            gameScreen.style.display = 'block';
            startBtn.disabled = true;
            endBtn.disabled = false;
        }
    }

    function createInputFields() {
        playerInputs.innerHTML = '';
        players.forEach((player, index) => {
            const div = document.createElement('div');
            div.className = 'input-group';
            div.innerHTML = `
                <label>${player.name}</label>
                <input type="number" id="player-${index}" placeholder="Enter score">
            `;
            playerInputs.appendChild(div);
        });
    }

    function saveRoundScores() {
        currentRound = [];
        players.forEach((player, index) => {
            const score = parseInt(document.getElementById(`player-${index}`).value) || 0;
            player.scores.push(score);
            player.total += score;
            currentRound.push(score);
        });
        alert('Scores saved!');
    }

    function addNewRound() {
        createInputFields();
    }

    function endGame() {
        const winner = players.reduce((prev, curr) => 
            curr.total < prev.total ? curr : prev
        );

        resultsContent.innerHTML = `
            <h3>Winner: ${winner.name} (Total: ${winner.total})</h3>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Scores</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${players.map(player => `
                        <tr>
                            <td>${player.name}</td>
                            <td>${player.scores.join(', ')}</td>
                            <td>${player.total}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        gameScreen.style.display = 'none';
        results.style.display = 'block';
        startBtn.disabled = false;
        endBtn.disabled = true;

        saveGameToDB();
    }

    async function saveGameToDB() {
        try {
            const response = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ players })
            });
            if (!response.ok) throw new Error('Failed to save game');
            alert('Game saved successfully!');
        } catch (error) {
            console.error('Error saving game:', error);
            alert('Failed to save game');
        }
    }

    // Load previous games on page load
    async function loadPreviousGames() {
        try {
            const response = await fetch('/api/games');
            if (!response.ok) throw new Error('Failed to load games');
            const games = await response.json();
            if (games.length > 0) {
                resultsContent.innerHTML += '<h3>Previous Games:</h3>';
                games.forEach(game => {
                    resultsContent.innerHTML += `
                        <div class="previous-game">
                            <p>Date: ${new Date(game.createdAt).toLocaleString()}</p>
                            <ul>
                                ${game.players.map(player => `
                                    <li>${player.name}: ${player.scores.join(', ')} (Total: ${player.total})</li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                });
            }
        } catch (error) {
            console.error('Error loading games:', error);
        }
    }

    loadPreviousGames();
});
