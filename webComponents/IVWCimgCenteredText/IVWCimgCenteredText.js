//IVWCimgCenteredText.js
class IVWCimgCenteredText extends HTMLElement {
    constructor() { 
        super();
        this.attachShadow({ mode: 'open' });
        this.cssLoaded=false;
        this.imgLoaded=false;
        this.imgString='i';
    }

    connectedCallback() {
        this.linkStyleSheet();
        this.linkImage();
        // window.addEventListener('resize', () => this.resizeEventListener());
    }

    disconnectedCallback() {
        // window.removeEventListener('resize', () => this.resizeEventListener());
    }

    addAndRemoveLoadListener(element, eventName, setFlagMethod) { //This addRemove kinda confuses me
        const loadHandler = () => {
          this[setFlagMethod] = true;
          this.checkResizeInitialTextFont();
          element.removeEventListener(eventName, loadHandler); // Remove the listener
        };
    
        element.addEventListener(eventName, loadHandler);
      }
    
    linkStyleSheet() {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "webComponents/IVWCimgCenteredText/IVWCimgCenteredText.css");
        this.shadowRoot.appendChild(linkElem);
        this.addAndRemoveLoadListener(linkElem, 'load', 'cssLoaded');
    }
    
    linkImage() {
        const src = this.getAttribute('src') || '';
        const alt = this.getAttribute('alt') || '';
        this.imgString = this.getAttribute('overlayCharacter') || 'I'; // Default to 'I'
    
        // Create container div
        const container = document.createElement('div');
        container.classList.add('image-container');
        container.id = 'arg';

                // Create image element
                const img = document.createElement('img');
                img.src = src;
                img.alt = alt;              
    
        // Append textOverlay and img to container
        container.appendChild(img);
            
    
        // Append container to the shadowRoot
        this.shadowRoot.appendChild(container);

        // Add load event listener to the image
        this.addAndRemoveLoadListener(img, 'load', 'imgLoaded');
    }                      
    setupText(){

        const container = this.shadowRoot.querySelector('#arg');

        
        const textOverlay = document.createElement('div');
        textOverlay.classList.add('textOverlay');

/*         textOverlay.style.width = '100%';
        textOverlay.style.height = '100%';
        textOverlay.style.display = 'flex';
        textOverlay.style.justifyContent = 'center';
        textOverlay.style.alignItems = 'center'; */

            // Create SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 100 50');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');

                // Create text element
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                // text.setAttribute('font-family', 'Arial', 'sans-serif');
                text.setAttribute('font-family', 'Times New Roman', 'serif');
                text.setAttribute('font-size', '28');
                text.setAttribute('x', '50%');
                text.setAttribute('y', '50%');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', 'white'); 
                text.setAttribute('fill-opacity', '0.5');

                // text.textContent = this.getAttribute('text') || 'Default Text';
                text.textContent = this.imgString;

/*                 we're basically doing:
                <svg width="100%" height="100%">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">Your Text</text>
                </svg> */

        // Append text to SVG and SVG to the container
        svg.appendChild(text);
        textOverlay.appendChild(svg);

        

        container.appendChild(textOverlay);


    }
    checkResizeInitialTextFont(){
        if (this.cssLoaded && this.imgLoaded) {
            // this.resizeEventListener();
            this.setupText();
          }
    }
    resizeEventListener(){

        var container = this.shadowRoot.querySelector('.image-container');
            
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        var size = Math.min(width, height) * 0.8; // Adjust the 0.8 as needed

        var textOverlay = container.querySelector('.textOverlay');
        textOverlay.style.fontSize = size + 'px'; //(style.fontSize modifies font-size: in the css)
    }

}// ~ end ~ class IVWCthingy extends HTMLElement



// Register the custom element
customElements.define("ivwc-imgwithcenteredtext", IVWCimgCenteredText);

