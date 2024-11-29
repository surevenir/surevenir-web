import { Bars } from "react-loader-spinner";

export const LoaderComponent = () => {
  return (
    <>
      <Bars
        height="20"
        width="100"
        color="#4fa94d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </>
  );
};
