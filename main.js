const userTable = document.querySelector('table');
const editContainer = document.querySelector('.edit-container');
const editUserBtn = document.querySelector('.edit-user');
const addUserBtn = document.querySelector('.add-user');
const popUpError = document.querySelector('.popup-error');
const popUpSuccess = document.querySelector('.popup-succes');
const closeBtn = document.querySelectorAll('.close-button');
const main = document.querySelector('body');
const imageAlbum = document.querySelector('.image-album');
const closeAlbumBtn = document.querySelector('.close-album');
let data1;
let editingUser;
let userId;
let canSend = false;


const renderUsers = () => {
    userTable.innerHTML = `
          <tr>
              <th>Id</th>
              <th>Mail</th>
              <th>Nazwisko</th>
              <th>Usuń</th>
              <th>Edycja</th>
              <th>Pokaż zdjęcia</th>
          </tr>
          `;

          data1.forEach((user, index) => {

            const userItem = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.email}</td>
                <td>${user.name}</td>
                <td class="delete-person"><img src="icons8-close.svg" alt=""></td>
                <td class="edit-person"><img src="icons8-edit.svg" alt=""></td>
                <td><button class="show-image">Pokaż zdjęcia</button></td>
            </tr>
            `;

            userTable.innerHTML += userItem;
        });
}

const emailCheck = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

const fetchData = () => {
    fetch('https://jsonplaceholder.typicode.com/users/') 
    .then((response) => response.json())
    .then((data) => {
        data1 = data;
        renderUsers();
    });

    return data1;
};

const showPopUp = (popUp, activeClass) => {
    popUp.classList.add(activeClass);

    setTimeout(() => {
        popUp.classList.remove(activeClass);
    }, 3000);
}

const addUser = () => {
    const newMail = document.querySelector('input[name="add-mail"]'),
    newName = document.querySelector('input[name="add-last-name"]');

    const newUser = {
        id: data1.length + 1,
        email: newMail.value,
        name: newName.value
    };

    data1.forEach((item) => {
        if(item.name !== newName.value && item.email !== newMail.value) {
            canSend = true;
        } else {
            canSend = false;
        }
    });

    if(newMail.value === '' || newName.value === '') {
        newMail.style.borderColor = "red";
        newName.style.borderColor = "red";
    } else if(!emailCheck(newMail.value)) {
        newMail.style.borderColor = "red";
        newName.style.borderColor = "red";
    } else {
        if(canSend) {
            data1.push(newUser);

            newMail.style.borderColor = "";
            newName.style.borderColor = "";

            newMail.value = "";
            newName.value = "";

            showPopUp(popUpSuccess, 'success--active');
        }

        renderUsers();
    }
};

const editUser = () => {
    const mailInput = document.querySelector('input[name="mail"]');
    const lastNameInput = document.querySelector('input[name="last-name"]');

    if(mailInput.value === '' || lastNameInput.value === '') {
        mailInput.style.borderColor = "red";
        lastNameInput.style.borderColor = "red";
    } else if(!emailCheck(mailInput.value)) {
        mailInput.style.borderColor = "red";
        lastNameInput.style.borderColor = "red";
    } else {

        showPopUp(popUpSuccess, 'success--active');
        data1[editingUser].email = mailInput.value;
        data1[editingUser].name = lastNameInput.value;
        
        editContainer.style.display = "none";

        renderUsers();
    }
};

const removeUser = e => {
    if(e.target.tagName === "IMG") {
        const deleteBtn = [...document.querySelectorAll('.delete-person img')],
            editBtn = [...document.querySelectorAll('.edit-person img')],
            deleteBtnIndex = deleteBtn.indexOf(e.target),
            editBtnIndex = editBtn.indexOf(e.target);

          data1 = data1.filter((item, index) => {
            return index !== deleteBtnIndex;
          });

        editBtn.forEach((item) => {
            if(item.contains(e.target)) {
                editContainer.style.display = "";

                editingUser = editBtnIndex;
                }
            });
        renderUsers();
    }
};

const showAlbum = e => {
    const currentAlbum = e.target;
    const showAlbumsBtn = [...document.querySelectorAll('.show-image')];
    const showAlbumIndex = showAlbumsBtn.indexOf(currentAlbum);
    const albumHeader = document.querySelector('.album-header');
    const imageContainer = document.querySelector('.images-container');


    if (currentAlbum.tagName === "BUTTON") {
        fetch(`https://jsonplaceholder.typicode.com/users/${data1[showAlbumIndex].id}/albums`)
        .then(response => response.json())
        .then(data => {

            if(data1[showAlbumIndex].id < 11) {
                fetch(`https://jsonplaceholder.typicode.com/albums/${data[0].id}/photos`)
                .then(response => response.json())
                .then(photos => {
                    albumHeader.innerHTML = `
                    <h2>Tytuł Albumu</h2>
                    <h3>${data[0].title}</h3>
                    `;

                    imageContainer.innerHTML = "";
                    
                    photos.forEach((photo) => {
                        const userPhotos = `
                        <div class="image-item"><img src="${photo.url}" alt=""></div>
                        `;
                        
                        imageContainer.innerHTML += userPhotos;
                    });

                    imageAlbum.style.display = "block";
                });
            } else {
                showPopUp(popUpError, 'error--active');
            }
            
        });
    }
};

window.addEventListener('load', () => {
    fetchData();
});

userTable.addEventListener('click', (e) => {
    removeUser(e);
    showAlbum(e);
});

editUserBtn.addEventListener('click', editUser);

addUserBtn.addEventListener('click', addUser);

closeBtn.forEach((item) =>{
    item.addEventListener('click', (e) =>{
        const popUp = e.target.parentNode;

        if(popUp.classList.contains('popup-succes')) {
            popUpSuccess.classList.remove('success--active');
        }

        if(popUp.classList.contains('popup-error')) {
            popUpError.classList.remove('error--active');
        }
    });
});

closeAlbumBtn.addEventListener('click', () => {
    imageAlbum.style.display = "none";
});

main.addEventListener('click', (e) => {
    const currentItem = e.target;
   
    if(!editContainer.contains(currentItem) && currentItem.tagName !== "IMG") {
        editContainer.style.display = "none";
    }
   
    if(!popUpSuccess.contains(currentItem) && currentItem !== addUserBtn && currentItem !== editUserBtn) {
        popUpSuccess.classList.remove('popup-succes--active');
    }
});

