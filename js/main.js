(() => {
  const UnicornConfig = {
    imagePath: "images/",
    imageCount: 20,
    imageFormat: ".gif",
    unicornCount: 100,
    text: "UNICORNS",
    hideAfter: 6000,
    className: "unicorn",
    textClass: "unicorn-text",
  };

  const Unicorn = {
    code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13],
    index: 0,
    active: false,
    elements: [],
    hideTimeoutId: null,

    init() {
      const trigger = document.getElementById("unicorn-trigger");
      if (!trigger) return;

      const root = document.documentElement;

      const schedulePreload = window.requestIdleCallback
        ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => window.setTimeout(cb, 0);

      schedulePreload(() => this.preloadImages());

      root.addEventListener("keyup", (e) => this.keyUp(e));
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.unicorns();
      });

      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          trigger.click();
        }
      });

      root.addEventListener("click", () => this.remove());
      root.addEventListener("keydown", (e) => {
        if (!this.active) return;
        this.remove();
      });
    },

    preloadImages() {
      if (this.preloaded) return;
      this.preloaded = true;

      const preloads = [];
      const container = document.createElement("div");
      container.className = "unicorn-preload";
      container.setAttribute("aria-hidden", "true");

      for (let i = 1; i <= UnicornConfig.imageCount; i++) {
        const img = document.createElement("img");
        img.loading = "eager";
        img.decoding = "async";
        img.src = `${UnicornConfig.imagePath}${i}${UnicornConfig.imageFormat}`;
        preloads.push(img);
        container.appendChild(img);
      }

      document.body.appendChild(container);
      this.preloads = preloads;
    },

    keyUp(e) {
      const key = e.which || e.keyCode;
      if (key !== this.code[this.index]) {
        this.index = 0;
        return;
      }

      this.index += 1;
      if (this.index === this.code.length) {
        this.active ? this.remove() : this.unicorns();
        this.index = 0;
      }
    },

    unicorns() {
      if (this.active) return;
      this.active = true;
      document.body.classList.add("unicorn-active");

      const fragment = document.createDocumentFragment();
      const bounds = this.getBounds();
      const imageOrder = this.buildImageOrder();

      for (let i = 0; i < imageOrder.length; i++) {
        fragment.appendChild(this.createUnicorn(imageOrder[i], bounds));
      }

      fragment.appendChild(this.createText());
      document.body.appendChild(fragment);

      if (UnicornConfig.hideAfter > 0) {
        this.hideTimeoutId = setTimeout(() => this.remove(), UnicornConfig.hideAfter);
      }
    },

    buildImageOrder() {
      const indices = Array.from({ length: UnicornConfig.imageCount }, (_, i) => i + 1);

      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const order = indices.slice();
      for (let i = indices.length; i < UnicornConfig.unicornCount; i++) {
        order.push(Math.floor(Math.random() * UnicornConfig.imageCount) + 1);
      }

      return order;
    },

    getBounds() {
      return {
        maxTop: window.innerHeight + 50,
        maxLeft: window.innerWidth + 50,
      };
    },

    createUnicorn(imageIndex, bounds) {
      const unicorn = document.createElement("img");
      unicorn.src = `${UnicornConfig.imagePath}${imageIndex}${UnicornConfig.imageFormat}`;
      unicorn.className = UnicornConfig.className;

      const randomTop = Math.random() * (bounds.maxTop + 100) - 100;
      const randomLeft = Math.random() * (bounds.maxLeft + 100) - 100;

      unicorn.style.top = `${randomTop}px`;
      unicorn.style.left = `${randomLeft}px`;

      this.elements.push(unicorn);
      return unicorn;
    },

    createText() {
      const text = document.createElement("div");
      text.className = UnicornConfig.textClass;
      text.textContent = UnicornConfig.text;
      this.elements.push(text);
      return text;
    },

    remove() {
      if (!this.active && this.elements.length === 0) return;

      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
      this.active = false;
      document.body.classList.remove("unicorn-active");

      this.elements.forEach((el) => el.remove());
      this.elements.length = 0;
    },
  };

  document.addEventListener("DOMContentLoaded", () => Unicorn.init());
})();
