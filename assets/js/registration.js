const mainRole = document.getElementById("mainRole");
const studentTypeBox = document.getElementById("studentTypeBox");
const studentType = document.getElementById("studentType");

// Forms
const schoolForm = document.getElementById("schoolForm");
const collegeForm = document.getElementById("collegeForm");
const studentRegister = document.getElementById("studentRegister");
const jobForm = document.getElementById("jobForm");
const recruiterForm = document.getElementById("recruiterForm");
const mentorForm = document.getElementById("mentorForm");

function hideAll() {
  studentTypeBox.classList.add("hide");
  schoolForm.classList.add("hide");
  collegeForm.classList.add("hide");
  studentRegister.classList.add("hide");
  jobForm.classList.add("hide");
  recruiterForm.classList.add("hide");
  mentorForm.classList.add("hide");
}

// Role changes
mainRole.addEventListener("change", () => {
  hideAll();

  if (mainRole.value === "student") {
    studentTypeBox.classList.remove("hide");
  } else if (mainRole.value === "job") {
    jobForm.classList.remove("hide");
  } else if (mainRole.value === "recruiter") {
    recruiterForm.classList.remove("hide");
  } else if (mainRole.value === "mentor") {
    mentorForm.classList.remove("hide");
  }
});

// STUDENT TYPE CHANGE
studentType.addEventListener("change", () => {
  schoolForm.classList.add("hide");
  collegeForm.classList.add("hide");

  if (studentType.value === "school") {
    schoolForm.classList.remove("hide");
  } else if (studentType.value === "college") {
    collegeForm.classList.remove("hide");
  }
});

function showError(input, message) {
  const error = input.nextElementSibling;
  input.classList.add("error-input");
  error.innerText = message;
}

function clearError(input) {
  const error = input.nextElementSibling;
  input.classList.remove("error-input");
  error.innerText = "";
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(form) {
  const inputs = form.querySelectorAll(".input");
  let valid = true;

  inputs.forEach((input) => {
    let value = input.value.trim();
    input.value = value;

    clearError(input);

    if (value === "") {
      showError(input, "This field is required");
      valid = false;
      return;
    }

    if (input.type === "email" && !isEmail(value)) {
      showError(input, "Enter valid email");
      valid = false;
    }

    if (input.placeholder === "Password" && value.length < 6) {
      showError(input, "Password must be at least 6 characters");
      valid = false;
    }

    if (input.placeholder === "Confirm Password") {
      const pwd = form.querySelector('input[placeholder="Password"]').value;
      if (value !== pwd) {
        showError(input, "Passwords do not match");
        valid = false;
      }
    }
  });

  return valid;
}

//  form submissions
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // terms
    const terms = form.querySelector(".termsCheck");
    const error = form.querySelector(".terms-error");
    error.innerText = "";

    if (!terms.checked) {
      error.innerText = "You must agree to Terms & Conditions";
      return;
    }

    if (validateForm(form)) {
      // local storage formdata arrange
      const formData = new FormData(form);
      const user = {};
      formData.forEach((value, key) => {
        user[key] = value;
      });
      // save user to local storage
      localStorage.setItem("path4careerUser", JSON.stringify(user));

      alert("Registration Successfully 🎉");

      setTimeout(() => {
        window.location.href = "./auth/login.html";
      }, 800);
    }
  });
});

// Continue Button With Validation
function showStudentRegister() {
  schoolForm.classList.add("hide");
  collegeForm.classList.add("hide");
  studentRegister.classList.remove("hide");
}

const schoolContinue = document.getElementById("schoolContinue");
const collegeContinue = document.getElementById("collegeContinue");

schoolContinue.addEventListener("click", () => {
  if (validateForm(schoolForm)) {
    showStudentRegister();
  }
});

collegeContinue.addEventListener("click", () => {
  if (validateForm(collegeForm)) {
    showStudentRegister();
  }
});
