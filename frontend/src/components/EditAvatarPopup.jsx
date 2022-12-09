import PopupWithForm from "./PopupWithForm";
import {useEffect, useRef} from 'react';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const newAvatar = useRef();
  useEffect(()=>{
    newAvatar.current.value ="";
  }, [isOpen]);

  return (
    <PopupWithForm name="avatar" title="Обновить аватар" isOpen={isOpen} onClose={onClose} 
      buttonText={"Сохранить"} 
      onSubmit={(e) => { e.preventDefault(); onUpdateAvatar({avatar:newAvatar.current.value}); }} >
        <input type="url" className="form__item" id="avatar-link" name="avatar__link" ref={newAvatar} required placeholder="Ссылка на изображение"/>
        <span className="avatar-link-error form__item-error"></span>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;