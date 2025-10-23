document.addEventListener("DOMContentLoaded", () => {
  const initialCards = [
    {
      name: "Val Thorens",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    },
    {
      name: "Restaurant terrace",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    },
    {
      name: "An outdoor cafe",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    },
    {
      name: "A very long bridge, over the forest and through the trees",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    },
    {
      name: "Tunnel with morning light",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    },
    {
      name: "Mountain house",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    },
  ];

  const profileModal = document.querySelector("#profile-modal");
  const profileForm = document.forms["profile-form"];
  const nameInput = profileForm.querySelector(".modal__input_type_name");
  const descriptionInput = profileForm.querySelector(
    ".modal__input_type_description"
  );
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");

  const previewModal = document.querySelector("#preview-modal");
  const previewImage = previewModal.querySelector(".modal__image");
  const previewCaption = previewModal.querySelector(".modal__caption");

  const newPostModal = document.querySelector("#new-post-modal");
  const newPostForm = document.forms["new-post-form"];
  const titleInput = newPostForm.querySelector("#post-title");
  const linkInput = newPostForm.querySelector("#post-link");

  const cardContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template").content;

  const profileEditBtn = document.querySelector(".profile__edit-btn");
  const newPostButton = document.querySelector(".profile__add-btn");

  function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscClose);
  }

  function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscClose);
  }

  function handleEscClose(evt) {
    if (evt.key === "Escape") {
      const openModalElement = document.querySelector(".modal_opened");
      if (openModalElement) {
        closeModal(openModalElement);
      }
    }
  }

  function openProfileModal() {
    resetValidation(profileForm, validationConfig);
    nameInput.value = profileName.textContent;
    descriptionInput.value = profileDescription.textContent;
    openModal(profileModal);
  }

  function getCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
    const cardImage = cardElement.querySelector(".card__image");
    const cardTitle = cardElement.querySelector(".card__title");
    const likeButton = cardElement.querySelector(".card__like-btn");
    const deleteButton = cardElement.querySelector(".card__delete-btn");

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;

    likeButton.addEventListener("click", () => {
      likeButton.classList.toggle("card__like-btn_active");
    });

    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this card?")) {
        cardElement.remove();
      }
    });

    cardImage.addEventListener("click", () => {
      previewImage.src = data.link;
      previewImage.alt = data.name;
      previewCaption.textContent = data.name;
      openModal(previewModal);
    });

    return cardElement;
  }

  function renderCard(data, method = "prepend") {
    const card = getCardElement(data);
    cardContainer[method](card);
  }

  initialCards.forEach((cardData) => renderCard(cardData));

  profileEditBtn.addEventListener("click", openProfileModal);

  newPostButton.addEventListener("click", () => {
    openModal(newPostModal);
  });

  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newCardData = {
      name: titleInput.value,
      link: linkInput.value,
    };
    renderCard(newCardData);
    closeModal(newPostModal);
    resetFormState(newPostForm, validationConfig);
  });

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    profileName.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    closeModal(profileModal);
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("modal")) {
        closeModal(modal);
      }
    });
  });

  const closeButtons = document.querySelectorAll(".modal__close-btn");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalElement = button.closest(".modal");
      closeModal(modalElement);
    });
  });

  enableValidation(validationConfig);
});
