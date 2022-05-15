import TypewriterOptions from './TypewriterOptions';

type QueueItem = () => Promise<void>;
type CallbackQueue = (resolve: () => void) => void;

/**
 * Main Typewriter lib
 */
export default class Typewriter {
  #queue:QueueItem[] = [];
  #typerElement: HTMLElement = document.createElement('div');
  #options: TypewriterOptions = new TypewriterOptions();

  /**
   * Class constructor
   *
   * @param {HTMLElement} element HTMLElement to write the text.
   * @param {TypewriterOptions} options Configuration options.
   */
  constructor(element: HTMLElement | null, options: Partial<TypewriterOptions> = new TypewriterOptions()) {
    if (!element) return;
    this.#typerElement.className = 'typewriter-container';

    const defaultOptions = new TypewriterOptions();
    this.#options = {...defaultOptions, ...options};
    element.appendChild(this.#typerElement);
  }

  /**
   * Write the text into element.
   *
   * @param {string} text String to be typed.
   * @return {Typewriter} The Typewriter object.
   */
  typeString(text: string): Typewriter {
    this.#addToQueue((resolve) => {
      let index = 0;

      const interval = setInterval(() => {
        this.#typerElement.append(text[index++]);
        if (index >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, this.#options.typeSpeed);
    });

    return this;
  }

  /**
   * Wait for some amount of time before continue to the next action.
   *
   * @param {number} duration Time in milisseconds to wait before next action.
   * @return {Typewriter} The Typewriter object.
   */
  pauseFor(duration: number): Typewriter {
    this.#addToQueue((resolve) => {
      setTimeout(resolve, duration);
    });

    return this;
  }

  /**
   * Delete all the characters. Can recieve a milliseconds parameter that specifies how fast the characters
   * will be deleted.
   *
   * @param {number} speed The speed the characters will be deleted. Default value is the default typespeed.
   * @return {Typewriter} The Typewriter object.
   */
  deleteAll(speed: number = this.#options.typeSpeed): Typewriter {
    this.#addToQueue((resolve) => {
      const element = this.#typerElement;

      const interval = setInterval(() => {
        this.#typerElement.innerText = element.innerText.substring(0, element.innerText.length - 1);
        if (element.innerText.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
    return this;
  }

  /**
   * Delete the number of characters passed in the parameter.
   *
   * @param {number} amount Number of characters to be deleted. If none is passed, all characters are deleted.
   * @return {Typewriter} The Typewriter object.
   */
  deleteChars(amount: number = 0): Typewriter {
    this.#addToQueue((resolve) => {
      let count = 0;
      const element = this.#typerElement;

      const interval = setInterval(() => {
        this.#typerElement.innerText = element.innerText.substring(0, element.innerText.length - 1);

        if (count++ >= amount) {
          clearInterval(interval);
          resolve();
        }
      }, this.#options.typeSpeed);
    });

    return this;
  }

  /**
   * Start the writing into element.
   *
   * @return {Typewriter} The Typewriter object.
   */
  async start(): Promise<Typewriter> {
    let callback = this.#queue.shift();
    while (callback) {
      await callback();

      if (this.#options.loop) this.#queue.push(callback);
      callback = this.#queue.shift();
    }
    return this;
  }

  /**
   * Add callback to the queue.
   *
   * @param {CallbackQueue} callback callback to be added to queue
   */
  #addToQueue(callback: CallbackQueue): void {
    this.#queue.push(() => new Promise<void>(callback));
  }
}
