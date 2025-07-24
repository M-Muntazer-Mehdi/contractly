import Quill from 'quill';

const Block = Quill.import('blots/block');

interface OrderedListFormat {
  'font-size'?: string;
  start?: number;
}

class CustomOrderedListStyle extends Block {
  static blotName = 'custom-ol';
  static tagName = 'OL';
  static className = 'custom-ordered-list';

  static create(value: OrderedListFormat = {}) {
    const node = super.create() as HTMLElement;

    // Handle start attribute
    if (value.start) {
      node.setAttribute('start', value.start.toString());
      node.style.setProperty('--custom-start', (value.start - 1).toString());
    }

    // Handle font-size
    if (value['font-size']) {
      node.style.fontSize = value['font-size'];
    }

    node.classList.add(this.className);
    return node;
  }

  static formats(domNode: HTMLElement): OrderedListFormat {
    const format: OrderedListFormat = {};
    const start = domNode.getAttribute('start');
    const fontSize = domNode.style.fontSize;

    if (start) format.start = parseInt(start, 10);
    if (fontSize) format['font-size'] = fontSize;

    return format;
  }

  format(name: string, value: any) {
    if (name === 'font-size') {
      (this.domNode as HTMLElement).style.fontSize = value;
    } else if (name === 'custom-ol') {
      if (value.start) {
        this.domNode.setAttribute('start', value.start.toString());
        this.domNode.style.setProperty('--custom-start', (value.start - 1).toString());
      }
      if (value['font-size']) {
        (this.domNode as HTMLElement).style.fontSize = value['font-size'];
      }
    } else {
      super.format(name, value);
    }
  }
}

export default CustomOrderedListStyle;