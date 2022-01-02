class Voice {
    __synth: SpeechSynthesis | null = null;
    __voices: SpeechSynthesisVoice[] = [];
    __text: string = '';
    init() {
        this.__synth = window.speechSynthesis;
        this.__voices = this.__synth.getVoices().sort(function (a, b) {
            const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            else if (aname == bname) return 0;
            else return +1;
        });
    }

    speak(text: string) {
        if (!text) return;
        if (!this.__synth) return;

        var utter = new SpeechSynthesisUtterance(text);
        utter.onend = function (event) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        utter.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        var selectedOption = 'Alex';
        for (let i = 0; i < this.__voices.length; i++) {
            if (this.__voices[i].name === selectedOption) {
                utter.voice = this.__voices[i];
                break;
            }
        }
        utter.pitch = 1;
        utter.rate = 1;

        if (this.__synth.speaking) {
            this.__synth.cancel();

            if (this.__text != text) {
                this.__synth.speak(utter);
                this.__text = text;
            }
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text && text !== '') {
            this.__synth.speak(utter);
        }
    }
}

export default new Voice();