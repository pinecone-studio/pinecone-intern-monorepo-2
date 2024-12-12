import Password from "@/components/register/CreatePassword";
import { cookies } from "next/headers";


const PasswordPage = async() => {

  const authToken=await cookies().get('authToken')?.value ||'';
  return (
    <div>
      <Password authToken={authToken}/>
    </div>
  );
};
export default PasswordPage;
