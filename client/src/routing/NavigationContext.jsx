import { createContext, useContext } from "react";

export const NavigationContext = createContext({
  navigate: () => {},
  registerNavigationCleanup: () => () => {},
});

export function NavigationProvider({ value, children }) {
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}

export function RouteLink({ to, onClick, children, ...props }) {
  const { navigate } = useNavigation();
  return (
    <a
      href={to}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
