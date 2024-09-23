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
    code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13],
    index: 0,
    active: false,
    elements: [],
    
    init() {
      document.documentElement.addEventListener("keyup", (e) => this.keyUp(e));
      document.getElementById("unicorn-trigger").addEventListener("click", (e) => {
        e.stopPropagation();
        this.unicorns();
      });
      document.documentElement.addEventListener("click", () => this.remove());
    },

    keyUp(e) {
      const key = e.which || e.keyCode;
      if (key === this.code[this.index]) {
        this.index++;
        if (this.index === this.code.length) {
          this.active ? this.remove() : this.unicorns();
          this.index = 0;
        }
      } else {
        this.index = 0;
      }
    },

    unicorns() {
      if (this.active) return;
      this.active = true;
      document.body.style.overflow = "hidden";

      for (let i = 0; i < UnicornConfig.unicornCount; i++) {
        this.createUnicorn(i);
      }
      
      this.showWords();

      if (UnicornConfig.hideAfter > 0) {
        this.hideTimeoutId = setTimeout(() => this.remove(), UnicornConfig.hideAfter);
      }
    },

    createUnicorn(i) {
      const unicorn = document.createElement("img");
      unicorn.src = `${UnicornConfig.imagePath}${(i % UnicornConfig.imageCount) + 1}${UnicornConfig.imageFormat}`;
      unicorn.id = `${UnicornConfig.idPrefix}_image_${i}`;
      unicorn.className = UnicornConfig.className;
      unicorn.style.top = `${Math.random() * window.innerHeight - 100}px`;
      unicorn.style.left = `${Math.random() * window.innerWidth - 100}px`;

      this.elements.push(unicorn.id);
      document.body.appendChild(unicorn);
    },

    showWords() {
      const words = document.createElement("div");
      words.id = `${UnicornConfig.idPrefix}_words`;
      words.className = UnicornConfig.wordsClass;
      words.innerHTML = UnicornConfig.words;

      this.elements.push(words.id);
      document.body.appendChild(words);
    },

    remove() {
      clearTimeout(this.hideTimeoutId);
      this.active = false;
      document.body.style.overflow = "auto";

      this.elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
      this.elements = [];
    },
  };

  // Initialize the Unicorn sequence when DOM is ready
  document.addEventListener("DOMContentLoaded", () => Unicorn.init());
})();
