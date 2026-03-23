const showUsersBtn = document.getElementById('show-users-btn');
const usersList = document.getElementById('profile-list');
// const sortBtn = document.getElementById('sort-btn');

showUsersBtn.addEventListener('click', () => {
  if (usersList.style.display === 'none') {
    usersList.style.display = 'flex';
  } else {
    usersList.style.display = 'none';
  }
});
