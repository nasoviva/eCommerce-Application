import App from "./app/app";

const app: App = new App();
app.createView();

/////////////////////////////////////////
import { cssClasses } from "./app/global-types/constants";
import ElementCreator from "./app/shared/element-creator";

const element = new ElementCreator({
  tag: "button",
  className: [cssClasses.BUTTON],
  textContent: "button",
});

console.log(element["element"].nodeName);
