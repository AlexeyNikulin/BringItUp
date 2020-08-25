import Slider from './slider';

export default class MiniSlider extends Slider {
    constructor(container, next, prev, activeClass, autoplay, animate) {
        super(container, next, prev, activeClass, autoplay, animate);
    }

    decorizeSlides() {
        this.slides.forEach(slide => {
            slide.classList.remove(this.activeClass);
            if (this.animate) {
                slide.querySelector('.card__title').style.opacity = '0.4';
                slide.querySelector('.card__controls-arrow').style.opacity = '0';
            }
        });

        this.slides[0].classList.add(this.activeClass);
        if (this.animate) {
            this.slides[0].querySelector('.card__title').style.opacity = '1';
            this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
        }
    }

    nextSlide(i) {
        this.slides[this.slides.length - i].after(this.slides[0]);
        this.decorizeSlides();
    }

    bindTriggers() {
        let i = 1;

        if (this.slides[this.slides.length - 1].tagName === 'BUTTON') {
            i = 3;
        }

        this.next.addEventListener('click', () => {
            this.nextSlide(i);
        });

        this.prev.addEventListener('click', () => {
            let active = this.slides[this.slides.length - i];
            this.container.insertBefore(active, this.slides[0]);
            this.decorizeSlides();
        });

        if (this.autoplay) {
            let timeAutoSlide;

            timeAutoSlide = setInterval(() => this.nextSlide(i), 3000);

            this.next.parentNode.addEventListener('mouseenter', () => {
                clearInterval(timeAutoSlide);
            });
            
            this.next.parentNode.addEventListener('mouseleave', () => {
                timeAutoSlide = setInterval(() => this.nextSlide(i), 3000);
            });
        }
    }

    init() {
            try {
                this.container.style.cssText =  `
                display: flex;
                flex-wrap: wrap;
                overflow: hidden;
                align-items: flex-start;
            `;

            this.bindTriggers();
            this.decorizeSlides();
        } catch(e){}
    }
}