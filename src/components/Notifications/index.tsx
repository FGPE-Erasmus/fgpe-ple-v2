// @flow

import React from "react";

const Ctx = React.createContext({
  add: (value: string) => {},
  remove: (id: any) => {},
});

// Styled Components
// ==============================

const ToastContainer = (props: any) => (
  <div style={{ position: "fixed", right: 0, top: 0 }} {...props} />
);

const Toast = ({ children, onDismiss }: { children: any; onDismiss: any }) => (
  <div
    style={{
      background: "LemonChiffon",
      cursor: "pointer",
      fontSize: 14,
      margin: 10,
      padding: 10,
      color: "black",
    }}
    onClick={onDismiss}
  >
    {children}
  </div>
);

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<any | any[]>([]);

  const add = (content: any) => {
    const id = toastCount++;
    const toast = { content, id };
    setToasts([...toasts, toast]);
  };
  const remove = (id: any) => {
    const newToasts = toasts.filter((t: any) => t.id !== id);
    setToasts(newToasts);
  };
  // avoid creating a new fn on every render
  const onDismiss = (id: any) => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {children}
      <ToastContainer>
        {toasts.map(({ content, id, ...rest }: { content: any; id: any }) => (
          <Toast key={id} onDismiss={onDismiss(id)} {...rest}>
            {id + 1} &mdash; {content}
          </Toast>
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useToasts = () => React.useContext(Ctx);
