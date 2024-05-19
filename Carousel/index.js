const sliderImageUrls = [
  "https://source.unsplash.com/a-view-of-the-wing-of-an-airplane-as-the-sun-sets-x6Z2zFF2h-g",
  "https://source.unsplash.com/an-aerial-view-of-a-body-of-water-surrounded-by-land-q59v7fPcBsw",
  "https://source.unsplash.com/landmark-photography-of-trees-near-rocky-mountain-under-blue-skies-daytime-ndN00KmbJ1c",
  "https://source.unsplash.com/waves-of-body-of-water-splashing-on-sand-mBQIfKlvowM",
];

export class Slider {
  #contentEl;
  #wrapperEl;
  #imageURLS;
  #sliderLength;
  #progressIndicatorContainerEl;
  #currentPage = 0;

  constructor(imageURLS) {
    this.#contentEl = document.querySelector("[data-slider-content]");
    this.#imageURLS = imageURLS;
    this.#sliderLength = imageURLS.length - 1;

    this.#createSliderElement();
    this.#createProgressIndicator();
    this.#attachListener();
  }

  #createSliderElement() {
    const elements = this.#imageURLS.map((url, i) => {
      return `<img src=${url} alt="slider image ${
        i + 1
      } " class="slider-component" />`;
    });

    // Add wrapper class
    const wrapperEl = document.createElement("div");
    wrapperEl.classList.add("slider-wrapper");
    this.#contentEl.insertAdjacentElement("afterbegin", wrapperEl);
    this.#wrapperEl = wrapperEl;

    // Add the slider elements
    elements.forEach((el) => {
      wrapperEl.insertAdjacentHTML("afterbegin", el);
    });
  }

  #createProgressIndicator() {
    this.#progressIndicatorContainerEl = document.querySelector(
      "[data-slider-progress-indicator]"
    );

    const indicatorTemplate = this.#imageURLS
      .map((_, i) => {
        return `<div class="progress-indicator slider-page-${i} ${
          this.#currentPage === i ? "active" : ""
        }"></div>`;
      })
      .join("");

    this.#progressIndicatorContainerEl.insertAdjacentHTML(
      "afterbegin",
      indicatorTemplate
    );
  }

  /**
   * @param {"next" | "prev"} direction
   */
  #handleSlide(direction) {
    return () => {
      if (direction === "next") {
        this.#currentPage = Math.min(this.#sliderLength, this.#currentPage + 1);
      }

      if (direction === "prev") {
        this.#currentPage = Math.max(0, this.#currentPage - 1);
      }

      this.#wrapperEl.style.transform = `translateX(-${
        this.#currentPage * 100
      }%)`;

      document
        .querySelector(".progress-indicator.active")
        .classList.remove("active");
      document
        .querySelector(`.slider-page-${this.#currentPage}`)
        .classList.add("active");
    };
  }

  #attachListener() {
    const nextButton = document.querySelector("[data-slider-next]");
    const prevButton = document.querySelector("[data-slider-prev]");

    nextButton.addEventListener("click", this.#handleSlide("next"));
    prevButton.addEventListener("click", this.#handleSlide("prev"));
  }
}

new Slider(sliderImageUrls);
