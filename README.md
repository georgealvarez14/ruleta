# 🎯 Verb Roulette

A fun and interactive English verb learning application with a spinning roulette wheel, pronunciation feedback, and sound effects.

## ✨ Features

- **🎪 Interactive Roulette**: Spin the wheel to randomly select English verbs
- **🔊 Pronunciation Practice**: Listen to correct pronunciation of verbs
- **😊😢 Feedback System**: Select if you pronounced correctly or not with happy/sad faces
- **🎵 Sound Effects**: Realistic audio feedback for correct/incorrect pronunciation
- **📊 Statistics**: Track your learning progress and streaks
- **🎨 Beautiful UI**: Modern, responsive design with animations
- **📱 Mobile Friendly**: Works great on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/georgealvarez14/ruleta.git
cd ruleta
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

1. **Spin the Roulette**: Click the "SPIN" button in the center of the wheel
2. **Pronounce the Word**: Say the selected verb out loud
3. **Give Feedback**: Click 😊 if you pronounced it well, or 😢 if you need more practice
4. **Listen to Sounds**: Enjoy the audio feedback for your pronunciation
5. **Track Progress**: Watch your statistics improve as you learn

## 🛠️ Built With

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Web Audio API** - Sound effects
- **Lucide React** - Icons

## 📁 Project Structure

```
verb-roulette/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   └── layout.tsx           # Root layout
├── components/             # React components
│   ├── verb-roulette.tsx   # Main roulette component
│   ├── sound-effects.tsx   # Audio system
│   └── ui/                 # UI components
├── lib/                    # Utilities
└── public/                 # Static assets
```

## 🎯 Verb Database

The app includes 100 carefully selected English verbs:
- **50 Regular verbs** (e.g., walk, talk, play)
- **50 Irregular verbs** (e.g., be, have, go, see)

## 🔊 Sound System

- **Happy Sound**: Ascending major chord (C4 → E4 → G4 → C5)
- **Sad Sound**: Descending minor chord (G4 → F4 → D#4 → C4)
- **Vibration**: Mobile device haptic feedback

## 📱 Mobile Features

- Touch-friendly interface
- Haptic feedback on mobile devices
- Responsive design for all screen sizes
- Optimized performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- English verb database curated for learning
- Web Audio API for realistic sound effects
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling

---

**Happy Learning! 🎓✨**
