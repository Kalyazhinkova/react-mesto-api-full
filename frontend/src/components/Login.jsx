import PageWithForm from "./PageWithForm";

function Login(props) {
  return (
    <PageWithForm
      title="Вход"
      buttonText="Войти"
      onSubmit={props.onLogin}
      isRegister={false}
    />
  );
}

export default Login;
