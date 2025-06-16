document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('userForm').addEventListener('submit', (event) => {
        event.preventDefault(); 

        const name = document.getElementById('username').value;
        const email = document.getElementById('password').value;

        console.log("Name is" + name)


    });
});