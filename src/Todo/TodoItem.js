import React, { useContext, memo, useRef, useState, useEffect } from "react";
import { Item, Button } from "./Styled";

import Checkbox from "./Checkbox";
import ThemeContext from "../Theme/ThemeContext";
import styles from "./Styles";
import Color from "color";
import elementResizeEvent from "element-resize-event";

const useSize = (defaultSize) => {
  const wrapperRef = useRef();

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { current } = wrapperRef;

    const updateHeight = () => {
      const element = wrapperRef.current;

      setSize({
        width: element.clientWidth,
        height: element.clientHeight
      });
    };

    updateHeight();
    elementResizeEvent(current, updateHeight);

    return () => elementResizeEvent.unbind(current);
  }, []);

  return [size, wrapperRef];
}

const getColors = (text, theme) => {
  const themeColor = styles[theme].todo.backgroundColor;
  const lengthPercentage = (text.length * 100) / 42;
  const darkenedColor = Color(themeColor).darken(lengthPercentage / 100);
  const background = `linear-gradient(90deg, ${themeColor} 0%, ${darkenedColor.hex()} 100%)`;
  const color = darkenedColor.isLight() ? "black" : "white";
  return { color, background };
};

const TodoItem = memo(({ todo, onChange, onDelete }) => {
  const [{width, height}, wrapperRef] = useSize({width: 0, height: 0});
  const theme = useContext(ThemeContext);

  const ageColors = React.useMemo(() => getColors(todo.text, theme), [
    todo.text,
    theme
  ]);

  return (
    <Item
      ref={wrapperRef}
      key={todo.id}
      theme={theme}
      ageColors={ageColors}
      striped={height > 53}
      animating={!todo.completed}
    >
      <Checkbox
        id={todo.id}
        label={todo.text}
        checked={todo.completed}
        onChange={onChange.bind(this, todo.id)}
      />
      <code style={{ flex: "0 0 50px", margin: "0 5px" }}>
        {width}×{height}
      </code>
      <Button onClick={onDelete.bind(this, todo.id)} theme={theme}>
        x
      </Button>
    </Item>
  );
});

export default TodoItem;
