
/** 
 * Page | Application
 * 
 * https://codepen.io/memetican/pen/MWRORwZ/8c423b39af936435a271fbdd2350b710
 */

import { IRouteHandler } from "@sygnal/sse";
 
const MAILJET_TEMPLATE_YES = '5842233';
const MAILJET_TEMPLATE_NO = '5836300';
const MAILJET_TEMPLATE_APPLY = '5842234';

export class ApplicationPage implements IRouteHandler {

  form: HTMLFormElement | null = null; 

  constructor() {
  }

  setup() {
        
  }

  exec() {

    const div = document.getElementById('application') as HTMLDivElement | null;
    if (!div) {
        console.error("Div with ID 'application' not found.");
        return;
    }

    this.form = div.querySelector('form') as HTMLFormElement | null;
    if (!this.form) {
        console.error("Form inside 'application' div not found.");
        return;
    }

    this.initializeForm();

  }

  /**
   * Display WaitButton 
   * Hides forms submit button, displays wait button 
   * @param formElement 
   */

  private waitButton(formElement: HTMLFormElement): void {
//      console.log("display waitButton");

      const actualButton = formElement.querySelector('[button-submit="actual"]') as HTMLElement | null;
      if (actualButton) {
          actualButton.style.display = 'none';
      }

      const waitButton = formElement.querySelector('[button-submit="wait"]') as HTMLElement | null;
      if (waitButton) {
          waitButton.style.display = 'block';
      }
  }

  private initializeForm(): void {

// console.log("init form"); 


      // Get customerId ( Airtable ID ) 
      // from local storage 
      const savedId = localStorage.getItem('customerId');
      if (savedId) {
//        console.log("init form", savedId); 
        const inputElement = this.form!.querySelector('#airtableId') as HTMLInputElement | null;
//        console.log("init form", inputElement); 
          if (inputElement) {
  //            console.log(savedId);
              inputElement.value = savedId;
          }
      } else {
          console.log('No ID found in localStorage.');
      }

      console.log("adding event listener for form submit");

      this.form!.addEventListener('submit', this.handleFormSubmit.bind(this, this.form!));
  }

  private determineEmailTemplate(): string {

    return MAILJET_TEMPLATE_YES; 

    // #region
    
    // const selectElement = document.getElementById('Tuition') as HTMLSelectElement | null;
    // const selectedValue = selectElement?.value.toLowerCase();

    // let mappedId: string | null;

    // switch (selectedValue) {
    //     case 'yes':
    //         mappedId = MAILJET_TEMPLATE_YES;
    //         break;
    //     case 'no':
    //         mappedId = MAILJET_TEMPLATE_NO;
    //         break;
    //     case 'apply':
    //         mappedId = MAILJET_TEMPLATE_APPLY;
    //         break;
    //     default:
    //         mappedId = null;
    //         console.error("Unable to identify template ID");
    // }

    // return mappedId?.toString() || '';

    // #endregion

  }

  private handleFormSubmit(form: HTMLFormElement, event: Event): void {
      event.preventDefault();

      console.log("formdata", form);

      // Display wait button
      this.waitButton(form);

      // Determine MailJet email template ID 
      const inputElement = this.form!.querySelector('#emailTemplateId') as HTMLInputElement | null;
      if (inputElement) {
          inputElement.value = this.determineEmailTemplate();
      }

      const formData = new FormData(form);
      const jsonData: { [key: string]: FormDataEntryValue } = {};
      formData.forEach((value, key) => {
          jsonData[key] = value;
      });

      const redirectUrl = form.getAttribute('data-redirect') || '';
      const webhookUrl = form.getAttribute('action') || '';

      console.log(jsonData);

      fetch(webhookUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
      })
      .then(response => response.json())
      .then(data => {

          window.location.href = '/final/thank-you';

          // const urls: { [key: string]: string } = {
          //     'yes': '/final/thank-you', 
          //     'no': '/final/thank-you',
          //     'apply': '/final/finance'
          // };

          // if (selectedValue && urls[selectedValue]) {
          //     window.location.href = urls[selectedValue];
          // } else {
          //     console.error('Invalid selection');
          // }
      })
      .catch(error => {
          console.error('Error submitting form to webhook:', error);
      });
  }

}
