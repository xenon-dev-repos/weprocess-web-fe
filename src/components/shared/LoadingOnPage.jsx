import React from "react";
import styled from "styled-components";
import { ScaleLoader } from "react-spinners";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const LoadingOnPage = () => {
  return (
    <ModalWrapper>
      <ScaleLoader color="#043F35" />
    </ModalWrapper>
  );
};

export default LoadingOnPage;



