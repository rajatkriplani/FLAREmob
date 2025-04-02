document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide // Assuming lucide is exposed globally
  lucide.createIcons()

  // Get DOM elements
  const navItems = document.querySelectorAll(".nav-item")
  const pageSections = document.querySelectorAll(".page-section")
  const resetButton = document.getElementById("resetButton")
  const cameraButton = document.getElementById("camera-button")
  const toggleInputs = document.querySelectorAll(".toggle-input")
  const dropZones = document.querySelectorAll(".drop-zone")
  const themeToggle = document.getElementById("theme-toggle-input")

  // Function to update active navigation link
  function updateActiveNavLink(sectionId) {
    navItems.forEach((item) => {
      const itemSection = item.getAttribute("data-section")
      if (itemSection === sectionId) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  }

  // Function to show page section
  function showPageSection(sectionId) {
    pageSections.forEach((section) => {
      section.classList.add("hidden")
    })

    const sectionToShow = document.getElementById(`${sectionId}-section`)
    if (sectionToShow) {
      sectionToShow.classList.remove("hidden")
      document.title = `FLARE - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`
    }

    updateActiveNavLink(sectionId)
  }

  // Navigation links event listeners
  navItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault()
      const sectionId = this.getAttribute("data-section")
      showPageSection(sectionId)
      window.location.hash = `#${sectionId}`
    })
  })

  // Initial page load
  function loadInitialSection() {
    const hash = window.location.hash.substring(1)
    const initialSection = hash || "dashboard"
    showPageSection(initialSection)
  }

  loadInitialSection()

  // Handle browser back/forward navigation
  window.addEventListener("hashchange", loadInitialSection)

  // Reset button functionality
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const now = new Date().toLocaleString()
      document.getElementById("lastResetTime").textContent = now
      alert("Simulating Liquid Galaxy Rig Re-launch. Timestamp updated.")
    })
  }

  // Camera button functionality
  if (cameraButton) {
    cameraButton.addEventListener("click", () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request camera permission
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            alert("Camera access granted. In a real app, this would open the camera for QR scanning.")
            // In a real app, this would initialize a QR scanner
            stream.getTracks().forEach((track) => track.stop()) // Stop the camera stream
          })
          .catch((error) => {
            alert("Camera access denied or error: " + error.message)
          })
      } else {
        alert("Sorry, your browser does not support camera access")
      }
    })
  }

  // Toggle switch functionality
  toggleInputs.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      // The CSS handles the visual changes
    })
  })

  // File upload handling
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", function (e) {
      e.preventDefault()
      this.style.borderColor = "#3b82f6"
      this.style.backgroundColor = "rgba(59, 130, 246, 0.05)"
    })

    zone.addEventListener("dragleave", function () {
      this.style.borderColor = ""
      this.style.backgroundColor = ""
    })

    zone.addEventListener("drop", function (e) {
      e.preventDefault()
      this.style.borderColor = ""
      this.style.backgroundColor = ""

      // Handle file upload logic
      const files = e.dataTransfer.files
      if (files.length) {
        // Display file name or process the file
        alert(`File dropped: ${files[0].name}`)
      }
    })

    // Also handle click to browse files
    zone.addEventListener("click", () => {
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = ".csv"
      fileInput.style.display = "none"

      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
          // Handle the selected file
          alert(`File selected: ${e.target.files[0].name}`)
        }
      })

      document.body.appendChild(fileInput)
      fileInput.click()
      document.body.removeChild(fileInput)
    })
  })

  // Theme toggle functionality
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-theme")
    themeToggle.checked = true
  }

  // Theme toggle event listener
  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-theme")
      localStorage.setItem("theme", "dark")
    } else {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
    }
  })

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.body.classList.add("dark-theme")
          themeToggle.checked = true
        } else {
          document.body.classList.remove("dark-theme")
          themeToggle.checked = false
        }
      }
    })
  }
})

