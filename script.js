document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide // Assuming lucide is exposed globally
  lucide.createIcons()

  // Handle splash screen
  const splashScreen = document.getElementById("splash-screen")

  // Fix: Ensure splash screen is removed after a delay
  setTimeout(() => {
    splashScreen.classList.add("splash-hidden")
    setTimeout(() => {
      splashScreen.style.display = "none"
    }, 300)
  }, 1000) // Reduced to 1 second to avoid getting stuck

  // Get DOM elements
  const navItems = document.querySelectorAll(".nav-item")
  const sidebarLinks = document.querySelectorAll(".sidebar-link")
  const pageSections = document.querySelectorAll(".page-section")
  const resetButton = document.getElementById("resetButton")
  const cameraButton = document.getElementById("camera-button")
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabPanes = document.querySelectorAll(".tab-pane")
  const themeToggle = document.getElementById("theme-toggle-input")
  const uploadArea = document.querySelector(".upload-area")
  const fileInfo = document.querySelector(".file-info")

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

    sidebarLinks.forEach((item) => {
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

  // Sidebar links event listeners
  sidebarLinks.forEach((item) => {
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

  // Tab functionality
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Show corresponding tab pane
      tabPanes.forEach((pane) => pane.classList.remove("active"))
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })

  // Upload area functionality
  if (uploadArea && fileInfo) {
    uploadArea.addEventListener("click", () => {
      const fileInput = document.createElement("input")
      fileInput.type = "file"
      fileInput.accept = ".csv"
      fileInput.style.display = "none"

      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
          const file = e.target.files[0]
          // Show file info
          fileInfo.classList.remove("hidden")
          uploadArea.classList.add("hidden")

          // Update file name and size
          const fileName = fileInfo.querySelector(".file-name")
          const fileSize = fileInfo.querySelector(".file-size")

          if (fileName && fileSize) {
            fileName.textContent = file.name
            fileSize.textContent = formatFileSize(file.size)
          }
        }
      })

      document.body.appendChild(fileInput)
      fileInput.click()
      document.body.removeChild(fileInput)
    })

    // Remove file button
    const removeFileBtn = fileInfo.querySelector(".icon-button")
    if (removeFileBtn) {
      removeFileBtn.addEventListener("click", () => {
        fileInfo.classList.add("hidden")
        uploadArea.classList.remove("hidden")
      })
    }
  }

  // Reset button functionality
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const now = new Date().toLocaleString()
      document.getElementById("lastResetTime").textContent = now

      // Show success toast
      showToast("System re-launched successfully", "success")
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
            showToast("Camera access granted. Scan QR code now.", "info")
            // In a real app, this would initialize a QR scanner
            stream.getTracks().forEach((track) => track.stop()) // Stop the camera stream
          })
          .catch((error) => {
            showToast("Camera access denied: " + error.message, "error")
          })
      } else {
        showToast("Your browser does not support camera access", "error")
      }
    })
  }

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
      showToast("Dark theme activated", "info")
    } else {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
      showToast("Light theme activated", "info")
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

  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Toast notification system
  function showToast(message, type = "info") {
    // Create toast element
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`

    // Create icon based on type
    const icon = document.createElement("i")
    icon.setAttribute("data-lucide", type === "success" ? "check-circle" : type === "error" ? "alert-circle" : "info")

    // Create message element
    const messageEl = document.createElement("span")
    messageEl.textContent = message

    // Append elements
    toast.appendChild(icon)
    toast.appendChild(messageEl)

    // Add to document
    document.body.appendChild(toast)

    // Initialize icon
    lucide.createIcons({
      icons: {
        "check-circle": icon,
        "alert-circle": icon,
        info: icon,
      },
    })

    // Animate in
    setTimeout(() => {
      toast.classList.add("show")
    }, 10)

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }

  // Add toast styles dynamically
  const toastStyles = document.createElement("style")
  toastStyles.textContent = `
    .toast {
      position: fixed;
      bottom: calc(var(--nav-height) + 1rem);
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      display: flex;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background-color: var(--card-bg);
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      z-index: 9999;
      opacity: 0;
      transition: transform var(--transition-normal), opacity var(--transition-normal);
    }
    
    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    
    .toast i {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.75rem;
    }
    
    .toast-success {
      border-left: 4px solid var(--success);
    }
    
    .toast-success i {
      color: var(--success);
    }
    
    .toast-error {
      border-left: 4px solid var(--danger);
    }
    
    .toast-error i {
      color: var(--danger);
    }
    
    .toast-info {
      border-left: 4px solid var(--primary);
    }
    
    .toast-info i {
      color: var(--primary);
    }

    @media (min-width: 900px) {
      .toast {
        bottom: 2rem;
      }
    }
  `
  document.head.appendChild(toastStyles)
})

