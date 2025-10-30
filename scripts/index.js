import Api from "../scripts/Api.js";
import {
  enableValidation,
  resetValidation,
  validationConfig,
} from "../scripts/validation.js";

document.addEventListener("DOMContentLoaded", () => {
  const TOKEN = "a1a53b3b-e020-4563-a1e8-452dd444bb16";

  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: TOKEN,
      "Content-Type": "application/json",
    },
  });

  const profileNameEl = document.querySelector(".profile__name");
  const profileDescEl = document.querySelector(".profile__description");
  const profileAvatarEl = document.querySelector(".profile__avatar");
  const cardsListEl = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template").content;
  const editProfileForm = document.getElementById("edit-profile-form");
  const newPostForm = document.getElementById("new-post-form");
  const profileModal = document.getElementById("profile-modal");
  const newPostModal = document.getElementById("new-post-modal");
  const previewModal = document.getElementById("preview-modal");
  const confirmModal = document.getElementById("confirm-modal");
  const avatarModal = document.getElementById("avatar-modal");
  const editAvatarForm = document.getElementById("edit-avatar-form");

  enableValidation(validationConfig);

  let selectedCardElement = null;
  let selectedCardId = null;
  let currentUserId = null;

  function openModal(modal) {
    if (!modal) return;
    if (modal.querySelector(".modal__form")) {
      resetValidation(modal.querySelector(".modal__form"), validationConfig);
    }
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", onEscClose);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", onEscClose);
  }

  function onEscClose(e) {
    if (e.key === "Escape") {
      const opened = document.querySelector(".modal_opened");
      if (opened) closeModal(opened);
    }
  }

  function createCardElement(cardData) {
    const el = cardTemplate.cloneNode(true);
    const li = el.querySelector(".card");
    const img = el.querySelector(".card__image");
    const title = el.querySelector(".card__title");
    const deleteBtn = el.querySelector(".card__delete-btn");
    const likeBtn = el.querySelector(".card__like-btn");

    img.src = cardData.link;
    img.alt = cardData.name;
    title.textContent = cardData.name;

    if (
      cardData.owner &&
      cardData.owner !== currentUserId &&
      cardData.owner._id !== currentUserId
    ) {
      deleteBtn.style.display = "none";
    } else {
      deleteBtn.style.display = "";
    }

    let isLiked = false;
    if (Array.isArray(cardData.likes)) {
      isLiked = cardData.likes.some((l) => l._id === currentUserId);
    } else if (typeof cardData.isLiked !== "undefined") {
      isLiked = !!cardData.isLiked;
    }
    if (isLiked) likeBtn.classList.add("card__like-btn_active");

    likeBtn.addEventListener("click", () => {
      likeBtn.disabled = true;
      const doAdd = !likeBtn.classList.contains("card__like-btn_active");
      (doAdd ? api.addLike(cardData._id) : api.removeLike(cardData._id))
        .then((updatedCard) => {
          const nowLiked = Array.isArray(updatedCard.likes)
            ? updatedCard.likes.some((l) => l._id === currentUserId)
            : !!updatedCard.isLiked;
          likeBtn.classList.toggle("card__like-btn_active", nowLiked);
        })
        .catch(console.error)
        .finally(() => {
          likeBtn.disabled = false;
        });
    });

    img.addEventListener("click", () => {
      const previewImg = previewModal.querySelector(".modal__image");
      const previewCaption = previewModal.querySelector(".modal__caption");
      if (previewImg) {
        previewImg.src = cardData.link;
        previewImg.alt = cardData.name;
      }
      if (previewCaption) previewCaption.textContent = cardData.name;
      openModal(previewModal);
    });

    deleteBtn.addEventListener("click", () => {
      selectedCardElement = li;
      selectedCardId = cardData._id;
      openModal(confirmModal);
    });

    return li;
  }

  function renderCards(cardsArray) {
    cardsListEl.innerHTML = "";
    cardsArray.forEach((cd) => {
      const cardEl = createCardElement(cd);
      cardsListEl.prepend(cardEl);
    });
  }

  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id || userData.id;
      profileNameEl.textContent = userData.name || "";
      profileDescEl.textContent = userData.about || userData.description || "";
      profileAvatarEl.src = userData.avatar || profileAvatarEl.src;
      renderCards(cards || []);
    })
    .catch((err) => console.error(err));

  editProfileForm &&
    editProfileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = editProfileForm.querySelector(".modal__submit-btn");
      const name = editProfileForm.querySelector("#profile-name").value;
      const description = editProfileForm.querySelector(
        "#profile-description"
      ).value;
      submitBtn.textContent = "Saving...";
      api
        .editUserInfo({ name, about: description })
        .then((updated) => {
          profileNameEl.textContent = updated.name;
          profileDescEl.textContent = updated.about || description;
          closeModal(profileModal);
        })
        .catch(console.error)
        .finally(() => {
          submitBtn.textContent = "Save";
        });
    });

  newPostForm &&
    newPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = newPostForm.querySelector(".modal__submit-btn");
      const title = newPostForm.querySelector("#post-title").value;
      const link = newPostForm.querySelector("#post-link").value;
      submitBtn.textContent = "Saving...";
      api
        .addCard({ name: title, link })
        .then((card) => {
          const newCardEl = createCardElement(card);
          cardsListEl.prepend(newCardEl);
          closeModal(newPostModal);
          newPostForm.reset();
        })
        .catch(console.error)
        .finally(() => {
          submitBtn.textContent = "Save";
        });
    });

  if (confirmModal) {
    const confirmForm = confirmModal.querySelector(".modal__form--confirm");
    confirmForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = confirmForm.querySelector(".modal__submit-btn");
      btn.textContent = "Deleting...";
      api
        .removeCard(selectedCardId)
        .then(() => {
          if (selectedCardElement && selectedCardElement.parentNode)
            selectedCardElement.remove();
          closeModal(confirmModal);
        })
        .catch(console.error)
        .finally(() => {
          btn.textContent = "Yes";
        });
    });
  }

  if (editAvatarForm) {
    editAvatarForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = editAvatarForm.querySelector(".modal__submit-btn");
      const avatarLink = editAvatarForm.querySelector("#avatar-link").value;
      submitBtn.textContent = "Saving...";
      api
        .editAvatar({ avatar: avatarLink })
        .then((updated) => {
          profileAvatarEl.src = updated.avatar || avatarLink;
          closeModal(avatarModal);
          editAvatarForm.reset();
        })
        .catch(console.error)
        .finally(() => {
          submitBtn.textContent = "Save";
        });
    });
  }

  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-open");
      const modal = document.getElementById(target);
      openModal(modal);
    });
  });

  document.querySelectorAll(".modal__close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      closeModal(modal);
    });
  });
});
