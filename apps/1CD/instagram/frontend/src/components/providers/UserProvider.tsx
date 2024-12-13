// 'use client';

// import { useRouter } from 'next/navigation';
// import { createContext, PropsWithChildren, useContext, useState, useEffect } from 'react';
// import { User, useSignupMutation, useGetUserLazyQuery, useLoginMutation, useConfirmFollowReqMutation, FollowStatus } from 'src/generated';

// type SignUp = {
//   email: string;
//   fullName: string;
//   userName: string;
//   password: string;
// };

// type LogIn = {
//   email: string;
//   password: string;
// };

// type ConfirmFollowRequest = {
//   status: string;
// };

// type AuthContextType = {
//   signup: (_params: SignUp) => void;
//   login: (_params: LogIn) => void;
//   confirmFollowReq: (_params: ConfirmFollowRequest) => void;
//   confirmReq: FollowStatus;

//   user: User | null;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({ children }: PropsWithChildren) => {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [status, setStatus] = useState(FollowStatus.Pending);

//   const [signupMutation] = useSignupMutation({
//     onCompleted: (data) => {
//       localStorage.setItem('token', data.signup.token);
//       setUser(data.signup.user as User);
//       router.push('/login');
//     },
//   });
//   const signup = async ({ email, password, fullName, userName }: SignUp) => {
//     await signupMutation({
//       variables: {
//         input: {
//           email,
//           password,
//           fullName,
//           userName,
//         },
//       },
//     });
//   };

//   const [confirmFollowReqMutation] = useConfirmFollowReqMutation({
//     onCompleted: (data) => {
//       setStatus(FollowStatus.Approved);
//     },
//   });

//   const confirmFollowReq = async ({ status }: ConfirmFollowRequest) => {
//     await confirmFollowReqMutation({
//       variables: {
//         status,
//       },
//     });
//   };

//   const [signinMutation] = useLoginMutation({
//     onCompleted: (data) => {
//       localStorage.setItem('token', data.login.token);
//       setUser(data.login.user as User);
//       router.push('/');
//     },
//   });

//   const [getUser] = useGetUserLazyQuery({
//     onCompleted: (data) => {
//       setUser(data.getUser);
//     },
//   });

//   const login = async ({ email, password }: LogIn) => {
//     await signinMutation({
//       variables: {
//         input: {
//           email,
//           password,
//         },
//       },
//     });
//   };

//   useEffect(() => {
//     getUser();
//   }, [getUser]);

//   return <AuthContext.Provider value={{ signup, user, login, confirmReq, confirmFollowReq }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);
