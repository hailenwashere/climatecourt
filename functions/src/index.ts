import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.database();

// HTTP-triggered function to start countdown
export const startCountdown = functions.https.onRequest(async (req, res) => {
  const countdownStart = 20;
  const ref = db.ref("logic/secondsleft");

  // Set initial value
  await ref.set(countdownStart);

  // Start countdown
  let secondsLeft = countdownStart;

  const interval = setInterval(async () => {
    secondsLeft--;

    if (secondsLeft >= 0) {
      await ref.set(secondsLeft);
    }

    if (secondsLeft <= 0) {
      clearInterval(interval);
    }
  }, 1000);

  res.send("Countdown started!");
});