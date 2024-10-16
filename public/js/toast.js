console.log('Toast script loaded');
function showToast(message, type = 'success', duration = 3000) {
	const toastContainer = document.getElementById('toast-container');
	
	if (!toastContainer) return;
  
	// Create a new toast element
	const toast = document.createElement('div');
	toast.classList.add('toast', type);
	toast.innerText = message;
  
	// Append the toast to the container
	toastContainer.appendChild(toast);
  
	// Automatically hide the toast after the specified duration
	setTimeout(() => {
	  toast.classList.add('fade-out');
	  toast.addEventListener('transitionend', () => toast.remove());
	}, duration);
  }