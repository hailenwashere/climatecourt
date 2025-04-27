const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

// Pub/Sub-triggered function to start countdown and pick a random crime
exports.scheduledStartCountdown = functions.pubsub
  .schedule('*/2 * * * *')  // This triggers every 120 seconds
  .onRun(async (context) => {
    const countdownStart = 60;
    const logicRef = db.ref("logic");
    const crimesRef = db.ref("crimes");

    try {
      // Get all crimes from the database
      const snapshot = await crimesRef.once("value");

      if (!snapshot.exists()) {
        console.error("No crimes available.");
        return;
      }

      const crimes = snapshot.val();
      const crimeIds = Object.keys(crimes);  // Array of crime IDs
      const randomCrimeId = crimeIds[Math.floor(Math.random() * crimeIds.length)]; // Select random crime ID

      const startTime = Date.now();
      const endTime = startTime + countdownStart * 1000; // Calculate end time

      const yayCount = crimes[randomCrimeId].yayCount || 0;
      const nayCount = crimes[randomCrimeId].nayCount || 0;

      // Set the selected crime and initial countdown value in logic
      await logicRef.set({
        currCrime: randomCrimeId,
        startTime: startTime,
        endTime: endTime,
        yayCount: yayCount,
        nayCount: nayCount,
      });
      console.log("Selected crime: ", randomCrimeId);
    } catch (error) {
      console.error("Error during countdown: ", error);
    }
  });
