document.addEventListener('DOMContentLoaded', () => {
    console.log("yes");
    const toggleBtn = document.querySelector('.toggle-btn');
    const navItems = document.querySelector('.navlist');
  
    toggleBtn.addEventListener('click', () => {
      navItems.classList.toggle('show');
    });
  });