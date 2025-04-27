# 🌎 Climate Court

![Climate Court Banner](public/banner.png)

> *“The number one thing we can do is the exact thing that we're not doing: talk about it.”* — **Dr. Katharine Hayhoe**  *(climate scientist & Chief Scientist at The Nature Conservancy)*

**Climate Court** turns that conversation into an **interactive courtroom drama** where everyday choices stand trial. Confess your climate “crimes,” let a jury of peers decide your fate, and receive a verdict that’s as witty as it is thought-provoking.

---

## 💡 Inspiration

We all bargain with ourselves when it comes to the climate:

* *"Two separate Amazon orders...but they’ll probably ship in the same box.”*  
* *“I’ll take the car to the gym - leg day starts after I park.”*

Those private negotiations inspired Climate Court—an anonymous space that swaps inner guilt for public judgment. By mixing humor with accountability we lower the barrier to honest climate talk and turn **eco-anxiety** into constructive reflection.

---

## 🔍 What It Does

| Stage | What happens | Tech |
|-------|--------------|------|
| **1 Confess** | Users anonymously submit an action (climate crime?) & optional context. | Next.js |
| **2 Deliberate** | Community votes **Yay/Nay** in real time. | Firebase Realtime DB |
| **3 Verdict** | A Gemini-powered judge slams the gavel and delivers a sarcastic yet funny ruling. | Google Gemini 2.0 Flash |
| **4 Reflect** | Submitter sees final tallies plus information to improve if found guilty. | Firestore |

---

## 🛠 How We Built It

### Frontend
* **Next.js** (App Router, Turbopack)  
* **Tailwind CSS + daisyUI**  
* **Framer Motion** for gavel & crowd animations  
* **React Context** for global vote state  

### Backend & Realtime
* **Firebase Authentication** (anonymous sessions)  
* **Firebase Realtime Database** (live vote counts)  
* **Firestore** (climate-crime archive)  
* **Cloud Functions** (vote tally + Gemini calls)  

### AI
* **Gemini 2.0 Flash** via Google AI Studio  
* **Prompt-library** that balances snark with education  

### DevOps
* **GitHub Actions** (CI + preview deploys)  
* **Vercel** for hosting  

---

## 🧩 Challenges

| Challenge | Solution |
|-----------|----------|
| Humor **vs.** education | Iterated prompts until the judge was sassy but still informative. |
| Anonymous yet accountable UX | Server-side vote tracking + rate limiting |
| Wildly different confession lengths | Dynamic prompt templates & Gemini context windows |
| Animation timing | Custom React hook that triggers 3× gavel strike when `isVoting` flips |

---

## 🏆 Wins We’re Proud Of

* **Judge with personality**—users receive unique and witty verdicts
* **Live courtroom feel**—crowd sprites that yay/nay in sync with votes  
* **Zero-friction onboarding**—anonymous and instant participation  

---

## 📚 What We Learned

* Prompt engineering for consistent character voices  
* Psychology of humor in climate communication  
* Fine-grained Firebase security rules  
* Tailwind × Framer Motion choreography for animations 

---

## 🚀 What’s Next

* **Impact meter** – show estimated CO₂ for each crime  
* **Regional context** – verdicts adapt to local infrastructure  
* **Multiple judge personas** – from lenient “Optimist Oak” to ruthless “Justice Carbon”  

---

## 🔧 Local Development

```bash
# Install deps
npm install

# Run dev server
npm run dev
# → http://localhost:3000
