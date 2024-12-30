const Views = globalThis['Views'] = {
  debug: true,
  registerView(viewName, view) {
    let canDraw = true;

    if (typeof viewName === 'string') {
      if (typeof (Views[viewName]) !== 'undefined') {
        if (Views.debug) {
          console.warn(
            `Overriding the vue ${viewName} because another view has been registered with the same viewName.`,
          );
        }

        canDraw = false;
      }
    } else {
      console.error('Trying to register a view without giving a viewName.');
      return null;
    }
    if (typeof (view.selector) === 'undefined') {
      if (Views.debug) {
        console.warn(
          `Trying to register view ${viewName} but the view doesn't have a selector key, it won't be drawn.`,
        );
      }

      canDraw = false;
    }
    if (typeof (view.html) === 'undefined') {
      if (typeof (view.selector) !== 'undefined') {
        console.error(`Trying to register view ${viewName} with a selector but no html method. View not registered.`);
        return null;
      }
    }
    if (canDraw) {
      Views.views.push(viewName);
    }

    Views[viewName] = view;
    return view;
  },
  views: [],
  draw() {
    for (const view of Views.views) {
      const element = document.querySelector(Views[view].selector);
      if (!element) throw Error(`Invalid selector for view ${view}`);

      element.innerHTML = Views[view].html();
    }
  },
};
