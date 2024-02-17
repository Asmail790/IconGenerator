
export function SignInRequest(props:{message?:string}) {

  const message = props.message??  "To see this page you need to sign in."
  return<div className="m-auto">
    <p className="text-base py-4 font">{message}</p>
  </div>;
}
