"use strict";
(() => {
  // src/page/pre-apply.ts
  var PreApplicationPage = class {
    constructor() {
    }
    setup() {
    }
    exec() {
      console.log("running pre-appl..");
      const div = document.getElementById("pre-application");
      if (!div) {
        console.error("Div with ID 'pre-application' not found.");
        return;
      }
      const form = div.querySelector("form");
      if (!form) {
        console.error("Form inside 'pre-application' div not found.");
        return;
      }
      form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }
    waitButton(formElement) {
      console.log("display waitButton");
      const actualButton = formElement.querySelector('[button-submit="actual"]');
      if (actualButton) {
        actualButton.style.display = "none";
      }
      const waitButton = formElement.querySelector('[button-submit="wait"]');
      if (waitButton) {
        waitButton.style.display = "block";
      }
    }
    handleFormSubmit(event) {
      event.preventDefault();
      const form = event.target;
      this.waitButton(form);
      console.log("formdata", form);
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
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      }).then((data) => {
        if (data && data.id) {
          console.log(data.id);
          localStorage.setItem("customerId", data.id);
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          console.error("ID was not returned from the webhook.");
        }
      }).catch((error) => {
        console.error("Error submitting form to webhook:", error);
      });
    }
  };
})();
//# sourceMappingURL=pre-apply.js.map
