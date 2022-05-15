import './style.css';
import Typewriter from './Typewriter';
import TypewriterOptions from './TypewriterOptions';

const app = document.getElementById('app');
const defaultPause = 300;

const options = new TypewriterOptions();
options.loop = true;
options.typeSpeed = 20;

const optionsHTML = document.createElement('div');
optionsHTML.innerText = JSON.stringify(options);
app?.appendChild(optionsHTML);

const typewriter = new Typewriter(app, options);

const a = typewriter.deleteAll()
    .typeString('Hello World!')
    .pauseFor(defaultPause)
    .typeString('\nHello World at new line!')
    .pauseFor(defaultPause)
    .deleteAll()
    .typeString('Strings can be added!')
    .pauseFor(defaultPause)
    .deleteChars(5)
    .typeString('or altered!')
    .pauseFor(defaultPause)
    .start();

console.log('Done', a);

// const typewriter2 = new Typewriter(app, options);

// typewriter2.deleteAll()
//     .pauseFor(2500)
//     .typeString('🌷A simple yet powerful native javascript')
//     .pauseFor(300)
//     .deleteChars(10)
//     .typeString('\n<strong>JS</strong> plugin for a cool typewriter effect and ')
//     .typeString('\n<strong>only <span style="color: #27ae60;">5kb</span> Gzipped!</strong>')
//     .pauseFor(1000)
//     .start();
