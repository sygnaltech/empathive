
/*
 * Site
 */

import { Debug, IRouteHandler, Page } from "@sygnal/sse";

// import gsap from 'gsap'; 
 

export class Site implements IRouteHandler {

  debug: Debug; 

  constructor() {

    this.debug = new Debug("site", "SSE"); 

  }

  setup() {

    Page.loadEngineCSS("site.css"); 
   
  }

  exec() {

    // Put your site-level custom code here
    // it will have full access to the DOM 
//    window.addEventListener('load', this.scrollToElementWithOffset.bind(this));

    this.scrollToElementWithOffset(); 

    window.addEventListener('hashchange', 
      this.scrollToElementWithOffset.bind(this)
    );

  }

  private scrollToElementWithOffset(): void {

    if (window.location.hash) {
        const originalHash = window.location.hash;
        history.replaceState(null, '', ' ');
        this.debug.debug('Suppressed initial hash:', originalHash);

        setTimeout(() => {
            const fixedElement = document.querySelector('body > *') as HTMLElement | null;
            this.debug.debug('First element in body:', fixedElement);

            let offset = 0;
            if (fixedElement) {
                const computedStyle = window.getComputedStyle(fixedElement);
                this.debug.debug('Computed style of first element:', computedStyle.position);

                if (computedStyle.position === 'fixed') {
                    offset = fixedElement.offsetHeight;
                    this.debug.debug('Fixed element detected with height:', offset);
                } else {
                  this.debug.debug('First element is not fixed position');
                }
            } else {
              this.debug.debug('No elements found in body');
            }

            history.replaceState(null, '', originalHash);
            this.debug.debug('Restored the original hash:', originalHash);

            const element = document.querySelector(originalHash) as HTMLElement | null;
            this.debug.debug('Target element for hash:', element);

            if (element) {
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - offset;
                this.debug.debug('Element position:', elementPosition);
                this.debug.debug('Offset position:', offsetPosition);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                this.debug.debug('Scrolling to position with offset');
            } else {
              this.debug.debug('No element found for the hash:', originalHash);
            }
        }, 0);
    } else {
      this.debug.debug('No hash in the URL');
    }
  }

}
