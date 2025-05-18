import css from "./not-found.module.css";

export const ELEM_PARAMS = {
  mainContainer: {
    tag: "div",
    className: [css.mainContainer],
    textContent: "",
  },
  msg: {
    tag: "p",
    className: css.msg.split(" "),
    textContent: "Jokes on you, there is no such page.",
  },
  backBtn: {
    tag: "button",
    className: css.button.split(" "),
    textContent: "To the main page",
  },
};
