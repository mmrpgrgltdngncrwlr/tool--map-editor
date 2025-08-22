// src/lib/ericchase/WebPlatform_Node_Reference_Class.ts
class Class_WebPlatform_Node_Reference_Class {
  node;
  constructor(node) {
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
    throw new TypeError(`Reference node ${this.node} is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
function WebPlatform_Node_Reference_Class(node) {
  return new Class_WebPlatform_Node_Reference_Class(node);
}

// src/lib/components/floating-panel.module.ts
var next_id = 0;
var next_offset_x = 20;
var next_offset_y = 20;

class FloatingPanel {
  div_panel;
  static Base_Z_Index = 100;
  static Panel_Set = new Set;
  button_lock;
  button_minimize;
  div_content;
  div_header;
  id;
  is_locked = false;
  is_minimized = false;
  offset_x = 0;
  offset_y = 0;
  constructor(div_panel) {
    this.div_panel = div_panel;
    FloatingPanel.Panel_Set.add(this);
    this.id = next_id++;
    const { offset_x, offset_y } = getPanelOffset(this.id);
    if (offset_x !== undefined) {
      this.offset_x = offset_x;
    } else {
      this.offset_x += next_offset_x;
      next_offset_x += 20;
    }
    if (offset_y !== undefined) {
      this.offset_y = offset_y;
    } else {
      this.offset_y += offset_y ?? next_offset_y;
      next_offset_y += 20;
    }
    this.button_lock = WebPlatform_Node_Reference_Class(div_panel.querySelector("button#lock-panel")).as(HTMLButtonElement);
    this.button_minimize = WebPlatform_Node_Reference_Class(div_panel.querySelector("button#minimize-panel")).as(HTMLButtonElement);
    this.div_content = WebPlatform_Node_Reference_Class(div_panel.querySelector("div#panel-content")).as(HTMLDivElement);
    this.div_header = WebPlatform_Node_Reference_Class(div_panel.querySelector("div#panel-header")).as(HTMLDivElement);
    this.button_lock.onclick = () => this.toggle_locked();
    this.button_minimize.onclick = () => this.toggle_minimized();
    this.div_panel.onmousedown = (event) => this.toggle_dragging(event);
    this.div_panel.style.setProperty("left", this.offset_x + "px");
    this.div_panel.style.setProperty("top", this.offset_y + "px");
  }
  toggle_dragging(event) {
    if (event.target !== this.div_content && event.target !== this.div_header || this.is_locked) {
      return;
    }
    setTimeout(() => {
      let z_index = 0;
      for (const panel of FloatingPanel.Panel_Set) {
        panel.div_panel.classList.add("disable-select");
        if (panel !== this) {
          panel.div_panel.style.setProperty("z-index", (FloatingPanel.Base_Z_Index + z_index).toString());
          z_index++;
        }
      }
      this.div_panel.style.setProperty("z-index", (FloatingPanel.Base_Z_Index + z_index).toString());
    }, 0);
    let startX = event.clientX;
    let startY = event.clientY;
    const onmousemove = (event2) => {
      this.offset_x += event2.clientX - startX;
      this.offset_y += event2.clientY - startY;
      this.div_panel.style.setProperty("left", this.offset_x + "px");
      this.div_panel.style.setProperty("top", this.offset_y + "px");
      startX = event2.clientX;
      startY = event2.clientY;
    };
    const onmouseup = () => {
      document.removeEventListener("mousemove", onmousemove);
      document.removeEventListener("mouseup", onmouseup);
      setPanelOffset(this.id, this.offset_x, this.offset_y);
      setTimeout(() => {
        for (const panel of FloatingPanel.Panel_Set) {
          panel.div_panel.classList.remove("disable-select");
        }
      }, 0);
    };
    document.addEventListener("mousemove", onmousemove);
    document.addEventListener("mouseup", onmouseup);
  }
  toggle_minimized() {
    this.is_minimized = !this.is_minimized;
    if (this.is_minimized === true) {
      this.button_minimize.textContent = "+";
      this.div_content.classList.add("hidden");
    } else {
      this.button_minimize.textContent = "-";
      this.div_content.classList.remove("hidden");
    }
  }
  toggle_locked() {
    this.is_locked = !this.is_locked;
    if (this.is_locked === true) {
      this.button_lock.textContent = "L";
      this.div_content.style.setProperty("cursor", "default");
      this.div_header.style.setProperty("cursor", "default");
    } else {
      this.button_lock.textContent = "O";
      this.div_content.style.setProperty("cursor", "default");
      this.div_header.style.setProperty("cursor", "move");
    }
  }
}
function getPanelOffset(id) {
  const data = JSON.parse(localStorage.getItem(`${FloatingPanel.name}#${id}`) ?? "{}");
  return { offset_x: data.offset_x, offset_y: data.offset_y };
}
function setPanelOffset(id, offset_x, offset_y) {
  const data = JSON.parse(localStorage.getItem(`${FloatingPanel.name}#${id}`) ?? "{}");
  data.offset_x = offset_x;
  data.offset_y = offset_y;
  localStorage.setItem(`${FloatingPanel.name}#${id}`, JSON.stringify(data));
}
export {
  FloatingPanel
};
