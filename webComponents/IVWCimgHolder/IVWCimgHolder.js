//IVWCimgHolder.js
class IVWCIMGHolder extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
          /* Styles specific to the component */
          div {
            display: flex;
            flex-direction: column;
            /* min-height: 100vh;  */
            /* Full viewport height */
          }
        </style>
        <div>                
        <ivwc-imgwithcenteredtext src="media/image1.jpg" alt="Image 1" overlayCharacter="I"></ivwc-imgwithcenteredtext>
        <ivwc-imgwithcenteredtext src="media/image2.jpg" alt="Image 1" overlayCharacter="V"></ivwc-imgwithcenteredtext>
        <ivwc-imgwithcenteredtext src="media/image3.jpg" alt="Image 1" overlayCharacter="Y"></ivwc-imgwithcenteredtext>
        </div>
      `;
    }

}// ~ end ~ class IVWCthingy extends HTMLElement

// Register the custom element
customElements.define("ivwc-imgholder", IVWCIMGHolder);

