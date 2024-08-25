document.addEventListener('DOMContentLoaded', function() {
    const gameBotName = "GameBot";
    const gameBotMessages = document.getElementById("messages");
    const userInput = document.getElementById("userInput");
    const genres = ["Sports", "Action", "Shooter", "Open-World", "Sandbox", "Action RPG", "Battle Royale", "Racing", "Fighting", "Adventure", "Survival", "Stealth"];
    let awaitingInputFor = null;
    let tempGameData = {};

    // Load game dataset from localStorage or use default dataset
    let gameDataset = JSON.parse(localStorage.getItem('gameDataset')) || [
        { "name": "FIFA 23", "genre": "Sports", "description": "The latest installment in the FIFA series, featuring updated rosters and gameplay improvements." },
        { "name": "NBA 2K24", "genre": "Sports", "description": "The latest entry in the NBA 2K series, offering realistic basketball simulation and updated team rosters." },
        { "name": "God of War Ragnarök", "genre": "Action", "description": "The sequel to the critically acclaimed God of War, continuing Kratos' journey through Norse mythology." },
        { "name": "Call of Duty: Modern Warfare II", "genre": "Shooter", "description": "A reboot of the classic Call of Duty game with modern graphics and updated gameplay." },
        { "name": "Grand Theft Auto V", "genre": "Action", "description": "An open-world action game set in the fictional city of Los Santos, featuring an engaging story and extensive multiplayer options." },
        { "name": "Red Dead Redemption II", "genre": "Action", "description": "An open-world action game set in the American frontier with a deep story and immersive gameplay." },
        { "name": "The Legend of Zelda: Breath of the Wild", "genre": "Adventure", "description": "An open-world adventure game set in a vast, magical land with exploration and puzzle-solving." },
        { "name": "Minecraft", "genre": "Sandbox", "description": "A sandbox game that allows players to build and explore virtual worlds made of blocks." },
        { "name": "Horizon Forbidden West", "genre": "Action RPG", "description": "The sequel to Horizon Zero Dawn, featuring a vast open world and robotic creatures in a post-apocalyptic setting." },
        { "name": "Assassin's Creed Valhalla", "genre": "Action RPG", "description": "An action RPG set in the Viking era with exploration, combat, and story-driven quests." },
        { "name": "Apex Legends", "genre": "Battle Royale", "description": "A free-to-play battle royale game with unique characters and fast-paced action." },
        { "name": "Fortnite", "genre": "Battle Royale", "description": "A popular battle royale game with building mechanics and frequent updates." },
        { "name": "F1 23", "genre": "Racing", "description": "The latest installment in the F1 racing series, featuring realistic racing simulations and updated tracks." },
        { "name": "Madden NFL 24", "genre": "Sports", "description": "The latest entry in the Madden NFL series, offering updated team rosters and gameplay improvements." },
        { "name": "Forza Horizon 5", "genre": "Racing", "description": "An open-world racing game set in a detailed recreation of Mexico with a wide variety of cars." },
        { "name": "Tekken 8", "genre": "Fighting", "description": "The latest installment in the Tekken series, featuring new characters and updated combat mechanics." },
        { "name": "Street Fighter VI", "genre": "Fighting", "description": "The newest entry in the Street Fighter series, with updated graphics and gameplay." },
        { "name": "Overwatch 2", "genre": "Shooter", "description": "A team-based shooter with new characters, maps, and gameplay modes." },
        { "name": "Starfield", "genre": "Action RPG", "description": "An expansive space RPG with deep exploration and a rich narrative." },
        { "name": "Death Stranding", "genre": "Action", "description": "An open-world action game with a unique delivery-based gameplay and a deep, mysterious story." },
        { "name": "Ghost of Tsushima", "genre": "Action", "description": "An open-world action game set in feudal Japan with a focus on samurai combat and exploration." },
        { "name": "Control", "genre": "Action", "description": "An action-adventure game with a supernatural storyline and dynamic, telekinetic combat." },
        { "name": "Dying Light 2", "genre": "Action RPG", "description": "A sequel to Dying Light, featuring a post-apocalyptic world with parkour-based gameplay and a branching narrative." },
        { "name": "Sekiro: Shadows Die Twice", "genre": "Action", "description": "An action-adventure game set in a reimagined feudal Japan with challenging combat and stealth mechanics." },
        { "name": "Bloodborne", "genre": "Action RPG", "description": "An action RPG set in a gothic horror world with fast-paced combat and a dark narrative." },
        { "name": "Nioh 2", "genre": "Action RPG", "description": "A challenging action RPG with a story set in a fantastical version of Japan and deep combat mechanics." },
        { "name": "The Last of Us Part II", "genre": "Action", "description": "The sequel to The Last of Us, continuing the story of Ellie in a post-apocalyptic world." },
        { "name": "Days Gone", "genre": "Action", "description": "An open-world action game set in a post-apocalyptic world overrun by zombies." },
        { "name": "Gears 5", "genre": "Shooter", "description": "The latest entry in the Gears of War series, featuring a deep story and intense third-person shooting." },
        { "name": "Halo Infinite", "genre": "Shooter", "description": "The newest installment in the Halo series, with a return to the franchise's roots and expansive multiplayer." },
        { "name": "Far Cry 6", "genre": "Action", "description": "An open-world action game set in a fictional Caribbean island with a focus on guerrilla warfare and exploration." },
        { "name": "Assassin's Creed Odyssey", "genre": "Action RPG", "description": "An action RPG set in Ancient Greece with a vast open world and a story-driven narrative." },
        { "name": "Metro Exodus", "genre": "Action", "description": "A story-driven FPS set in a post-apocalyptic Russia with an open-world structure and survival elements." },
        { "name": "Hitman 3", "genre": "Stealth", "description": "The final installment in the Hitman trilogy, featuring stealth-based gameplay and intricate assassination missions." },
        { "name": "The Witcher 3: Wild Hunt", "genre": "RPG", "description": "An open-world RPG with a rich narrative and complex characters set in a dark fantasy world." }
    ];

    function saveGameDataset() {
        localStorage.setItem('gameDataset', JSON.stringify(gameDataset));
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + className;
        messageDiv.textContent = text;
        gameBotMessages.appendChild(messageDiv);
        gameBotMessages.scrollTop = gameBotMessages.scrollHeight;
    }

    function addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message loading';
        loadingDiv.textContent = 'GameBot is typing...';
        gameBotMessages.appendChild(loadingDiv);
        gameBotMessages.scrollTop = gameBotMessages.scrollHeight;
        return loadingDiv;
    }

    function removeLoadingMessage(loadingDiv) {
        loadingDiv.remove();
    }

    function initialGreeting() {
        setTimeout(() => {
            addMessage(`Hello! I'm ${gameBotName}, your gaming buddy.`, 'bot-message');
            showOptions();
        }, 700);
    }

    function showOptions() {
        addMessage("You can either ask for a random game (Just ask 'suggest me a game') or ask for a genre (Just ask 'Genre')", 'bot-message');
    }

    function displayGenreOptions() {
        addMessage("Choose a genre from the list: " + genres.join(", "), 'bot-message');
    }

    function processUserInput() {
        const userText = userInput.value.trim();
        if (!userText) return;

        addMessage(userText, 'user-message');
        userInput.value = '';

        const loadingDiv = addLoadingMessage();

        setTimeout(() => {
            removeLoadingMessage(loadingDiv);
            const lowerCaseText = userText.toLowerCase();

            if (awaitingInputFor === "suggestGameGenre") {
                suggestGame(lowerCaseText);
                awaitingInputFor = null;
            } else if (awaitingInputFor === "newGameName") {
                tempGameData.name = userText;

                if (tempGameData.name && tempGameData.genre && tempGameData.description) {
                    gameDataset.push(tempGameData);
                    saveGameDataset();
                    addMessage(`${tempGameData.name} has been added to the game list!`, 'bot-message');
                    tempGameData = {};
                } else {
                    addMessage("Now enter the genre of the game:", 'bot-message');
                    awaitingInputFor = "newGameGenre";
                }
            } else if (awaitingInputFor === "newGameGenre") {
                tempGameData.genre = userText;

                if (tempGameData.name && tempGameData.genre && tempGameData.description) {
                    gameDataset.push(tempGameData);
                    saveGameDataset();
                    addMessage(`${tempGameData.name} has been added to the game list!`, 'bot-message');
                    tempGameData = {};
                } else {
                    addMessage("Now enter the description of the game:", 'bot-message');
                    awaitingInputFor = "newGameDescription";
                }
            } else if (awaitingInputFor === "newGameDescription") {
                tempGameData.description = userText;

                if (tempGameData.name && tempGameData.genre && tempGameData.description) {
                    gameDataset.push(tempGameData);
                    saveGameDataset();
                    addMessage(`${tempGameData.name} has been added to the game list!`, 'bot-message');
                    tempGameData = {};
                } else {
                    addMessage("The game data is incomplete. Please try again.", 'bot-message');
                }
            } else {
                if (lowerCaseText.includes('suggest') || lowerCaseText.includes('new') || lowerCaseText.includes('another') && lowerCaseText.includes('game')) {
                    suggestRandomGame();
                } else if (lowerCaseText.includes('genre')) {
                    displayGenreOptions();
                    awaitingInputFor = "suggestGameGenre";
                } else if (lowerCaseText.includes('add')) {
                    addMessage("Sure! Please enter the name of the game:", 'bot-message');
                    awaitingInputFor = "newGameName";
                } else {
                    addMessage("I'm not sure how to help with that. Try asking for a game suggestion or a genre.", 'bot-message');
                    showOptions();
                }
            }
        }, 700);
    }

    function suggestRandomGame() {
        const randomGame = gameDataset[Math.floor(Math.random() * gameDataset.length)];
        addMessage(`How about playing ${randomGame.name}? It's a ${randomGame.genre} game. ${randomGame.description}`, 'bot-message');
    }

    function suggestGame(genre) {
        const filteredGames = gameDataset.filter(game => game.genre.toLowerCase() === genre.toLowerCase());

        if (filteredGames.length > 0) {
            const randomGame = filteredGames[Math.floor(Math.random() * filteredGames.length)];
            addMessage(`I suggest you try ${randomGame.name}. It's a ${randomGame.genre} game. ${randomGame.description}`, 'bot-message');
        } else {
            addMessage(`Sorry, I don't have any games in the ${genre} genre.`, 'bot-message');
        }
    }

    // Initialize chat
    initialGreeting();

    // Send button event listener
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.addEventListener('click', processUserInput);

    // Enter key event listener
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            processUserInput();
        }
    });
});