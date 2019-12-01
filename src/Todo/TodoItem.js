import React, { useContext, memo } from "react";
import styled from "@emotion/styled";
import Checkbox from "./Checkbox";
import ThemeContext from "../Theme/ThemeContext";
import styles from "./Styles";
import Color from "color";

const Button = styled("button")`
  font-weight: 400;
  color: ${props => styles[props.theme].todo.button.color};
  font-size: 0.75em;
  border: 1px solid transparent;
  background-color: transparent;
  margin: 5px;
  cursor: pointer;
`;
const Item = styled("li")`
  font-size: 1.75em;
  padding: 0.25em 0.25em 0.25em 0.5em;
  background: ${props => props.ageColors.background};
  color: ${props => props.ageColors.color};
  border-bottom: 1px solid
    ${props => styles[props.theme].todo.item.borderBottom};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-of-type {
    border-bottom: none;
  }
`;

const getColors = (text, theme) => {
  console.log("figuring...");
  const themeColor = styles[theme].todo.backgroundColor;
  console.log("themeColor", themeColor);
  const lengthPercentage = (text.length * 100) / 42;
  console.log("lengthPercentage", lengthPercentage);
  const darkenedColor = Color(themeColor).darken(lengthPercentage / 100);
  console.log("darkenedColor", darkenedColor);
  const background = `linear-gradient(90deg, ${themeColor} 0%, ${darkenedColor.hex()} 100%)`;
  const color = darkenedColor.isLight() ? "black" : "white";
  return { color, background };
};

const TodoItem = memo(({ todo, onChange, onDelete }) => {
  const theme = useContext(ThemeContext);

  const ageColors = React.useMemo(() => getColors(todo.text, theme),[todo.text, theme]);
  console.log(ageColors, theme, "ageColors");
  return (
    <Item key={todo.id} theme={theme} ageColors={ageColors}>
      <Checkbox
        id={todo.id}
        label={todo.text}
        checked={todo.completed}
        onChange={onChange.bind(this, todo.id)}
      />
      <Button onClick={onDelete.bind(this, todo.id)} theme={theme}>
        x
      </Button>
    </Item>
  );
});

export default TodoItem;
