
/** 
 * Page | Pre-Application
 * 
 * https://codepen.io/memetican/pen/yLrPGYQ/3eab16e69849194fc44b47213d764241
 */

import { IRouteHandler } from "@sygnal/sse";
 

export class PreApplicationPage implements IRouteHandler {

  constructor() {
  }

  setup() {
        
  }

  exec() {

    console.log("running pre-appl..")

    const div = document.getElementById('pre-application');
    if (!div) {
      console.error("Div with ID 'pre-application' not found.");
      return;
    }

    const form = div.querySelector('form') as HTMLFormElement | null;
    if (!form) {
      console.error("Form inside 'pre-application' div not found.");
      return;
    }

    form.addEventListener('submit', this.handleFormSubmit.bind(this));

  }



  /**
   * Handles the display of the wait button and hides the actual button.
   * @param formElement - The form element containing the buttons.
   */
  private waitButton(formElement: HTMLFormElement): void {
    console.log("display waitButton");

    // Locate the "actual" button and hide it
    const actualButton = formElement.querySelector('[button-submit="actual"]') as HTMLElement | null;
    if (actualButton) {
      actualButton.style.display = 'none';
    }

    // Locate the "wait" button and show it as block
    const waitButton = formElement.querySelector('[button-submit="wait"]') as HTMLElement | null;
    if (waitButton) {
      waitButton.style.display = 'block';
    }
  }

  /**
   * Handles the form submission event.
   * @param event - The form submission event.
   */
  private handleFormSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
  
    const form = event.target as HTMLFormElement;
    this.waitButton(form);
  
    console.log("formdata", form);
  
    const formData = new FormData(form);
  
    // Convert FormData to an object manually
    const jsonData: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
  
    // data-redirect
    const redirectUrl = form.getAttribute('data-redirect') || '';
    const webhookUrl = form.getAttribute('action') || '';
  
    console.log(jsonData);
  
    // Send the form data to the webhook URL
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Assuming 'id' is the key in the response that holds the needed ID
        if (data && data.id) {
          // Store the ID in localStorage
          console.log(data.id);
          localStorage.setItem('customerId', data.id);
  
          // Redirect the user
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          // Handle the error if the response doesn't include an ID
          console.error('ID was not returned from the webhook.');
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error submitting form to webhook:', error);
      });
  }
  
}
