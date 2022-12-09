import styled from "styled-components";
import { animateHover } from "../styles/animation";

export const PrimaryButton = styled.button<any>`
  background: black;
  border-radius: 50px;
  border: 1px solid #000;
  display: inline-block;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: white;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  min-width: 100px;
  margin: 0;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  padding: 8px 20px;
  :hover {
    background: transparent;
    color: #000;
    animation: ${animateHover} ease-in-out infinite 2s;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: #000;
  :hover {
    background: black;
    color: white;
  }
`;
