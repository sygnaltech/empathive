"use strict";
(() => {
  // src/page/apply.ts
  var MAILJET_TEMPLATE_YES = "5842233";
  var ApplicationPage = class {
    constructor() {
      this.form = null;
    }
    setup() {
    }
    exec() {
      const div = document.getElementById("application");
      if (!div) {
        console.error("Div with ID 'application' not found.");
        return;
      }
      this.form = div.querySelector("form");
      if (!this.form) {
        console.error("Form inside 'application' div not found.");
        return;
      }
      this.initializeForm();
    }
    waitButton(formElement) {
      const actualButton = formElement.querySelector('[button-submit="actual"]');
      if (actualButton) {
        actualButton.style.display = "none";
      }
      const waitButton = formElement.querySelector('[button-submit="wait"]');
      if (waitButton) {
        waitButton.style.display = "block";
      }
    }
    initializeForm() {
      const savedId = localStorage.getItem("customerId");
      if (savedId) {
        const inputElement = this.form.querySelector("#airtableId");
        if (inputElement) {
          inputElement.value = savedId;
        }
      } else {
        console.log("No ID found in localStorage.");
      }
      console.log("adding event listener for form submit");
      this.form.addEventListener("submit", this.handleFormSubmit.bind(this, this.form));
    }
    determineEmailTemplate() {
      return MAILJET_TEMPLATE_YES;
    }
    handleFormSubmit(form, event) {
      event.preventDefault();
      console.log("formdata", form);
      this.waitButton(form);
      const inputElement = this.form.querySelector("#emailTemplateId");
      if (inputElement) {
        inputElement.value = this.determineEmailTemplate();
      }
      const formData = new FormData(form);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });
      const redirectUrl = form.getAttribute("data-redirect") || "";
      const webhookUrl = form.getAttribute("action") || "";
      console.log(jsonData);
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      }).then((response) => response.json()).then((data) => {
        window.location.href = "/final/thank-you";
      }).catch((error) => {
        console.error("Error submitting form to webhook:", error);
      });
    }
  };
})();
//# sourceMappingURL=apply.js.map
