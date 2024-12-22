type ErrorScreenProps = {
    message: string;
  };
  
  const ErrorScreen = ({ message }: ErrorScreenProps) => {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>{message}</p>
      </div>
    );
  };
  
  export default ErrorScreen;
  