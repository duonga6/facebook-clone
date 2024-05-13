export function onInputChangeHeight(e) {
  const textareaElement = e.target;
  textareaElement.style.height = 0;
  textareaElement.style.height = textareaElement.scrollHeight + "px";
}
