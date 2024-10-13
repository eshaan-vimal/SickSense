document.addEventListener('DOMContentLoaded', function() {
    // Initially, show the demographics page by default
    showPage('demographics');
});

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}
document.getElementById('demographics-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const bloodType = document.getElementById('blood-type').value;
    const medicalHistory = document.getElementById('medical-history').value;

    // Save the data in local storage (or send it to the server)
    const userData = {
        name,
        age,
        gender,
        height,
        weight,
        bloodType,
        medicalHistory
    };

    localStorage.setItem('userDemographics', JSON.stringify(userData));

    // Optionally, display a success message
    alert('User demographics saved successfully!');

    // Clear the form fields (optional)
    document.getElementById('demographics-form').reset();
});
