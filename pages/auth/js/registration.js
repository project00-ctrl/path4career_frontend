document.addEventListener("DOMContentLoaded", () => {

  const mainRole = document.getElementById("mainRole");
  const studentTypeBox = document.getElementById("studentTypeBox");
  const studentType = document.getElementById("studentType");
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


  async function registerUser(payload) {
    const res = await fetch(API_BASE_URL + "/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(errBody.error || 'Registration failed');
    }
  }


  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const terms = form.querySelector(".termsCheck");
      const error = form.querySelector(".terms-error");
      if (error) error.innerText = "";

      if (terms && !terms.checked) {
        if (error) error.innerText = "You must agree to Terms & Conditions";
        return;
      }
      if (!validateForm(form)) return;

      let payload = null;

      // STUDENT
      if (form === studentRegister) {
        payload = {
          username: document.getElementById("studentName").value,
          email: document.getElementById("studentEmail").value,
          password: document.getElementById("studentPassword").value,
          role: "STUDENT",
          studentType: studentType.value
        };
      }

      // JOB SEEKER
      if (form === jobForm) {
        payload = {
          username: document.getElementById("jobName").value,
          email: document.getElementById("jobEmail").value,
          password: document.getElementById("jobPassword").value,
          role: "JOB_SEEKER"
        };
      }

      // RECRUITER
      if (form === recruiterForm) {
        payload = {
          username: document.getElementById("recruiterName").value,
          email: document.getElementById("recruiterEmail").value,
          password: document.getElementById("recruiterPassword").value,
          role: "RECRUITER"
        };
      }

      // MENTOR
      if (form === mentorForm) {
        payload = {
          username: document.getElementById("mentorName").value,
          email: document.getElementById("mentorEmail").value,
          password: document.getElementById("mentorPassword").value,
          role: "MENTOR"
        };
      }

      try {
        await registerUser(payload);
        alert("Registration Successful 🎉");
        window.location.href = "login.html";
      } catch (err) {
        alert(err.message);
      }
    });
  });

  function showStudentRegister() {
    schoolForm.classList.add("hide");
    collegeForm.classList.add("hide");
    studentRegister.classList.remove("hide");
  }

  document.getElementById("schoolContinue").addEventListener("click", () => {
    if (validateForm(schoolForm)) showStudentRegister();
  });

  document.getElementById("collegeContinue").addEventListener("click", () => {
    if (validateForm(collegeForm)) showStudentRegister();
  });

});
