document.addEventListener("DOMContentLoaded", () => {

  const TOKEN = 'a1a53b3b-e020-4563-a1e8-452dd444bb16';
  const api = new window.Api({
    baseUrl: 'https://around-api.en.tripleten-services.com/v1',
    headers: {
      authorization: 'a1a53b3b-e020-4563-a1e8-452dd444bb16',
      'Content-Type': 'application/json'
    }
  });


  const profileNameEl = document.querySelector('.profile__name');
  const profileDescEl = document.querySelector('.profile__description');
  const profileAvatarEl = document.querySelector('.profile__avatar');
  const cardsListEl = document.querySelector('.cards__list');
  const cardTemplate = document.querySelector('#card-template').content;
  const editProfileBtn = document.querySelector('[data-open-profile]');
  const addPostBtn = document.querySelector('[data-open-new-post]');
  const profileModal = document.getElementById('profile-modal');
  const newPostModal = document.getElementById('new-post-modal');
  const previewModal = document.getElementById('preview-modal');


  const editProfileForm = document.getElementById('edit-profile-form');
  const newPostForm = document.getElementById('new-post-form');


  let selectedCardElement = null;
  let selectedCardId = null;
  let currentUserId = null;


  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('modal_opened');
    document.addEventListener('keydown', onEscClose);
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('modal_opened');
    document.removeEventListener('keydown', onEscClose);
  }
  function onEscClose(e) { if (e.key === 'Escape') {
    const opened = document.querySelector('.modal_opened');
    if (opened) closeModal(opened);
  }}


  function createCardElement(cardData) {
    const el = cardTemplate.cloneNode(true);
    const li = el.querySelector('.card');
    const img = el.querySelector('.card__image');
    const title = el.querySelector('.card__title');
    const deleteBtn = el.querySelector('.card__delete-btn');
    const likeBtn = el.querySelector('.card__like-btn');

    img.src = cardData.link;
    img.alt = cardData.name;
    title.textContent = cardData.name;


    if (cardData.owner && cardData.owner !== currentUserId) {
      deleteBtn.style.display = 'none';
    } else {
      deleteBtn.style.display = '';
    }


    let isLiked = false;
    if (typeof cardData.isLiked !== 'undefined') {
      isLiked = !!cardData.isLiked;
    } else if (Array.isArray(cardData.likes)) {
      isLiked = cardData.likes.some(l => l === currentUserId || (l._id && l._id === currentUserId));
    }
    if (isLiked) likeBtn.classList.add('card__like-btn_active');


    likeBtn.addEventListener('click', () => {
      likeBtn.disabled = true;
      const doAdd = !likeBtn.classList.contains('card__like-btn_active');
      (doAdd ? api.addLike(cardData._id) : api.removeLike(cardData._id))
        .then((updatedCard) => {
          if (Array.isArray(updatedCard.likes)) {
            const nowLiked = updatedCard.likes.some(l => l === currentUserId || (l._id && l._id === currentUserId));
            if (nowLiked) likeBtn.classList.add('card__like-btn_active');
            else likeBtn.classList.remove('card__like-btn_active');
          } else if (typeof updatedCard.isLiked !== 'undefined') {
            if (updatedCard.isLiked) likeBtn.classList.add('card__like-btn_active');
            else likeBtn.classList.remove('card__like-btn_active');
          }
        })
        .catch(console.error)
        .finally(() => { likeBtn.disabled = false; });
    });


    img.addEventListener('click', () => {
      const previewImg = previewModal.querySelector('.modal__preview-content img');
      const previewTitle = previewModal.querySelector('.modal__preview-content h3') || previewModal.querySelector('.modal__title');
      if (previewImg) {
        previewImg.src = cardData.link;
        previewImg.alt = cardData.name;
      }
      openModal(previewModal);
    });


    deleteBtn.addEventListener('click', () => {
      selectedCardElement = li;
      selectedCardId = cardData._id;
      const confirmModal = document.getElementById('confirm-modal');
      openModal(confirmModal);
    });

    return li;
  }


  function renderCards(cardsArray) {
    cardsListEl.innerHTML = '';
    cardsArray.forEach(cd => {
      const cardEl = createCardElement(cd);
      cardsListEl.prepend(cardEl);
    });
  }


  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id || userData.id;
      profileNameEl.textContent = userData.name || '';
      profileDescEl.textContent = userData.about || userData.description || '';
      profileAvatarEl.src = userData.avatar || profileAvatarEl.src;
      renderCards(cards || []);
    })
    .catch(err => console.error(err));


  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = editProfileForm.querySelector('.modal__submit-btn');
    const name = editProfileForm.querySelector('#profile-name').value;
    const description = editProfileForm.querySelector('#profile-description').value;
    submitBtn.textContent = 'Saving...';
    api.editUserInfo({ name, about: description })
      .then((updated) => {
        profileNameEl.textContent = updated.name;
        profileDescEl.textContent = updated.about || description;
        closeModal(profileModal);
      })
      .catch(console.error)
      .finally(() => { submitBtn.textContent = 'Save'; });
  });


  newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = newPostForm.querySelector('.modal__submit-btn');
    const title = newPostForm.querySelector('#post-title').value;
    const link = newPostForm.querySelector('#post-link').value;
    submitBtn.textContent = 'Saving...';
    api.addCard({ name: title, link })
      .then((card) => {
        const newCardEl = createCardElement(card);
        cardsListEl.prepend(newCardEl);
        closeModal(newPostModal);
        newPostForm.reset();
      })
      .catch(console.error)
      .finally(() => { submitBtn.textContent = 'Save'; });
  });


  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) {
    const confirmForm = confirmModal.querySelector('.modal__form--confirm');
    confirmForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = confirmForm.querySelector('.modal__submit-btn');
      btn.textContent = 'Deleting...';
      api.removeCard(selectedCardId)
        .then(() => {
          if (selectedCardElement && selectedCardElement.parentNode) {
            selectedCardElement.remove();
          }
          closeModal(confirmModal);
        })
        .catch(console.error)
        .finally(() => { btn.textContent = 'Yes'; });
    });
  }



  const avatarModal = document.getElementById('avatar-modal');
  const editAvatarForm = document.getElementById('edit-avatar-form');
  if (editAvatarForm) {
    editAvatarForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = editAvatarForm.querySelector('.modal__submit-btn');
      const avatarLink = editAvatarForm.querySelector('#avatar-link').value;
      submitBtn.textContent = 'Saving...';
      api.editAvatar({ avatar: avatarLink })
        .then((updated) => {
          profileAvatarEl.src = updated.avatar || avatarLink;
          closeModal(avatarModal);
          editAvatarForm.reset();
        })
        .catch(console.error)
        .finally(() => { submitBtn.textContent = 'Save'; });
    });
  }

  const openButtons = document.querySelectorAll('[data-open]');
  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-open');
      const modal = document.getElementById(target);
      if (window.resetValidation) {
        try {
          window.resetValidation(modal.querySelector('.modal__form'), window.validationConfig);
        } catch (e) {}
      }
      openModal(modal);
    });
  });
  const closeButtons = document.querySelectorAll('.modal__close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

});
