/**
 * Theme utilities for dark / light mode
 */

export const getInitialTheme = () => {
  if (localStorage.theme) {
    return localStorage.theme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

export const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.theme = theme;
};
