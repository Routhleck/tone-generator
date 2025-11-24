# 🎵 Tone Generator

An open-source advanced audio synthesis application with tones, multiple noise types, and rhythm modulation. Built with React, TypeScript, and Web Audio API.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)

## ✨ Features

### Sound Generation Modes
- **Tone Mode**: Generate pure tones with precise frequency control (20 Hz - 20,000 Hz)
  - 4 Waveforms: Sine, Square, Sawtooth, Triangle
  - Precision control: 0.01 Hz accuracy
  - Octave adjustment buttons (×½ and ×2)

- **Noise Mode**: Generate various colored noise types
  - **White Noise**: Equal energy across all frequencies
  - **Pink Noise**: Equal energy per octave (1/f) - natural, balanced sound
  - **Brown Noise**: Deep rumble (1/f²) - soothing, low-frequency emphasis
  - **Blue Noise**: High frequency emphasis - crisp, bright
  - **Violet Noise**: Higher frequency emphasis - very bright
  - **Grey Noise**: Psychoacoustic equal loudness - perceived as uniform

### Advanced Features

#### 🎼 Rhythm Modulation (Tone Mode Only)
Automatically sweep frequencies over time with customizable patterns:
- **Frequency Range**: Set start and end frequencies
- **Duration**: Control sweep time (0.1 to 60 seconds)
- **Transition Types**:
  - Linear: Constant rate of change
  - Exponential: Logarithmic progression (musical intervals)
  - Sine: Smooth, wave-like transitions
- **Loop Mode**: Continuous cycling through the frequency range
- Quick-set buttons to use current frequency as start/end point

#### ⌨️ Keyboard Shortcuts
- `Space`: Play/Pause
- `← →`: Adjust frequency by ±10 Hz
- `Shift + ← →`: Adjust frequency by ±1 Hz
- `Ctrl/Cmd + ← →`: Adjust frequency by ±0.01 Hz

### Design Features
- 🎨 Modern, minimal UI with glassmorphism effects
- 🌊 Animated gradient backgrounds
- ✨ Smooth transitions and micro-interactions
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ Accessibility support (ARIA labels, keyboard navigation)
- 🎭 Reduced motion support for accessibility
- ⚠️ Safety warnings for hearing protection

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tone-generator.git
cd tone-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 Usage Guide

### Basic Operation

1. **Choose Mode**: Toggle between Tone and Noise mode using the mode selector
2. **Play/Pause**: Click the play button or press Space

### Tone Mode

1. **Set Frequency**:
   - Type directly into the frequency input field
   - Use the logarithmic slider for smooth adjustments
   - Use arrow keys for precise control (see keyboard shortcuts)

2. **Select Waveform**: Choose from Sine, Square, Sawtooth, or Triangle waves

3. **Adjust Octave**: Use ×½ to halve or ×2 to double the current frequency

4. **Enable Rhythm Modulation** (Optional):
   - Toggle the rhythm switch
   - Set start and end frequencies
   - Choose duration and transition type
   - Enable loop for continuous cycling

### Noise Mode

1. **Select Noise Type**: Choose from 6 different colored noise types
2. **Each noise has unique characteristics**:
   - White: Hissing sound, all frequencies equal
   - Pink: Natural sound, like rainfall
   - Brown: Deep rumbling, like ocean waves
   - Blue: Bright, high-frequency sound
   - Violet: Even brighter than blue
   - Grey: Balanced across human hearing perception

## 🏗️ Project Structure

```
tone-generator/
├── src/
│   ├── components/          # React components
│   │   ├── FrequencyControl.tsx/css
│   │   ├── WaveformSelector.tsx/css
│   │   ├── PlaybackControl.tsx/css
│   │   ├── OctaveButtons.tsx/css
│   │   ├── SoundModeSelector.tsx/css
│   │   ├── NoiseSelector.tsx/css
│   │   └── RhythmControl.tsx/css
│   ├── services/            # Business logic
│   │   ├── AudioEngine.ts   # Web Audio API wrapper
│   │   └── NoiseGenerator.ts # Noise synthesis algorithms
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── App.css              # Main styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🔧 Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Audio API**: Web Audio API
- **Styling**: Custom CSS with CSS Variables, Glassmorphism
- **Code Quality**: ESLint

## 🎯 Use Cases

### Audio & Music
- Test speakers, headphones, and audio equipment
- Generate reference tones for tuning instruments
- Create drones and ambient soundscapes
- Study acoustics and frequency response

### Health & Wellness
- Assess hearing range and sensitivity
- Tinnitus frequency matching and masking
- White/pink noise for focus and sleep
- Brown noise for relaxation and meditation

### Professional
- Audio engineering and sound design
- Psychoacoustic research
- Educational demonstrations
- Calibration and testing

### Creative
- Electronic music production
- Sound art installations
- Binaural beat generation (using rhythm modulation)
- Experimental audio synthesis

## 🎨 Design Philosophy

The UI emphasizes:
- **Minimalism**: Clean, uncluttered interface
- **Clarity**: Intuitive controls with clear visual feedback
- **Beauty**: Glassmorphism, gradients, and smooth animations
- **Technology**: Modern, futuristic aesthetic
- **Accessibility**: Keyboard navigation, ARIA labels, reduced motion support

## 🔮 Future Enhancements

- [ ] Volume control slider with visual meter
- [ ] Preset frequencies (440 Hz A4, 528 Hz, etc.)
- [ ] Frequency history with bookmarks
- [ ] Multiple simultaneous tones (multi-oscillator mixing)
- [ ] Binaural beats mode (stereo panning)
- [ ] Tone duration timer with fade in/out
- [ ] Export to audio file (WAV/MP3)
- [ ] Dark/Light theme toggle
- [ ] Spectrum analyzer visualization
- [ ] MIDI input support
- [ ] React Native mobile app

## 📱 React Native Migration

The codebase is designed with React Native migration in mind:
- Component-based architecture with clear separation of concerns
- UI components isolated from business logic
- Web-specific APIs encapsulated in service layer
- Responsive design patterns ready for mobile

To migrate to React Native:
1. Replace `AudioEngine` with React Native audio library (e.g., `react-native-sound`, `expo-av`)
2. Replace `NoiseGenerator` with React Native compatible implementation
3. Convert CSS to React Native StyleSheet
4. Update input components to React Native equivalents

## ⚠️ Safety Notice

**Please use responsibly:**
- Set volume to a comfortable level before playing
- Avoid prolonged exposure to loud sounds
- Be cautious with frequencies outside normal hearing range (especially high frequencies)
- Take regular breaks when using for extended periods
- Extended exposure to loud sounds can cause permanent hearing damage

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by [Szynalski's Online Tone Generator](https://www.szynalski.com/tone-generator/)
- Noise generation algorithms based on DSP research
- Built with modern web technologies
- Powered by Web Audio API

## 📧 Contact

For questions, feedback, or bug reports, please open an issue on GitHub.

---

Made with ❤️ using React & Web Audio API
