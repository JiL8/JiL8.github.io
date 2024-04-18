
class IVWCchat extends HTMLElement {
    constructor() {
        super();
        // Create a Shado DOM ("shadow root")
        const shadow = this.attachShadow({ mode: "open" });


        // Bind the event listeners to the class instance
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.sendThetextPressedOrCtrlEnterPressed = this.sendThetextPressedOrCtrlEnterPressed.bind(this);
        this.isButtonDown = false;

        this.linkStyleSheet();//currently linkstylesheet also launching

        // Bind the event listener method
        //this.boundHandleKeyDown  = this.handleKeyDown.bind(this); 
        //(without binding as above, the this inside of handleKeyDown, would be this of the element that triggered (inputTextBoxElement in this case))
        //This means when this.boundHandleKeyDown is used as an event handler, this inside handleKeyDown will correctly refer to the web component instance, allowing you to access other properties and methods of the component using this.

    }
    connectedCallback() {

        // this.shadowRoot.querySelector('#sendTextInputBoxElementid').addEventListener('keydown', this.boundHandleKeyDown);


        // Add send button event listeners. --moved to button creation time


    }// ~ end ~ connectedCallback()

    disconnectedCallback() {
        // Remove the keydown event listener
        const textarea = this.shadowRoot.querySelector('#sendTextInputBoxElementid');
        if (textarea) {
            textarea.removeEventListener('keydown', this.boundHandleKeyDown);
        }


        const sendTextMessageButton = this.shadowRoot.querySelector('#sendTextMessageButton'); //re-defined with an ID query to remove possiblitiy of disconnected before connected
        // Remove event listeners when the element is removed from the DOM
        if (this.sendTextMessageButton) {
            sendTextMessageButton.removeEventListener('mousedown', this.onMouseDown);
            sendTextMessageButton.removeEventListener('mouseup', this.onMouseUp);
            sendTextMessageButton.removeEventListener('mouseleave', this.onMouseLeave);
            sendTextMessageButton.removeEventListener('sendTextClicked', this.sendThetextPressedOrCtrlEnterPressed);
        }
        else { console.log("ERR: disconnectedCallback() called before the sendbutton. trying to remove the event listeners."); }

        const textareas = this.shadowRoot.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.removeEventListener('focus', this.handleFocus);
            textarea.removeEventListener('blur', this.handleBlur);
        });

    }
    /**
     * Send the text !! woot woot
     */
    sendThetextPressedOrCtrlEnterPressed(event) {
        //console.log("button arrival hay ping! ", event);

        // this.shadowRoot.querySelector(

        const chatHistoryTextArea = this.shadowRoot.querySelector('#chatHistoryTextareaElementid');
        const sendTextArea = this.shadowRoot.querySelector('#sendTextInputBoxElementid');
        if (sendTextArea.value) {
            if (chatHistoryTextArea.value) {
                chatHistoryTextArea.value = chatHistoryTextArea.value + '\n' + this.sanitizeInput(sendTextArea.value);
            }
            else {
                chatHistoryTextArea.value = this.sanitizeInput(sendTextArea.value);
            }
            chatHistoryTextArea.scrollTop = chatHistoryTextArea.scrollHeight; //scrolling up "down"? : )
            sendTextArea.value = '';
        }
    }
    onMouseDown() {
        this.isButtonDown = true;
    }

    onMouseLeave() {                //todo
        //this.isButtonDown = false;
        //console.log("tried to remove active")
        //this.shadowRoot.querySelector('button').classList.remove('active');
    }

    onMouseUp() {
        if (this.isButtonDown) {
            //Dispatch a custom event
            this.dispatchEvent(new Event('sendTextClicked'));
        }
        this.isButtonDown = false;
        /**
         *              //Dispatch a custom event
            this.dispatchEvent(new Event('custom-click'));
                        //Listen for the custom-click event
            this.addEventListener('custom-click', this.customClickHandler);
        */
    }

    addAndRemoveLoadListener(element, eventName, setFlagMethod) {
        const loadHandler = () => {
            this[setFlagMethod] = true;
            this.layoutChatDivs();
            element.removeEventListener(eventName, loadHandler); // Remove the listener
        };

        element.addEventListener(eventName, loadHandler);
    }

    layoutChatDivs() {

        // Create container div
        const container = document.createElement('div');
        container.classList.add('container');

        const mainOutline = document.createElement('div');
        mainOutline.classList.add('main-rounded-div');

        const chatHistoryDiv = document.createElement('div');
        chatHistoryDiv.classList.add('chat-history-div');

        const chatHistoryTextareaElement = document.createElement('textarea');
        chatHistoryTextareaElement.placeholder = " Chat history will display here";
        chatHistoryTextareaElement.classList.add('chat-history-element');
        chatHistoryTextareaElement.id = "chatHistoryTextareaElementid";
        chatHistoryTextareaElement.spellcheck = false;
        chatHistoryTextareaElement.disabled = true;
        // chatHistoryTextareaElement.readOnly = true;


        const sendDiv = document.createElement('div');
        sendDiv.classList.add('send-div');

        const sendTextDiv = document.createElement('div');
        sendTextDiv.classList.add('send-text-div');

        const sendTextareaInputElement = document.createElement('textarea');
        this.defaultSendPlaceholder = "Text here\n\nctrl enter == send";
        sendTextareaInputElement.placeholder = this.defaultSendPlaceholder;
        sendTextareaInputElement.classList.add('send-text-input-element');
        sendTextareaInputElement.id = "sendTextInputBoxElementid";
        sendTextareaInputElement.spellcheck = true;
        sendTextareaInputElement.addEventListener('keydown', this.boundHandleKeyDown);
        // Focus event with an arrow function
        sendTextareaInputElement.addEventListener('focus', () => {
            this.shadowRoot.querySelector('#sendTextInputBoxElementid').placeholder = '';
        });
        // Blur event with an arrow function
        sendTextareaInputElement.addEventListener('blur', () => {
            this.shadowRoot.querySelector('#sendTextInputBoxElementid').placeholder = this.defaultSendPlaceholder;
        });





        /**
         *  TODO:
         * 
         * 
         * chat embers 
         * DONE - remove text here when clicked
         * mouseleave unborder
         * 
                * We do this elementry ok for now:
                                                *  Escape User Input:
                                                *  If user input is displayed back on the website (like in a comment section), 
                                                * make sure to escape the content to prevent
                                                *  the browser from interpreting it as executable code.
                * 
         * bonus:
         * Content Security Policy (CSP): Implementing a Content Security Policy helps mitigate XSS risks by specifying which sources are valid for executing scripts, styles, and other resources.
         */



        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons-div');

        const upButton = document.createElement('button');
        upButton.classList.add('secondary-message-buttons');
        upButton.textContent = "\u2191"; //settings gear is "\u2699"

        const sendButton = document.createElement('button');
        sendButton.classList.add('send-button');
        sendButton.id = "sendTextMessageButton";
        sendButton.textContent = "Send";
        sendButton.addEventListener('mousedown', this.onMouseDown);
        sendButton.addEventListener('mouseup', this.onMouseUp);
        sendButton.addEventListener('mouseleave', this.onMouseLeave);

        // sendButton.addEventListener('custom-click', this.sendThetextPressed);
        this.addEventListener('sendTextClicked', this.sendThetextPressedOrCtrlEnterPressed); //Send text event listener

        const downButton = document.createElement('button');
        downButton.classList.add('secondary-message-buttons');
        downButton.textContent = "\u2193";
        downButton.disabled = true;

        mainOutline.appendChild(chatHistoryDiv);
        chatHistoryDiv.appendChild(chatHistoryTextareaElement);

        buttonsDiv.appendChild(upButton);
        buttonsDiv.appendChild(sendButton);
        buttonsDiv.appendChild(downButton);
        sendTextDiv.appendChild(sendTextareaInputElement);
        sendDiv.appendChild(sendTextDiv);
        sendDiv.appendChild(buttonsDiv);
        container.appendChild(mainOutline);
        container.appendChild(sendDiv);
        // Append container to the shadowRoot
        this.shadowRoot.appendChild(container);

    }


    handleKeyDown(event) {
        //this handle's if the shift enter key is hit or something
        //if (event.key === 'Enter' && (event.shiftKey || event.ctrlKey)) {
        if (event.key === 'Enter' && event.ctrlKey) {
            const textarea = this.shadowRoot.querySelector('#sendTextInputBoxElementid');
            const currentPos = textarea.selectionStart;
            const currentVal = textarea.value;
            // textarea.value = currentVal.slice(0, currentPos) + "\n" + currentVal.slice(currentPos);
            event.preventDefault();

            textarea.selectionStart = textarea.selectionEnd = currentPos + 1;

            // this.sendThetextPressedOrCtrlEnterPressed();
            this.dispatchEvent(new Event('sendTextClicked'));
        }
    }

    sanitizeInput(str) {
        // very simple textarea Sanitization function
        /**
         * For high-security applications: it's generally recommended to use well-maintained libraries like DOMPurify or OWASP's Java HTML Sanitizer.
         * this function is not ^^^
         * 
         *          // Event listener for the button
            document.getElementById('submitButton').addEventListener('click', function() {
                    // Get the user input
            let userInput = document.getElementById('userInput').value;

                    // Sanitize the input
            let sanitizedInput = sanitizeInput(userInput);

                    // Display the sanitized input
            document.getElementById('output').innerText = sanitizedInput;
        });
        * 
        * 
        * 
        */
        // Remove JavaScript URLs
        str = str.replace(/javascript:/gi, "");

        // Whitelist approach: Allow only specific characters
        //str = str.replace(/[^a-zA-Z0-9 .,!?]/g, "");

        // Encoding tricks and control characters
        // ... Additional logic as needed ...

        // Basic HTML entity encoding
        str = str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        return str;
    }

    linkStyleSheet() {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "webComponents/ivwc-chat/IVWCchat.css");
        this.shadowRoot.appendChild(linkElem);
        this.addAndRemoveLoadListener(linkElem, 'load', 'cssLoaded');
    }

}

// Register the custom element
customElements.define("ivwc-chat", IVWCchat);
