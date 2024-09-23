(() => {

  const UnicornConfig = {
    imagePath: "images/",
    imageCount: 20,
    imageFormat: ".gif",
    unicornCount: 80,
    words: "UNICORNS",
    hideAfter: 6000,
    idPrefix: "unicorn_",
    className: "unicorn",
    wordsClass: "unicorn-words",
  };

  const Unicorn = {
    // Konami code sequence and state tracking
    code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13],
    index: 0,
    active: false,
    elements: [],

    init() {
      // Set up listeners for Konami code and button click
      document.documentElement.addEventListener("keyup", (e) => this.keyUp(e));
      document.getElementById("unicorn-trigger").addEventListener("click", (e) => {
        e.stopPropagation();
        this.unicorns();
      });

      // Click anywhere to remove unicorns early
      document.documentElement.addEventListener("click", () => this.remove());
    },

    keyUp(e) {
      const key = e.which || e.keyCode;
      if (key === this.code[this.index]) {
        this.index++;
        // Trigger unicorns if Konami code is completed
        if (this.index === this.code.length) {
          this.active ? this.remove() : this.unicorns();
          this.index = 0;
        }
      } else {
        this.index = 0; // Reset code if sequence is broken
      }
    },

    unicorns() {
      if (this.active) return;
      this.active = true;
      document.body.style.overflow = "hidden"; // Prevent page scrolling

      // Create and display unicorn images
      for (let i = 0; i < UnicornConfig.unicornCount; i++) {
        this.createUnicorn(i);
      }

      // Display "UNICORNS" text
      this.showWords();

      // Remove unicorns after a set time
      if (UnicornConfig.hideAfter > 0) {
        this.hideTimeoutId = setTimeout(() => this.remove(), UnicornConfig.hideAfter);
      }
    },

    createUnicorn(i) {
      // Create and configure unicorn image element
      const unicorn = document.createElement("img");
      unicorn.src = `${UnicornConfig.imagePath}${Math.floor(Math.random() * UnicornConfig.imageCount) + 1}${UnicornConfig.imageFormat}`;
      unicorn.id = `${UnicornConfig.idPrefix}_image_${i}`;
      unicorn.className = UnicornConfig.className;

      // Position unicorns randomly, allowing them to slightly overflow screen
      const maxTop = window.innerHeight + 50;
      const maxLeft = window.innerWidth + 50;
      const randomTop = Math.random() * (maxTop + 100) - 100;
      const randomLeft = Math.random() * (maxLeft + 100) - 100;

      unicorn.style.top = `${randomTop}px`;
      unicorn.style.left = `${randomLeft}px`;

      this.elements.push(unicorn.id);
      document.body.appendChild(unicorn);
    },

    showWords() {
      // Create and display "UNICORNS" text
      const words = document.createElement("div");
      words.id = `${UnicornConfig.idPrefix}_words`;
      words.className = UnicornConfig.wordsClass;
      words.innerHTML = UnicornConfig.words;

      this.elements.push(words.id);
      document.body.appendChild(words);
    },

    remove() {
      // Clear the timeout and reset state
      clearTimeout(this.hideTimeoutId);
      this.active = false;
      document.body.style.overflow = "auto";

      // Remove all unicorns and text elements
      this.elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      this.elements = [];
    },
  };

  // Initialize unicorns once the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => Unicorn.init());
})();
