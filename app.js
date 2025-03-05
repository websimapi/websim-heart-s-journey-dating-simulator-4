import { createApp, ref, reactive, onMounted, watch } from 'vue';

const app = createApp({
    setup() {
        // Game state
        const currentScreen = ref('loading');
        const loadingProgress = ref(0);
        const loadingMessage = ref('Loading game...');
        const hasSavedGame = ref(false);
        const showGameMenu = ref(false);
        
        // Selected character and location
        const currentCharacter = ref(null);
        const currentLocation = ref(null);
        
        // Dialogue system
        const currentDialogue = ref('');
        const dialogueChoices = ref([]);
        const dialogueQueue = ref([]);
        
        // Settings
        const settings = reactive({
            textToSpeech: false,
            textSpeed: 5,
            voicePitch: 1,
            voiceRate: 1
        });
        
        // Game data
        const characters = reactive([
            {
                id: 1,
                name: 'Alex',
                shortBio: 'An ambitious photographer who loves adventure and the outdoors.',
                interests: ['photography', 'hiking', 'travel'],
                fullBio: 'Alex is always looking for the next great shot. Whether scaling mountains or exploring hidden urban corners, their camera is always ready to capture life\'s beauty.',
                imageSrc: null,
                memory: []
            },
            {
                id: 2,
                name: 'Jamie',
                shortBio: 'A tech entrepreneur with a love for sci-fi and board games.',
                interests: ['technology', 'sci-fi', 'board games'],
                fullBio: 'Jamie built their first startup at 19 and hasn\'t slowed down since. When not coding or pitching to investors, they host legendary board game nights with friends.',
                imageSrc: null,
                memory: []
            },
            {
                id: 3,
                name: 'Morgan',
                shortBio: 'A passionate chef who dreams of opening their own restaurant.',
                interests: ['cooking', 'food culture', 'farmers markets'],
                fullBio: 'Morgan can turn simple ingredients into culinary masterpieces. They\'ve traveled the world studying different cuisines and are now planning their own fusion restaurant.',
                imageSrc: null,
                memory: []
            },
            {
                id: 4,
                name: 'Taylor',
                shortBio: 'A marine biologist with contagious enthusiasm for ocean life.',
                interests: ['marine biology', 'diving', 'conservation'],
                fullBio: 'Taylor spends as much time underwater as possible. Their research on coral reef preservation has been published internationally, and they volunteer teaching kids about ocean conservation.',
                imageSrc: null,
                memory: []
            },
            {
                id: 5,
                name: 'Kai',
                shortBio: 'A laid-back musician who plays in local venues on weekends.',
                interests: ['music', 'songwriting', 'vintage vinyl'],
                fullBio: 'Kai\'s soulful voice and guitar skills have earned them a dedicated local following. By day they work at a music store, by night they light up venues with original compositions.',
                imageSrc: null,
                memory: []
            }
        ]);
        
        const locations = reactive([
            {
                id: 1,
                name: 'Cozy Café',
                shortDesc: 'A charming café with a warm atmosphere.',
                fullDesc: 'Soft jazz plays in the background as the aroma of freshly ground coffee fills the air. Art from local artists decorates the exposed brick walls, and comfortable seating invites lengthy conversations.',
                imageSrc: null
            },
            {
                id: 2,
                name: 'Sunset Beach',
                shortDesc: 'A beautiful beach with golden sands and stunning views.',
                fullDesc: 'Waves gently lap against the shore as the sun dips toward the horizon, painting the sky in brilliant oranges and pinks. A few people stroll along the water\'s edge, enjoying the peaceful end of day.',
                imageSrc: null
            },
            {
                id: 3,
                name: 'Central Park',
                shortDesc: 'A vibrant park with lush greenery and a small lake.',
                fullDesc: 'Towering trees provide dappled shade over winding paths. Flowers bloom in carefully maintained gardens, while the central lake reflects the blue sky. The sounds of laughter and conversation blend with birdsong.',
                imageSrc: null
            },
            {
                id: 4,
                name: 'Moonlight Restaurant',
                shortDesc: 'An elegant restaurant with sophisticated ambiance.',
                fullDesc: 'Soft lighting from crystal chandeliers illuminates the tastefully decorated dining room. White tablecloths and polished silverware gleam as waiters move efficiently between tables. The quiet atmosphere is perfect for intimate conversation.',
                imageSrc: null
            },
            {
                id: 5,
                name: 'Retro Arcade',
                shortDesc: 'A fun-filled arcade with classic games and neon lights.',
                fullDesc: 'Neon lights pulse in time with electronic music as vintage arcade cabinets line the walls. The satisfying sounds of high scores and friendly competition fill the air, creating an energetic and nostalgic atmosphere.',
                imageSrc: null
            },
            {
                id: 6,
                name: 'Art Museum',
                shortDesc: 'A modern museum with diverse art collections.',
                fullDesc: 'High ceilings and minimalist architecture create a sense of space and tranquility. Each gallery features carefully curated exhibits from different periods and styles. The hushed atmosphere encourages contemplation and discussion.',
                imageSrc: null
            }
        ]);
        
        // Initialize game
        const initGame = async () => {
            // Simulate loading
            for (let i = 0; i <= 100; i += 10) {
                loadingProgress.value = i;
                if (i === 20) loadingMessage.value = 'Generating characters...';
                if (i === 50) loadingMessage.value = 'Creating locations...';
                if (i === 80) loadingMessage.value = 'Preparing dialogue...';
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // Check for saved game
            const savedGame = localStorage.getItem('heartsJourneySave');
            if (savedGame) {
                hasSavedGame.value = true;
                try {
                    const gameData = JSON.parse(savedGame);
                    // Restore game state if needed
                }
                catch (e) {
                    console.error('Error loading saved game:', e);
                }
            }
            
            // Generate character images
            await generateCharacterImages();
            
            // Generate location images
            await generateLocationImages();
            
            // Go to main menu
            currentScreen.value = 'mainMenu';
        };
        
        // Generate character images
        const generateCharacterImages = async () => {
            // In a real implementation, we would call the AI image generation
            // For now, we'll use placeholders
            for (const character of characters) {
                if (!character.imageSrc) {
                    try {
                        // Simulate image generation
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const characterPrompt = `Portrait of ${character.name}, ${character.shortBio}`;
                        
                        // In a real implementation:
                        // const result = await websim.imageGen({
                        //   prompt: characterPrompt,
                        //   aspect_ratio: "3:4",
                        //   seed: character.id, // For consistency
                        // });
                        // character.imageSrc = result.url;
                        
                        // Use placeholder for now
                        character.imageSrc = `https://picsum.photos/seed/${character.id}/300/400`;
                    }
                    catch (error) {
                        console.error(`Failed to generate image for ${character.name}:`, error);
                        character.imageSrc = 'assets/placeholder.svg';
                    }
                }
            }
        };
        
        // Generate location images
        const generateLocationImages = async () => {
            // Similar approach as character images
            for (const location of locations) {
                if (!location.imageSrc) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const locationPrompt = `${location.fullDesc}`;
                        
                        // In a real implementation:
                        // const result = await websim.imageGen({
                        //   prompt: locationPrompt,
                        //   aspect_ratio: "16:9",
                        //   seed: location.id + 100, // For consistency
                        // });
                        // location.imageSrc = result.url;
                        
                        // Use placeholder for now
                        location.imageSrc = `https://picsum.photos/seed/${location.id + 100}/800/450`;
                    }
                    catch (error) {
                        console.error(`Failed to generate image for ${location.name}:`, error);
                        location.imageSrc = 'assets/placeholder.svg';
                    }
                }
            }
        };
        
        // Navigation functions
        const startNewGame = () => {
            currentScreen.value = 'characterSelection';
        };
        
        const continueGame = () => {
            // Load saved game data and go to game screen
            const savedGame = JSON.parse(localStorage.getItem('heartsJourneySave'));
            if (savedGame) {
                currentCharacter.value = characters.find(c => c.id === savedGame.characterId);
                currentLocation.value = locations.find(l => l.id === savedGame.locationId);
                currentScreen.value = 'gameScreen';
                startDialogue();
            }
        };
        
        const openSettings = () => {
            currentScreen.value = 'settings';
        };
        
        const closeSettings = () => {
            // Save settings
            localStorage.setItem('heartsJourneySettings', JSON.stringify(settings));
            // Return to previous screen
            if (showGameMenu.value) {
                showGameMenu.value = false;
                currentScreen.value = 'gameScreen';
            } else {
                currentScreen.value = 'mainMenu';
            }
        };
        
        const goToMainMenu = () => {
            // Prompt if in game
            if (currentScreen.value === 'gameScreen') {
                if (confirm('Return to main menu? Your progress will be saved.')) {
                    saveGameState();
                    currentScreen.value = 'mainMenu';
                    showGameMenu.value = false;
                }
            } else {
                currentScreen.value = 'mainMenu';
            }
        };
        
        const goToCharacterSelection = () => {
            currentScreen.value = 'characterSelection';
        };
        
        // Character and location selection
        const selectCharacter = (character) => {
            currentCharacter.value = character;
            currentScreen.value = 'locationSelection';
        };
        
        const selectLocation = (location) => {
            currentLocation.value = location;
            currentScreen.value = 'gameScreen';
            startDialogue();
        };
        
        // Game menu
        const toggleGameMenu = () => {
            showGameMenu.value = !showGameMenu.value;
        };
        
        const resumeGame = () => {
            showGameMenu.value = false;
        };
        
        // Dialogue system
        const startDialogue = async () => {
            // Check if this is the first meeting or a continuation
            const memory = currentCharacter.value.memory;
            const hasMetBefore = memory.length > 0;
            
            // Generate dialogue based on context
            let initialDialogue = '';
            let choices = [];
            
            try {
                if (hasMetBefore) {
                    // They've met before - reference previous interactions
                    const lastMemory = memory[memory.length - 1];
                    
                    // In a real implementation, we'd use AI to generate this:
                    // const completion = await websim.chat.completions.create({
                    //   messages: [
                    //     { role: "system", content: "You are a dating sim dialogue generator. Create natural, engaging dialogue." },
                    //     { role: "user", content: `Generate a greeting from ${currentCharacter.value.name} to the player meeting again at ${currentLocation.value.name}. 
                    //       Reference their last interaction: ${lastMemory}. Make the dialogue feel natural and reflect the character's personality.` 
                    //     }
                    //   ]
                    // });
                    // initialDialogue = completion.content;
                    
                    initialDialogue = `Hey there! It's good to see you again, especially at ${currentLocation.value.name}. Last time we talked about ${memory[0].topic || 'some interesting things'}. How have you been since then?`;
                    
                    choices = [
                        "I've been great! I was looking forward to seeing you again.",
                        "Pretty good. I thought this location would be perfect for us to meet up.",
                        "I've been thinking about our last conversation a lot.",
                        "I'm doing well. How about you? What's new in your life?"
                    ];
                }
                else {
                    // First meeting
                    initialDialogue = `Hi there! I'm ${currentCharacter.value.name}. It's nice to meet you here at ${currentLocation.value.name}. ${getCharacterIntroduction(currentCharacter.value)}`;
                    
                    choices = [
                        `Nice to meet you too! What brings you to ${currentLocation.value.name}?`,
                        `I've heard a lot about you! I'm a big fan of ${currentCharacter.value.interests[0]} too.`,
                        `This place is beautiful, isn't it? Do you come here often?`,
                        `Hi ${currentCharacter.value.name}! I'm glad we finally got to meet.`
                    ];
                }
            }
            catch (error) {
                console.error('Error generating dialogue:', error);
                initialDialogue = `Hi there! I'm ${currentCharacter.value.name}. It's nice to meet you here at ${currentLocation.value.name}.`;
                choices = [
                    "Nice to meet you!",
                    "This place is nice, isn't it?",
                    "Tell me about yourself.",
                    "What do you like to do for fun?"
                ];
            }
            
            // Set the dialogue and choices
            currentDialogue.value = '';
            dialogueChoices.value = [];
            
            // Type out the dialogue
            await typeDialogue(initialDialogue);
            
            // Show choices
            dialogueChoices.value = choices;
            
            // Read dialogue if text-to-speech is enabled
            if (settings.textToSpeech) {
                speakText(initialDialogue);
            }
        };
        
        const continueDialogue = async () => {
            // Move to next dialogue in queue if available
            if (dialogueQueue.value.length > 0) {
                const nextDialogue = dialogueQueue.value.shift();
                currentDialogue.value = '';
                await typeDialogue(nextDialogue.text);
                
                if (nextDialogue.choices && nextDialogue.choices.length > 0) {
                    dialogueChoices.value = nextDialogue.choices;
                }
                
                // Read dialogue if text-to-speech is enabled
                if (settings.textToSpeech) {
                    speakText(nextDialogue.text);
                }
            }
            // Otherwise generate new dialogue
            else {
                generateNextDialogue();
            }
        };
        
        const makeChoice = async (choiceIndex) => {
            // Get the selected choice
            const selectedChoice = dialogueChoices.value[choiceIndex];
            
            // Store in character memory
            storeMemory(selectedChoice);
            
            // Clear choices
            dialogueChoices.value = [];
            
            // Generate response to choice
            try {
                // In a real implementation, we'd use AI to generate this:
                // const completion = await websim.chat.completions.create({
                //   messages: [
                //     { role: "system", content: "You are a dating sim dialogue generator. Create natural, engaging dialogue." },
                //     { role: "user", content: `Generate a response from ${currentCharacter.value.name} to the player's choice: "${selectedChoice}" 
                //       at ${currentLocation.value.name}. Make the dialogue feel natural and reflect the character's personality.` 
                //     }
                //   ]
                // });
                // const response = completion.content;
                
                // Simulate response generation
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Simple hard-coded responses based on choice index
                const responses = [
                    `I'm really glad you feel that way! It's always nice to meet someone who's excited to talk. ${currentLocation.value.name} is one of my favorite places.`,
                    `Good choice coming here! ${currentLocation.value.name} has such a special atmosphere, don't you think? It really brings out the best in conversations.`,
                    `That's really thoughtful of you. It's nice to know I made an impression. What specifically were you thinking about?`,
                    `I've been doing pretty well! Just been busy with ${currentCharacter.value.interests[0]} lately. There's always something new to learn or experience.`
                ];
                
                const response = responses[choiceIndex] || `That's interesting! I'd love to hear more about that.`;
                
                // Type out the response
                currentDialogue.value = '';
                await typeDialogue(response);
                
                // Generate follow-up dialogue after a short delay
                setTimeout(generateNextDialogue, 1000);
                
                // Read dialogue if text-to-speech is enabled
                if (settings.textToSpeech) {
                    speakText(response);
                }
                
                // Save game state
                saveGameState();
            }
            catch (error) {
                console.error('Error generating response:', error);
                currentDialogue.value = "That's interesting! I'd love to hear more about that.";
                setTimeout(generateNextDialogue, 1000);
            }
        };
        
        const generateNextDialogue = async () => {
            try {
                // In a real implementation, we'd use AI to generate this:
                // const completion = await websim.chat.completions.create({
                //   messages: [
                //     { role: "system", content: "You are a dating sim dialogue generator. Create natural, engaging dialogue." },
                //     { role: "user", content: `Generate the next line of dialogue from ${currentCharacter.value.name} to the player 
                //       at ${currentLocation.value.name}. Include 3-4 response choices for the player. Make the dialogue feel natural 
                //       and reflect the character's interests in ${currentCharacter.value.interests.join(', ')}.` 
                //     }
                //   ]
                // });
                // const dialogueData = completion.content;
                
                // Simulate dialogue generation
                await new Promise(resolve => setTimeout(resolve, 700));
                
                // Generate dialogue based on character interests
                const interests = currentCharacter.value.interests;
                const randomInterest = interests[Math.floor(Math.random() * interests.length)];
                
                const nextDialogue = `So, speaking of ${randomInterest}, it's something I'm really passionate about. What about you? Do you have any interests or hobbies that you get excited talking about?`;
                
                const nextChoices = [
                    `Actually, I'm into ${randomInterest} too! We have that in common.`,
                    `I'm more interested in learning about your experiences with ${randomInterest}.`,
                    `I enjoy a lot of different things, but lately I've been focusing on art and design.`,
                    `I prefer outdoor activities - hiking, swimming, anything in nature really.`
                ];
                
                // Type out the dialogue
                currentDialogue.value = '';
                await typeDialogue(nextDialogue);
                
                // Set choices
                dialogueChoices.value = nextChoices;
                
                // Read dialogue if text-to-speech is enabled
                if (settings.textToSpeech) {
                    speakText(nextDialogue);
                }
            }
            catch (error) {
                console.error('Error generating dialogue:', error);
                currentDialogue.value = `So, tell me more about yourself. What kinds of things do you enjoy doing?`;
                dialogueChoices.value = [
                    "I enjoy outdoor activities and exploring nature.",
                    "I'm more of an indoor person - books, movies, and games.",
                    "I'm passionate about art and creative expression.",
                    "I like trying new restaurants and experiencing different cultures."
                ];
            }
        };
        
        // Helper functions
        const getCharacterIntroduction = (character) => {
            const introMap = {
                'Alex': "I've been taking photos around here earlier today. The lighting is perfect!",
                'Jamie': "Just closed a funding round for my new app. Thought I'd celebrate by taking a break here.",
                'Morgan': "I was just admiring the menu here. I get inspiration for my own recipes from places like this.",
                'Taylor': "It's nice to be on land sometimes! Most of my days are spent by the ocean for my research.",
                'Kai': "I'm playing a set later tonight at a venue nearby. Came here to relax and get in the right headspace."
            };
            
            return introMap[character.name] || "I'm really enjoying being here today.";
        };
        
        const typeDialogue = async (text) => {
            currentDialogue.value = '';
            const speed = 11 - settings.textSpeed; // Invert so higher = faster
            for (let i = 0; i < text.length; i++) {
                currentDialogue.value += text.charAt(i);
                await new Promise(resolve => setTimeout(resolve, speed * 10));
            }
        };
        
        const storeMemory = (playerChoice) => {
            // Store this interaction in character memory
            const newMemory = {
                location: currentLocation.value.name,
                playerChoice: playerChoice,
                timestamp: new Date().toISOString(),
                topic: currentCharacter.value.interests[0]
            };
            
            // Add to character memory, keeping only the last 20 memories
            currentCharacter.value.memory.push(newMemory);
            if (currentCharacter.value.memory.length > 20) {
                currentCharacter.value.memory.shift();
            }
        };
        
        const saveGameState = () => {
            // Save current game state
            const gameState = {
                characterId: currentCharacter.value.id,
                locationId: currentLocation.value.id,
                timestamp: new Date().toISOString(),
                characters: characters.map(c => ({
                    id: c.id,
                    memory: c.memory
                }))
            };
            
            localStorage.setItem('heartsJourneySave', JSON.stringify(gameState));
            hasSavedGame.value = true;
        };
        
        // Text-to-Speech
        const speakText = (text) => {
            if (!settings.textToSpeech) return;
            
            // Stop any current speech
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Get available voices
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Group voices by perceived gender (simplified approach)
                const femaleVoices = voices.filter(v => v.name.includes('female') || v.name.includes('woman'));
                const maleVoices = voices.filter(v => v.name.includes('male') || v.name.includes('man'));
                
                // Assign voice based on character gender (simplified for demo)
                if (currentCharacter.value.name === 'Alex' || currentCharacter.value.name === 'Morgan' || currentCharacter.value.name === 'Taylor') {
                    // These characters can use any voice type
                    const allVoices = [...femaleVoices, ...maleVoices];
                    utterance.voice = allVoices[currentCharacter.value.id % allVoices.length] || voices[0];
                }
                else if (currentCharacter.value.name === 'Jamie') {
                    // Jamie uses male voice
                    utterance.voice = maleVoices[0] || voices[0];
                }
                else if (currentCharacter.value.name === 'Kai') {
                    // Kai uses male voice
                    utterance.voice = maleVoices[1] || maleVoices[0] || voices[0];
                }
            }
            
            // Apply settings
            utterance.pitch = settings.voicePitch;
            utterance.rate = settings.voiceRate;
            
            // Speak
            window.speechSynthesis.speak(utterance);
        };
        
        // Initialize
        onMounted(() => {
            // Load settings if available
            const savedSettings = localStorage.getItem('heartsJourneySettings');
            if (savedSettings) {
                try {
                    const parsedSettings = JSON.parse(savedSettings);
                    Object.assign(settings, parsedSettings);
                }
                catch (e) {
                    console.error('Error loading settings:', e);
                }
            }
            
            // Load speech synthesis voices
            if (window.speechSynthesis) {
                if (window.speechSynthesis.onvoiceschanged !== undefined) {
                    window.speechSynthesis.onvoiceschanged = () => {
                        // Voices loaded
                    };
                }
            }
            
            // Start the game
            initGame();
        });
        
        // Return all reactive values and functions needed by the template
        return {
            currentScreen,
            loadingProgress,
            loadingMessage,
            hasSavedGame,
            characters,
            locations,
            currentCharacter,
            currentLocation,
            currentDialogue,
            dialogueChoices,
            settings,
            showGameMenu,
            
            // Functions
            startNewGame,
            continueGame,
            openSettings,
            closeSettings,
            goToMainMenu,
            goToCharacterSelection,
            selectCharacter,
            selectLocation,
            toggleGameMenu,
            resumeGame,
            makeChoice,
            continueDialogue
        };
    }
});

app.mount('#app');

