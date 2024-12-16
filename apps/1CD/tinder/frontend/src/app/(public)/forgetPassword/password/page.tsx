import SetPassword from "@/components/register/SetPassword";
import { cookies } from "next/headers";


const PasswordPage = async() => {

  const authToken=await cookies().get('authToken')?.value ||'';
  return (
    <div>
      <SetPassword authToken={authToken}/>
    </div>
  );
};
export default PasswordPage;
