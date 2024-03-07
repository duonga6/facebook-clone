import { createApp } from "vue";

export default function renderComponent({ el, component, props, appContext }) {
  let app = createApp(component, props);
  Object.assign(app._context, appContext);
  app.mount(el);

  return () => {
    app?.unmount(), (app = undefined);
  };
}
