import { WebPlatform_Node_Reference_Class } from '../ericchase/WebPlatform_Node_Reference_Class.js';

let next_id = 0;
let next_offset_x = 20;
let next_offset_y = 20;

export class FloatingPanel {
  static Base_Z_Index = 100;
  static Panel_Set = new Set<FloatingPanel>();

  readonly button_minimize: HTMLButtonElement;
  readonly div_content: HTMLDivElement;
  readonly div_header: HTMLDivElement;

  id: number;
  is_minimized = false;
  offset_x = 0;
  offset_y = 0;

  constructor(readonly div_panel: HTMLDivElement) {
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

    this.button_minimize = WebPlatform_Node_Reference_Class(div_panel.querySelector('button#minimize-panel')).as(HTMLButtonElement);
    this.div_content = WebPlatform_Node_Reference_Class(div_panel.querySelector('div#panel-content')).as(HTMLDivElement);
    this.div_header = WebPlatform_Node_Reference_Class(div_panel.querySelector('div#panel-header')).as(HTMLDivElement);

    this.button_minimize.onclick = () => this.toggle_minimized();
    this.div_panel.onmousedown = (event) => this.toggle_dragging(event);

    this.div_panel.style.setProperty('left', this.offset_x + 'px');
    this.div_panel.style.setProperty('top', this.offset_y + 'px');
  }

  toggle_dragging(event: MouseEvent) {
    if (event.target !== this.div_content && event.target !== this.div_header) {
      return;
    }

    // disable user-select
    setTimeout(() => {
      let z_index = 0;
      for (const panel of FloatingPanel.Panel_Set) {
        panel.div_panel.classList.add('disable-select');
        if (panel !== this) {
          panel.div_panel.style.setProperty('z-index', (FloatingPanel.Base_Z_Index + z_index).toString());
          z_index++;
        }
      }
      this.div_panel.style.setProperty('z-index', (FloatingPanel.Base_Z_Index + z_index).toString());
    }, 0);

    let startX = event.clientX;
    let startY = event.clientY;
    const onmousemove = (event: MouseEvent) => {
      this.offset_x += event.clientX - startX;
      this.offset_y += event.clientY - startY;
      this.div_panel.style.setProperty('left', this.offset_x + 'px');
      this.div_panel.style.setProperty('top', this.offset_y + 'px');
      startX = event.clientX;
      startY = event.clientY;
    };
    const onmouseup = () => {
      document.removeEventListener('mousemove', onmousemove);
      document.removeEventListener('mouseup', onmouseup);
      setPanelOffset(this.id, this.offset_x, this.offset_y);
      // enable user-select
      setTimeout(() => {
        for (const panel of FloatingPanel.Panel_Set) {
          panel.div_panel.classList.remove('disable-select');
        }
      }, 0);
    };
    document.addEventListener('mousemove', onmousemove);
    document.addEventListener('mouseup', onmouseup);
  }

  toggle_minimized() {
    this.is_minimized = !this.is_minimized;
    if (this.is_minimized === true) {
      this.button_minimize.textContent = '+';
      this.div_content.classList.add('hidden');
    } else {
      this.button_minimize.textContent = '-';
      this.div_content.classList.remove('hidden');
    }
  }
}

function getPanelOffset(id: number): { offset_x?: number; offset_y?: number } {
  const data = JSON.parse(localStorage.getItem(`${FloatingPanel.name}#${id}`) ?? '{}');
  return { offset_x: data.offset_x, offset_y: data.offset_y };
}

function setPanelOffset(id: number, offset_x: number, offset_y: number): void {
  const data = JSON.parse(localStorage.getItem(`${FloatingPanel.name}#${id}`) ?? '{}');
  data.offset_x = offset_x;
  data.offset_y = offset_y;
  localStorage.setItem(`${FloatingPanel.name}#${id}`, JSON.stringify(data));
}
