import create from "zustand";

interface Checkbox {
  id: string;
  label: string;
  checked: boolean;
}

interface Radio {
  label: string;
  id: string;
  name?:string
}

interface State {
  checkboxes: Checkbox[];
  setCheckboxes: (newCheckboxes: Checkbox[]) => void;
  updateCheckboxLabel: (index: number, newLabel: string) => void;
  addCheckboxs: () => void;
  emptyCheckboxes: () => void;
  deleteCheckboxs: (index: number) => void;
  setRequiredCheckbox: (type: boolean) => void;

  radios: Radio[];
  setRadios: (newRadios: Radio[]) => void;
  addRadioss: () => void;
  emptyRadios: () => void;
  deleteRadios: (index: number) => void;
  updateRadioLabel: (index: number, newLabel: string) => void;

  requiredCheckbox: boolean;
  textFields: any;
  setTextFields: (newTextField: {}) => void;
}

const useStore = create<State>((set) => ({
  checkboxes: [],
  textFields: {},
  requiredCheckbox: false,
  setCheckboxes: (newCheckboxes) => set({ checkboxes: newCheckboxes }),
  updateCheckboxLabel: (index, newLabel) =>
    set((state) => ({
      checkboxes: state.checkboxes.map((checkbox, idx) =>
        idx === index ? { ...checkbox, label: newLabel } : checkbox
      ),
    })),
  addCheckboxs: () => {
    set((state) => {
      const newIndex = state.checkboxes.length + 1;
      const checkboxId = `checkbox_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newCheckbox: Checkbox = {
        id: checkboxId,
        label: `Checkbox ${newIndex}`,
        checked: false,
      };
      return { checkboxes: [...state.checkboxes, newCheckbox] };
    });
  },
  emptyCheckboxes: () => {
    set({ checkboxes: [] });
  },
  deleteCheckboxs: (index: number) =>
    set((state) => ({
      checkboxes: state.checkboxes.filter((_, idx) => idx !== index),
    })),

  setRequiredCheckbox: (type: boolean) => {
    set({ requiredCheckbox: type });
  },

  radios: [],
  setRadios: (newRadios) => set({ radios: newRadios }),

  addRadioss: () => {
    set((state) => {
      const newIndex = state.radios.length + 1;
      const radioId = `radio${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newRadio: Radio = {
        id: radioId,
        label: `Radio ${newIndex}`,        
      };
      return { radios: [...state.radios, newRadio] };
    });
  },

  emptyRadios: () => {
    set({ radios: [] });
  },

  deleteRadios: (index: number) =>
    set((state) => ({
      radios: state.radios.filter((_, idx) => idx !== index),
    })),

  updateRadioLabel: (index: any, newLabel: any) =>
    set((state) => ({
      radios: state.radios.map((radio, idx) =>
        idx === index ? { ...radio, label: newLabel } : radio
      ),
    })),
  setTextFields: (newField) => {
    set({ textFields: newField });
  },
}));

export default useStore;
