import PageWithForm from "./PageWithForm";

function Register(props) {
  return (
    <PageWithForm
      title="Регистрация"
      buttonText="Зарегистрироваться"
      onSubmit={props.onRegister}
      isRegister={true}
    />
  );
}

export default Register;
