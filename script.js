// Define the bandit arms and simulation parameters
let arms = [];
let totalCounts = [];
let totalRewards = [];

// Initialize the arms based on user input
function initializeArms() {
    const numArms = document.getElementById('numArms').value;
    arms = [];
    totalCounts = new Array(Number(numArms)).fill(0);
    totalRewards = new Array(Number(numArms)).fill(0.0);
    const armsInputDiv = document.getElementById('armsInputs');
    armsInputDiv.innerHTML = '';

    for (let i = 0; i < numArms; i++) {
        armsInputDiv.innerHTML += `
            <div>
                <label for="arm${i}">Probability of Arm ${i+1}:</label>
                <input type="number" id="arm${i}" name="arm${i}" step="0.01" min="0" max="1" value="0.5"><br/>
            </div>
        `;
    }
    armsInputDiv.innerHTML += '<button onclick="runSimulation()">Run Simulation</button>';
}

// Run the ε-greedy algorithm simulation
function runSimulation() {
    const numArms = arms.length;
    const numTrials = document.getElementById('numTrials').value; // Get number of trials from user input
    const epsilon = 0.1; // Exploration factor
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Initialize arm probabilities from user inputs
    for (let i = 0; i < numArms; i++) {
        arms[i] = parseFloat(document.getElementById(`arm${i}`).value);
    }

    for (let t = 0; t < numTrials; t++) {
        let chosenArm;
        if (Math.random() < epsilon) {
            // Explore: randomly choose an arm
            chosenArm = Math.floor(Math.random() * numArms);
        } else {
            // Exploit: choose the arm with the highest estimated value
            let bestValue = -1;
            chosenArm = 0;
            for (let i = 0; i < numArms; i++) {
                let estimatedValue = totalRewards[i] / (totalCounts[i] || 1); // Avoid division by zero
                if (estimatedValue > bestValue) {
                    bestValue = estimatedValue;
                    chosenArm = i;
                }
            }
        }

        // Simulate pulling the chosen arm
        const reward = Math.random() < arms[chosenArm] ? 1 : 0;
        totalRewards[chosenArm] += reward;
        totalCounts[chosenArm]++;
    }

    // Update the webpage with the results
    for (let i = 0; i < numArms; i++) {
        const estimatedValue = totalRewards[i] / totalCounts[i];
        resultsDiv.innerHTML += `<p>Arm ${i + 1} (Prob: ${arms[i].toFixed(2)}): Estimated Value = ${estimatedValue.toFixed(3)}, Trials = ${totalCounts[i]}</p>`;
    }
}
